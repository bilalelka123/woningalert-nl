import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }
  const resultaten = await voerScrapeUit()
  return NextResponse.json(resultaten)
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }
  const resultaten = await voerScrapeUit()
  return NextResponse.json(resultaten)
}

async function voerScrapeUit() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const startTijd = Date.now()
  let nieuweWoningen = 0
  let totaalGevonden = 0

  try {
    const { data: bestaande } = await supabase
      .from('gevonden_woningen')
      .select('external_id')

    const bestaandeIds = new Set(bestaande?.map((w: any) => w.external_id) || [])
    const parariusWoningen = await scrapePararius()
    totaalGevonden += parariusWoningen.length

    for (const woning of parariusWoningen) {
      if (!woning.external_id || bestaandeIds.has(woning.external_id)) continue
      const { error } = await supabase.from('gevonden_woningen').insert(woning)
      if (!error) {
        nieuweWoningen++
        bestaandeIds.add(woning.external_id)
      }
    }

    const { data: alleWoonwensen } = await supabase
      .from('woonwensen')
      .select('*')
      .eq('actief', true)

    const { data: recenteWoningen } = await supabase
      .from('gevonden_woningen')
      .select('*')
      .gte('gevonden_op', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())

    let matches = 0

    for (const woonwens of alleWoonwensen || []) {
      for (const woning of recenteWoningen || []) {
        const { data: bestaandMatch } = await supabase
          .from('user_woningen')
          .select('id')
          .eq('user_id', woonwens.user_id)
          .eq('woning_id', woning.id)
          .single()

        if (bestaandMatch) continue
        if (!passBijWoonwensen(woning, woonwens)) continue

        await supabase.from('user_woningen').insert({
          user_id: woonwens.user_id,
          woning_id: woning.id,
        })

        await supabase.from('meldingen').insert({
          user_id: woonwens.user_id,
          woning_id: woning.id,
          type: 'nieuwe_woning',
          titel: `Nieuwe woning in ${woning.stad}`,
          bericht: `${woning.titel} - €${woning.prijs},-/mnd`,
        })

        matches++
      }
    }

    await supabase.from('scrape_logs').insert({
      platform: 'pararius',
      woningen_gevonden: totaalGevonden,
      nieuwe_woningen: nieuweWoningen,
      matches,
      duur_ms: Date.now() - startTijd,
    })

    return {
      success: true,
      totaal_gevonden: totaalGevonden,
      nieuwe_woningen: nieuweWoningen,
      matches,
      duur_ms: Date.now() - startTijd,
    }

  } catch (error) {
    console.error('Scrape fout:', error)
    return {
      success: false,
      error: String(error),
      duur_ms: Date.now() - startTijd,
    }
  }
}

function passBijWoonwensen(woning: any, woonwens: any): boolean {
  if (woning.prijs) {
    if (woning.prijs < woonwens.min_prijs) return false
    if (woning.prijs > woonwens.max_prijs) return false
  }
  if (woning.kamers && woning.kamers < woonwens.min_kamers) return false
  if (woonwens.stad && woning.stad) {
    const woningStad = woning.stad.toLowerCase()
    const woonwensStad = woonwens.stad.toLowerCase()
    if (!woningStad.includes(woonwensStad) && !woonwensStad.includes(woningStad)) {
      return false
    }
  }
  return true
}

async function scrapePararius(): Promise<any[]> {
  const woningen: any[] = []

  const steden = [
    { naam: 'Eindhoven', slug: 'eindhoven' },
    { naam: 'Tilburg', slug: 'tilburg' },
    { naam: 'Breda', slug: 'breda' },
    { naam: 'Den Bosch', slug: 's-hertogenbosch' },
    { naam: 'Helmond', slug: 'helmond' },
  ]

  for (const stad of steden) {
    try {
      const response = await fetch(
        `https://www.pararius.nl/huurwoningen/${stad.slug}/rss`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; WoningAlert/1.0)',
            'Accept': 'application/rss+xml, application/xml, text/xml',
          },
          next: { revalidate: 0 },
        }
      )

      if (!response.ok) {
        console.log(`Pararius RSS ${stad.naam}: HTTP ${response.status}`)
        continue
      }

      const xml = await response.text()
      const itemRegex = /<item>([\s\S]*?)<\/item>/g
      const items = [...xml.matchAll(itemRegex)]

      for (const item of items) {
        const content = item[1]
        const titel =
          content.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
          content.match(/<title>(.*?)<\/title>/)?.[1] || ''
        const link =
          content.match(/<link>(.*?)<\/link>/)?.[1] || ''
        const beschrijving =
          content.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || ''

        if (!link || !titel) continue

        const externalId = `par-${link.split('/').filter(Boolean).pop()}`
        const prijsMatch = beschrijving.match(/€\s*([\d.,]+)/) || titel.match(/€\s*([\d.,]+)/)
        const prijs = prijsMatch
          ? parseInt(prijsMatch[1].replace('.', '').replace(',', ''))
          : null
        const fotoMatch = content.match(/<enclosure[^>]*url="([^"]+)"/) ||
          beschrijving.match(/<img[^>]*src="([^"]+)"/)
        const fotoUrl = fotoMatch?.[1] || null

        let type = 'appartement'
        if (link.includes('huis') || titel.toLowerCase().includes('huis')) type = 'huis'
        if (link.includes('studio') || titel.toLowerCase().includes('studio')) type = 'studio'
        if (link.includes('kamer') || titel.toLowerCase().includes('kamer')) type = 'kamer'

        woningen.push({
          external_id: externalId,
          titel: titel.trim(),
          prijs,
          stad: stad.naam,
          url: link,
          foto_url: fotoUrl,
          platform: 'pararius',
          type_woning: type,
          gevonden_op: new Date().toISOString(),
          actief: true,
        })
      }

      await new Promise(r => setTimeout(r, 500))

    } catch (err) {
      console.error(`Pararius RSS ${stad.naam} fout:`, err)
      continue
    }
  }

  return woningen
}
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const FUNDA_FEEDS = [
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["noord-brabant"]&price="0-1500"', stad: 'Noord-Brabant' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["den-bosch"]', stad: 'Den Bosch' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["eindhoven"]', stad: 'Eindhoven' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["tilburg"]', stad: 'Tilburg' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["breda"]', stad: 'Breda' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["helmond"]', stad: 'Helmond' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["roosendaal"]', stad: 'Roosendaal' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["oss"]', stad: 'Oss' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["waalwijk"]', stad: 'Waalwijk' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["boxtel"]', stad: 'Boxtel' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["schijndel"]', stad: 'Schijndel' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["uden"]', stad: 'Uden' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["vught"]', stad: 'Vught' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["best"]', stad: 'Best' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["veghel"]', stad: 'Veghel' },
  { url: 'https://www.funda.nl/feeds/Huur?selected_area=["bergen-op-zoom"]', stad: 'Bergen op Zoom' },
]

export async function GET() {
  let totaalNieuw = 0
  const fouten: string[] = []

  for (const feed of FUNDA_FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
      })

      if (!res.ok) {
        fouten.push(`${feed.stad}: HTTP ${res.status}`)
        continue
      }

      const xml = await res.text()
      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]

      for (const item of items) {
        const blok = item[1]

        const titelMatch = blok.match(/<title><!\[CDATA\[([^\]]+)\]\]><\/title>/) || blok.match(/<title>([^<]+)<\/title>/)
        const urlMatch = blok.match(/<link>([^<]+)<\/link>/) || blok.match(/<guid>([^<]+)<\/guid>/)
        const prijsMatch = blok.match(/€\s*([\d.,]+)/) || blok.match(/(\d+)\s*per maand/)
        const fotoMatch = blok.match(/<enclosure[^>]+url="([^"]+)"/) || blok.match(/<media:content[^>]+url="([^"]+)"/)
        const beschrijvingMatch = blok.match(/<description><!\[CDATA\[([^\]]+)\]\]><\/description>/) || blok.match(/<description>([^<]+)<\/description>/)

        if (!titelMatch || !urlMatch) continue

        const woningUrl = urlMatch[1].trim()
        const titel = titelMatch[1].trim()
        const prijs = prijsMatch ? parseInt(prijsMatch[1].replace('.', '').replace(',', '')) : null
        const foto = fotoMatch ? fotoMatch[1] : null

        // Haal kamers en oppervlakte uit beschrijving
        const beschrijving = beschrijvingMatch ? beschrijvingMatch[1] : ''
        const kamersMatch = beschrijving.match(/(\d+)\s*kamer/)
        const oppervlakteMatch = beschrijving.match(/(\d+)\s*m²/)
        const adresMatch = beschrijving.match(/([A-Z][a-z]+ \d+[a-z]?)/)

        const kamers = kamersMatch ? parseInt(kamersMatch[1]) : null
        const oppervlakte = oppervlakteMatch ? parseInt(oppervlakteMatch[1]) : null
        const adres = adresMatch ? adresMatch[1] : null

        // Check of woning al bestaat
        const { data: bestaand } = await supabase
          .from('gevonden_woningen')
          .select('id')
          .eq('url', woningUrl)
          .single()

        if (bestaand) continue

        const { error } = await supabase.from('gevonden_woningen').insert({
          titel,
          url: woningUrl,
          prijs,
          adres,
          stad: feed.stad,
          oppervlakte,
          kamers,
          foto_url: foto,
          platform: 'funda',
          actief: true,
          gevonden_op: new Date().toISOString(),
        })

        if (!error) totaalNieuw++
      }

      await new Promise(r => setTimeout(r, 500))

    } catch (err: any) {
      fouten.push(`${feed.stad}: ${err.message}`)
    }
  }

  await supabase.from('scrape_logs').insert({
    platform: 'funda',
    woningen_gevonden: totaalNieuw,
    nieuwe_woningen: totaalNieuw,
    matches: 0,
    emails_verstuurd: 0,
    error: fouten.length > 0 ? fouten.join(', ') : null,
  })

  return NextResponse.json({
    success: true,
    nieuw: totaalNieuw,
    fouten,
  })
}
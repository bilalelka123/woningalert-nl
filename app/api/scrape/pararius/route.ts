import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY!

const STEDEN = [
  'den-bosch', 'tilburg', 'eindhoven', 'breda', 'helmond',
  'roosendaal', 'bergen-op-zoom', 'oss', 'waalwijk', 'boxtel',
]

function schoonTekst(tekst: string): string {
  return tekst
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&euro;/g, '€')
    .replace(/\s+/g, ' ')
    .trim()
}

function extraheerPrijs(blok: string): number | null {
  const schoon = schoonTekst(blok)

  // Zoek naar prijspatronen — alleen realistische huurprijzen
  const patronen = [
    /€\s*(\d[\d.]+)\s*per maand/i,
    /(\d[\d.]+)\s*per maand/i,
    /prijs[^€]*€\s*(\d[\d.]+)/i,
    /€\s*(\d{3,4})/,
  ]

  for (const patroon of patronen) {
    const match = schoon.match(patroon)
    if (match) {
      const prijs = parseInt(match[1].replace('.', '').replace(',', ''))
      if (prijs >= 400 && prijs <= 5000) return prijs
    }
  }
  return null
}

function extraheerAdres(blok: string): string | null {
  const schoon = schoonTekst(blok)
  // Verwijder adressen met HTML rommel
  if (schoon.includes('nbsp') || schoon.includes('&') || schoon.length > 100) return null

  const match = schoon.match(/([A-Z][a-zéèëê]+(?:straat|laan|weg|plein|singel|kade|dijk|hof|park|boulevard|dreef|allee|avenue)\s+\d+[a-z]?)/i)
  return match ? match[1] : null
}

export async function GET() {
  let totaalNieuw = 0
  const fouten: string[] = []

  for (const stad of STEDEN) {
    try {
      const targetUrl = `https://www.pararius.nl/huurwoningen/${stad}`
      const scraperUrl = `https://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}&render=true`

      const res = await fetch(scraperUrl, { signal: AbortSignal.timeout(45000) })
      if (!res.ok) { fouten.push(`${stad}: HTTP ${res.status}`); continue }

      const html = await res.text()
      const schoneHtml = schoonTekst(html)
      const stadNaam = stad.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

      const links = [...new Set(
        [...html.matchAll(/href="([^"]*(?:appartement|huurwoning|kamer|studio|huis)-te-huur\/[^"]+)"/g)]
          .map(m => m[1])
          .filter(l => l.includes(stad))
      )]

      for (const pad of links) {
        const woningUrl = `https://www.pararius.nl${pad}`

        const { data: bestaand } = await supabase
          .from('gevonden_woningen')
          .select('id')
          .eq('url', woningUrl)
          .single()

        if (bestaand) continue

        const positie = schoneHtml.indexOf(pad)
        const blok = schoneHtml.slice(Math.max(0, positie - 500), positie + 2000)

        const titelMatch = blok.match(/listing-search-item__title[^>]*>\s*<[^>]+>\s*([^<]+)/) ||
                          blok.match(/<h2[^>]*>\s*(?:<[^>]+>)?\s*([^<]+)/)
        const fotoMatch = html.slice(Math.max(0, html.indexOf(pad) - 500), html.indexOf(pad) + 2000)
                            .match(/src="(https:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/)

        const titel = titelMatch
          ? titelMatch[1].trim()
          : pad.split('/').slice(-1)[0].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

        const prijs = extraheerPrijs(blok)
        const adres = extraheerAdres(blok)
        const oppervlakteMatch = blok.match(/([\d]+)\s*m²/)
        const kamersMatch = blok.match(/([\d]+)\s*kamer/)

        const { error } = await supabase.from('gevonden_woningen').insert({
          titel,
          url: woningUrl,
          prijs,
          adres,
          stad: stadNaam,
          oppervlakte: oppervlakteMatch ? parseInt(oppervlakteMatch[1]) : null,
          kamers: kamersMatch ? parseInt(kamersMatch[1]) : null,
          foto_url: fotoMatch ? fotoMatch[1] : null,
          platform: 'pararius',
          actief: true,
          gevonden_op: new Date().toISOString(),
        })

        if (!error) totaalNieuw++
      }

    } catch (err: any) {
      fouten.push(`${stad}: ${err.message}`)
    }
  }

  await supabase.from('scrape_logs').insert({
    platform: 'pararius',
    woningen_gevonden: totaalNieuw,
    nieuwe_woningen: totaalNieuw,
    matches: 0,
    emails_verstuurd: 0,
    error: fouten.length > 0 ? fouten.join(', ') : null,
  })

  return NextResponse.json({ success: true, nieuw: totaalNieuw, fouten })
}
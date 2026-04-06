import { NextRequest, NextResponse } from 'next/server'
import { stuurWoningEmail } from '../../lib/email'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  const email = searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Email parameter verplicht' }, { status: 400 })
  }

  const success = await stuurWoningEmail(
    email,
    'Bilal',
    {
      titel: 'Ruim appartement centrum Eindhoven',
      prijs: 975,
      adres: 'Dommelstraat 12',
      stad: 'Eindhoven',
      url: 'https://www.pararius.nl',
      foto_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      kamers: 3,
      oppervlakte: 85,
      platform: 'pararius',
    }
  )

  return NextResponse.json({ success })
}
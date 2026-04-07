import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const testModus = searchParams.get('test') === 'true'

  let totaalVerstuurd = 0
  const fouten: string[] = []

  try {
    const { data: woonwensen, error: woonwensenError } = await supabase
      .from('woonwensen')
      .select('*, users:user_id(email)')
      .eq('actief', true)

    if (woonwensenError || !woonwensen) {
      return NextResponse.json({ success: false, fout: 'Woonwensen ophalen mislukt' })
    }

    // In testmodus: pak alle woningen. Anders alleen de laatste 2 uur.
    let query = supabase.from('gevonden_woningen').select('*').eq('actief', true)
    if (!testModus) {
      const tweeUurGeleden = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      query = query.gte('gevonden_op', tweeUurGeleden)
    }
    query = query.order('gevonden_op', { ascending: false }).limit(50)

    const { data: nieuweWoningen } = await query

    if (!nieuweWoningen || nieuweWoningen.length === 0) {
      return NextResponse.json({ success: true, verstuurd: 0, bericht: 'Geen woningen gevonden' })
    }

    for (const wens of woonwensen) {
      const gebruikerEmail = (wens as any).users?.email
      if (!gebruikerEmail) continue

      const steden = Array.isArray(wens.stad) ? wens.stad : [wens.stad]

      const matches = nieuweWoningen.filter(woning => {
        if (woning.prijs && woning.prijs < wens.min_prijs) return false
        if (woning.prijs && woning.prijs > wens.max_prijs) return false
        if (woning.kamers && wens.min_kamers && woning.kamers < wens.min_kamers) return false
        const woningStad = woning.stad?.toLowerCase() || ''
        const stadMatch = steden.some((s: string) =>
          woningStad.includes(s.toLowerCase()) || s.toLowerCase().includes(woningStad)
        )
        if (!stadMatch) return false
        return true
      })

      if (matches.length === 0) continue

      const woningenHtml = matches.map(w => `
        <div style="background:#1a1a2e;border:1px solid #2a2a42;border-radius:12px;padding:20px;margin-bottom:16px;">
          <h3 style="color:#f0f0f8;font-family:Inter,sans-serif;font-size:16px;margin:0 0 8px;">${w.titel}</h3>
          <p style="color:#8888aa;font-size:13px;margin:0 0 12px;">📍 ${w.adres ? `${w.adres}, ` : ''}${w.stad}</p>
          <div style="margin-bottom:16px;">
            ${w.prijs ? `<span style="color:#ff6b2b;font-weight:700;font-size:18px;">€${w.prijs},-/mnd</span>` : ''}
            ${w.kamers ? `<span style="color:#8888aa;font-size:13px;margin-left:12px;">🚪 ${w.kamers} kamers</span>` : ''}
            ${w.oppervlakte ? `<span style="color:#8888aa;font-size:13px;margin-left:12px;">📐 ${w.oppervlakte}m²</span>` : ''}
          </div>
          <a href="${w.url}" style="background:#ff6b2b;color:white;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:700;font-size:14px;display:inline-block;">
            Bekijk woning →
          </a>
        </div>
      `).join('')

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="background:#08080f;margin:0;padding:32px 16px;font-family:Inter,sans-serif;">
          <div style="max-width:600px;margin:0 auto;">
            <div style="margin-bottom:32px;">
              <span style="color:#ff6b2b;font-weight:800;font-size:20px;">Woning</span>
              <span style="color:#f0f0f8;font-weight:800;font-size:20px;">Alert NL</span>
            </div>
            <h1 style="color:#f0f0f8;font-size:24px;font-weight:800;margin:0 0 8px;">
              🔔 ${matches.length} nieuwe woning${matches.length > 1 ? 'en' : ''} gevonden!
            </h1>
            <p style="color:#8888aa;font-size:15px;margin:0 0 32px;">
              We vonden ${matches.length} woning${matches.length > 1 ? 'en' : ''} die past bij jouw zoekcriteria in ${steden.join(', ')}.
            </p>
            ${woningenHtml}
            <div style="border-top:1px solid #2a2a42;margin-top:32px;padding-top:24px;">
              <p style="color:#55557a;font-size:13px;margin:0 0 8px;">
                Je ontvangt deze email omdat je een account hebt bij WoningAlert NL.
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/profiel" style="color:#8888aa;font-size:13px;">
                Woonwensen aanpassen
              </a>
            </div>
          </div>
        </body>
        </html>
      `

      const { error: emailError } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: gebruikerEmail,
        subject: `🔔 ${matches.length} nieuwe woning${matches.length > 1 ? 'en' : ''} in ${steden.join(', ')}`,
        html: emailHtml,
      })

      if (emailError) {
        fouten.push(`Email naar ${gebruikerEmail} mislukt: ${emailError.message}`)
      } else {
        totaalVerstuurd++
      }
    }

  } catch (err: any) {
    fouten.push(err.message)
  }

  await supabase.from('scrape_logs').insert({
    platform: 'meldingen',
    woningen_gevonden: 0,
    nieuwe_woningen: 0,
    matches: totaalVerstuurd,
    emails_verstuurd: totaalVerstuurd,
    error: fouten.length > 0 ? fouten.join(', ') : null,
  })

  return NextResponse.json({
    success: true,
    verstuurd: totaalVerstuurd,
    fouten,
  })
}
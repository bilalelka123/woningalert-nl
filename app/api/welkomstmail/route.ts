import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: Request) {
  const { naam, email } = await request.json()

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="background:#08080f;margin:0;padding:32px 16px;font-family:Inter,sans-serif;">
      <div style="max-width:600px;margin:0 auto;">

        <div style="margin-bottom:32px;">
          <span style="color:#ff6b2b;font-weight:800;font-size:22px;">Woning</span>
          <span style="color:#f0f0f8;font-weight:800;font-size:22px;">Alert NL</span>
        </div>

        <h1 style="color:#f0f0f8;font-size:26px;font-weight:800;margin:0 0 12px;letter-spacing:-0.5px;">
          Welkom${naam ? `, ${naam}` : ''}! 👋
        </h1>
        <p style="color:#8888aa;font-size:16px;margin:0 0 32px;line-height:1.6;">
          Je account is aangemaakt. Je ontvangt voortaan een melding zodra er een woning beschikbaar komt die bij jouw zoekcriteria past in Noord-Brabant.
        </p>

        <div style="background:#11111c;border:1px solid #2a2a42;border-radius:16px;padding:28px;margin-bottom:28px;">
          <h2 style="color:#f0f0f8;font-size:18px;font-weight:700;margin:0 0 20px;">Zo werkt het:</h2>
          <div style="display:flex;flex-direction:column;gap:16px;">
            <div style="display:flex;gap:16px;align-items:flex-start;">
              <div style="background:rgba(255,107,43,0.1);border-radius:10px;padding:10px;font-size:20px;flex-shrink:0;">⚙️</div>
              <div>
                <div style="color:#f0f0f8;font-weight:600;font-size:15px;margin-bottom:4px;">Stel je woonwensen in</div>
                <div style="color:#8888aa;font-size:13px;line-height:1.5;">Kies je steden, budget en type woning via je profiel pagina.</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;align-items:flex-start;">
              <div style="background:rgba(255,107,43,0.1);border-radius:10px;padding:10px;font-size:20px;flex-shrink:0;">🔍</div>
              <div>
                <div style="color:#f0f0f8;font-weight:600;font-size:15px;margin-bottom:4px;">Wij monitoren voor jou</div>
                <div style="color:#8888aa;font-size:13px;line-height:1.5;">Elk uur checken we nieuwe woningen in Noord-Brabant.</div>
              </div>
            </div>
            <div style="display:flex;gap:16px;align-items:flex-start;">
              <div style="background:rgba(255,107,43,0.1);border-radius:10px;padding:10px;font-size:20px;flex-shrink:0;">🔔</div>
              <div>
                <div style="color:#f0f0f8;font-weight:600;font-size:15px;margin-bottom:4px;">Jij krijgt direct een melding</div>
                <div style="color:#8888aa;font-size:13px;line-height:1.5;">Zodra er een match is sturen we een email met alle details.</div>
              </div>
            </div>
          </div>
        </div>

        <a href="${process.env.NEXT_PUBLIC_APP_URL}/profiel" style="background:#ff6b2b;color:white;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:15px;display:inline-block;margin-bottom:32px;">
          Stel je woonwensen in →
        </a>

        <div style="border-top:1px solid #2a2a42;padding-top:24px;">
          <p style="color:#55557a;font-size:13px;margin:0;">
            © 2026 WoningAlert NL · Huurwoningen in Noord-Brabant
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Welkom bij WoningAlert NL! 🏠`,
      html: emailHtml,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false })
  }
}
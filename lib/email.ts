import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function stuurWoningEmail(
  naarEmail: string,
  naarNaam: string,
  woning: {
    titel: string
    prijs: number | null
    adres: string | null
    stad: string | null
    url: string
    foto_url: string | null
    kamers: number | null
    oppervlakte: number | null
    platform: string
  }
) {
  const prijsTekst = woning.prijs
    ? `€ ${woning.prijs.toLocaleString('nl-NL')},- per maand`
    : 'Prijs op aanvraag'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://woningalert-nl.vercel.app'

  try {
    const { data, error } = await resend.emails.send({
      from: 'WoningAlert NL <onboarding@resend.dev>',
      to: naarEmail,
      subject: `🏠 Nieuwe woning gevonden: ${woning.titel}`,
      html: `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#08080F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#08080F;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:#11111C;border-radius:16px 16px 0 0;padding:32px;border-bottom:1px solid #2A2A42;">
          <div style="font-family:Arial,sans-serif;font-weight:800;font-size:20px;">
            <span style="color:#FF6B2B;">Woning</span><span style="color:#F0F0F8;">Alert NL</span>
          </div>
          <h1 style="margin:16px 0 4px;color:#F0F0F8;font-size:22px;font-weight:700;">
            🏠 Nieuwe woning gevonden!
          </h1>
          <p style="margin:0;color:#8888AA;font-size:14px;">
            Hoi ${naarNaam}! We hebben een woning gevonden die past bij jouw wensen.
          </p>
        </td></tr>

        <!-- Foto -->
        ${woning.foto_url ? `
        <tr><td style="background:#11111C;padding:0;">
          <img src="${woning.foto_url}" alt="${woning.titel}"
               style="width:100%;height:250px;object-fit:cover;display:block;" />
        </td></tr>
        ` : ''}

        <!-- Details -->
        <tr><td style="background:#11111C;padding:32px;">

          <div style="display:inline-block;background:rgba(255,107,43,0.15);border:1px solid rgba(255,107,43,0.3);color:#FF6B2B;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;margin-bottom:16px;">
            Via ${woning.platform}
          </div>

          <h2 style="margin:0 0 8px;color:#F0F0F8;font-size:20px;font-weight:700;line-height:1.3;">
            ${woning.titel}
          </h2>

          ${woning.adres ? `
          <p style="margin:0 0 24px;color:#8888AA;font-size:14px;">
            📍 ${woning.adres}${woning.stad ? `, ${woning.stad}` : ''}
          </p>
          ` : ''}

          <!-- Stats -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2A2A42;border-radius:12px;overflow:hidden;margin-bottom:24px;">
            <tr>
              <td style="padding:16px;text-align:center;border-right:1px solid #2A2A42;">
                <div style="color:#8888AA;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">HUURPRIJS</div>
                <div style="color:#FF6B2B;font-size:18px;font-weight:700;">${prijsTekst}</div>
              </td>
              ${woning.kamers ? `
              <td style="padding:16px;text-align:center;border-right:1px solid #2A2A42;">
                <div style="color:#8888AA;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">KAMERS</div>
                <div style="color:#F0F0F8;font-size:18px;font-weight:700;">${woning.kamers}</div>
              </td>
              ` : ''}
              ${woning.oppervlakte ? `
              <td style="padding:16px;text-align:center;">
                <div style="color:#8888AA;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">OPPERVLAK</div>
                <div style="color:#F0F0F8;font-size:18px;font-weight:700;">${woning.oppervlakte} m²</div>
              </td>
              ` : ''}
            </tr>
          </table>

          <!-- Knoppen -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:8px;" width="50%">
                <a href="${woning.url}" style="display:block;background:linear-gradient(135deg,#FF6B2B,#FFB800);color:#08080F;text-decoration:none;padding:14px;border-radius:10px;text-align:center;font-weight:700;font-size:15px;">
                  🚀 Bekijk woning
                </a>
              </td>
              <td style="padding-left:8px;" width="50%">
                <a href="${appUrl}/dashboard" style="display:block;background:transparent;color:#F0F0F8;text-decoration:none;padding:13px;border-radius:10px;text-align:center;font-weight:600;font-size:15px;border:1px solid #2A2A42;">
                  📊 Naar dashboard
                </a>
              </td>
            </tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0D0D18;border-radius:0 0 16px 16px;padding:24px 32px;border-top:1px solid #2A2A42;">
          <p style="margin:0 0 8px;color:#55557A;font-size:12px;text-align:center;">
            Je ontvangt deze email omdat je een woonwens hebt ingesteld bij WoningAlert NL.
          </p>
          <p style="margin:0;color:#55557A;font-size:12px;text-align:center;">
            <a href="${appUrl}/profiel" style="color:#FF6B2B;text-decoration:none;">Voorkeuren wijzigen</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Resend fout:', error)
      return false
    }

    return true
  } catch (err) {
    console.error('Email fout:', err)
    return false
  }
}
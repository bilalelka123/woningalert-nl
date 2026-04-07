import Link from 'next/link'

export default function Landingspagina() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', fontFamily: "'Inter', sans-serif" }}>

      {/* Navigatie */}
      <nav style={{ borderBottom: '1px solid #2A2A42', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px', lineHeight: '1.5', paddingBottom: '2px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link href="/woning-plaatsen" style={{ backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '10px 20px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
            Woning plaatsen
          </Link>
          <Link href="/login" style={{ backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '10px 20px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
            Inloggen
          </Link>
          <Link href="/register" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', whiteSpace: 'nowrap' }}>
            Gratis starten
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 24px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.3)', color: '#FF6B2B', fontSize: '14px', fontWeight: 600, padding: '8px 20px', borderRadius: '100px', marginBottom: '32px' }}>
          🏠 Noord-Brabant's slimste woningzoeker
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 6vw, 72px)', color: '#F0F0F8', lineHeight: 1.1, marginBottom: '24px' }}>
          Nooit meer een{' '}
          <span className="gradient-tekst">woning missen</span>
          {' '}in Noord-Brabant
        </h1>
        <p style={{ color: '#8888AA', fontSize: '18px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          WoningAlert monitort automatisch huurwoningen in Noord-Brabant.
          Zodra er een woning bij jou past, krijg jij als eerste een melding.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '16px', padding: '14px 32px', borderRadius: '12px' }}>
            Gratis beginnen →
          </Link>
          <a href="#hoe-werkt-het" style={{ backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontWeight: 600, fontSize: '16px', padding: '14px 32px', borderRadius: '12px' }}>
            Hoe werkt het?
          </a>
        </div>
      </section>

      {/* Hoe werkt het */}
      <section id="hoe-werkt-het" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 40px)', color: '#F0F0F8', textAlign: 'center', marginBottom: '12px' }}>
          Hoe werkt het?
        </h2>
        <p style={{ color: '#8888AA', textAlign: 'center', marginBottom: '60px', fontSize: '18px' }}>
          In 3 stappen altijd als eerste een woning vinden
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { stap: '01', titel: 'Stel je wensen in', tekst: 'Geef aan in welke stad je zoekt, wat je budget is en hoeveel kamers je wil. Duurt minder dan 2 minuten.', icoon: '⚙️' },
            { stap: '02', titel: 'Wij monitoren voor jou', tekst: 'Onze app checkt elk uur nieuwe woningen die bij jouw wensen passen in Noord-Brabant.', icoon: '🔍' },
            { stap: '03', titel: 'Jij krijgt direct een melding', tekst: 'Zodra er een match is sturen we direct een email. Met één klik ga je naar de advertentie.', icoon: '🔔' },
          ].map((item) => (
            <div key={item.stap} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '36px' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{item.icoon}</div>
              <div style={{ color: '#FF6B2B', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>{item.stap}</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '12px' }}>{item.titel}</h3>
              <p style={{ color: '#8888AA', lineHeight: 1.7 }}>{item.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verhuurder sectie */}
      <section style={{ padding: '80px 24px', backgroundColor: '#11111C' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.3)', color: '#FF6B2B', fontSize: '13px', fontWeight: 600, padding: '6px 16px', borderRadius: '100px', marginBottom: '20px' }}>
              Voor verhuurders
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: '#F0F0F8', marginBottom: '16px', lineHeight: 1.2 }}>
              Snel de juiste huurder vinden
            </h2>
            <p style={{ color: '#8888AA', lineHeight: 1.7, marginBottom: '24px' }}>
              Plaats jouw huurwoning gratis op WoningAlert NL. Wij sturen direct een melding naar honderden huurders die actief zoeken in jouw regio.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {['✅ Gratis plaatsen', '⚡ Direct zichtbaar voor actieve zoekers', '🎯 Gericht op Noord-Brabant', '📧 Huurders krijgen direct een melding'].map(item => (
                <div key={item} style={{ color: '#F0F0F8', fontSize: '15px' }}>{item}</div>
              ))}
            </div>
            <Link href="/woning-plaatsen" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '15px', padding: '14px 28px', borderRadius: '12px', display: 'inline-block' }}>
              Woning gratis plaatsen →
            </Link>
          </div>
          <div style={{ backgroundColor: '#08080F', border: '1px solid #2A2A42', borderRadius: '20px', padding: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🏠</div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '8px' }}>
              Ruim appartement centrum
            </h3>
            <p style={{ color: '#8888AA', fontSize: '13px', marginBottom: '16px' }}>📍 Den Bosch</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ color: '#FF6B2B', fontWeight: 700 }}>€950,-/mnd</span>
              <span style={{ color: '#8888AA', fontSize: '13px' }}>🚪 3 kamers</span>
              <span style={{ color: '#8888AA', fontSize: '13px' }}>📐 75m²</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.2)', borderRadius: '10px', padding: '12px 16px', color: '#FF6B2B', fontSize: '13px', fontWeight: 600 }}>
              ⚡ 47 huurders ontvingen een melding
            </div>
          </div>
        </div>
      </section>

      {/* Prijzen */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 40px)', color: '#F0F0F8', textAlign: 'center', marginBottom: '12px' }}>
            Simpele prijzen
          </h2>
          <p style={{ color: '#8888AA', textAlign: 'center', marginBottom: '60px', fontSize: '18px' }}>
            Begin gratis, upgrade wanneer je wil
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '40px' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '24px', color: '#F0F0F8', marginBottom: '8px' }}>Gratis</h3>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#F0F0F8', marginBottom: '32px' }}>€ 0</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['✅ Tot 3 meldingen per dag', '✅ Email meldingen', '✅ Alle woningen in Noord-Brabant', '❌ Automatisch reageren', '❌ WhatsApp meldingen'].map((item, i) => (
                  <li key={i} style={{ color: '#8888AA', fontSize: '15px' }}>{item}</li>
                ))}
              </ul>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontWeight: 600, padding: '14px', borderRadius: '12px' }}>
                Gratis beginnen
              </Link>
            </div>
            <div style={{ backgroundColor: '#11111C', border: '2px solid #FF6B2B', borderRadius: '20px', padding: '40px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '24px', backgroundColor: '#FF6B2B', color: 'white', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '100px', letterSpacing: '1px' }}>
                MEEST GEKOZEN
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '24px', color: '#F0F0F8', marginBottom: '8px' }}>Premium</h3>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#F0F0F8', marginBottom: '4px' }}>€ 9,99</div>
              <div style={{ color: '#8888AA', fontSize: '14px', marginBottom: '32px' }}>per maand</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['✅ Onbeperkte meldingen', '✅ Email meldingen', '✅ Alle woningen in Noord-Brabant', '✅ Automatisch reageren', '✅ WhatsApp meldingen (binnenkort)'].map((item, i) => (
                  <li key={i} style={{ color: '#8888AA', fontSize: '15px' }}>{item}</li>
                ))}
              </ul>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '14px', borderRadius: '12px' }}>
                Premium starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 40px)', color: '#F0F0F8', textAlign: 'center', marginBottom: '60px' }}>
          Veelgestelde vragen
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { vraag: 'Welke woningen staan op WoningAlert NL?', antwoord: 'Woningen geplaatst door verhuurders in Noord-Brabant. We breiden continu uit met meer platforms.' },
            { vraag: 'Hoe snel krijg ik een melding?', antwoord: 'Onze app checkt elk uur op nieuwe woningen. Zodra er een match is sturen we direct een email.' },
            { vraag: 'Kan ik mijn woonwensen aanpassen?', antwoord: 'Ja, je kunt op elk moment je woonwensen aanpassen via je profiel pagina.' },
            { vraag: 'Wat betekent automatisch reageren?', antwoord: 'Met Premium reageert de app automatisch namens jou op nieuwe woningen met een persoonlijke motivatiebrief.' },
            { vraag: 'Ik ben verhuurder, hoe plaats ik een woning?', antwoord: 'Ga naar "Woning plaatsen" en vul het formulier in. Je woning is na goedkeuring direct zichtbaar voor alle zoekers.' },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '16px', padding: '28px' }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: '18px', color: '#F0F0F8', marginBottom: '8px' }}>{item.vraag}</h3>
              <p style={{ color: '#8888AA', margin: 0, lineHeight: 1.6 }}>{item.antwoord}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2A2A42', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px', marginBottom: '16px', lineHeight: '1.5', paddingBottom: '2px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          <Link href="/woning-plaatsen" style={{ color: '#8888AA', textDecoration: 'none', fontSize: '14px' }}>Woning plaatsen</Link>
          <Link href="/login" style={{ color: '#8888AA', textDecoration: 'none', fontSize: '14px' }}>Inloggen</Link>
          <Link href="/register" style={{ color: '#8888AA', textDecoration: 'none', fontSize: '14px' }}>Registreren</Link>
        </div>
        <p style={{ color: '#55557A', fontSize: '14px', margin: 0 }}>© 2026 WoningAlert NL · Huurwoningen in Noord-Brabant</p>
      </footer>

    </main>
  )
}
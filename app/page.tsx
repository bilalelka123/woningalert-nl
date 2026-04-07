import Link from 'next/link'

export default function Landingspagina() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', fontFamily: "'Inter', sans-serif" }}>

      {/* Navigatie */}
      <nav style={{ borderBottom: '1px solid #2A2A42', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/woning-plaatsen" style={{ color: '#8888AA', textDecoration: 'none', fontSize: '14px', fontWeight: 500, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
            Woning plaatsen
          </Link>
          <Link href="/login" style={{ color: '#F0F0F8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '8px 20px', borderRadius: '8px', border: '1px solid #2A2A42', backgroundColor: '#11111C', whiteSpace: 'nowrap' }}>
            Inloggen
          </Link>
          <Link href="/register" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '8px 20px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
            Gratis starten
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 32px 80px', textAlign: 'center', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.25)', color: '#FF6B2B', fontSize: '13px', fontWeight: 600, padding: '6px 16px', borderRadius: '100px', marginBottom: '40px' }}>
          <span style={{ width: '6px', height: '6px', backgroundColor: '#FF6B2B', borderRadius: '50%', display: 'inline-block' }}></span>
          Noord-Brabant's slimste woningzoeker
        </div>

        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(40px, 7vw, 80px)',
          color: '#F0F0F8',
          lineHeight: 1.15,
          marginBottom: '28px',
          letterSpacing: '-2px',
          paddingBottom: '8px',
          overflow: 'visible',
        }}>
          Nooit meer een{' '}
          <span style={{ background: 'linear-gradient(135deg, #FF6B2B, #FFB800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            woning missen
          </span>
          {' '}in Noord-Brabant
        </h1>

        <p style={{ color: '#8888AA', fontSize: '18px', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.7, fontWeight: 400 }}>
          WoningAlert stuurt je direct een melding zodra er een huurwoning beschikbaar komt die bij jou past.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <Link href="/register" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '16px', padding: '14px 32px', borderRadius: '10px', letterSpacing: '-0.3px' }}>
            Gratis beginnen →
          </Link>
          <a href="#hoe-werkt-het" style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontWeight: 600, fontSize: '16px', padding: '14px 32px', borderRadius: '10px' }}>
            Hoe werkt het?
          </a>
        </div>

        {/* Social proof */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { getal: '38+', label: 'plaatsen in Noord-Brabant' },
            { getal: 'Gratis', label: 'beginnen' },
            { getal: '< 1 uur', label: 'reactietijd' },
          ].map(item => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#F0F0F8', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>{item.getal}</div>
              <div style={{ color: '#55557A', fontSize: '13px', marginTop: '2px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hoe werkt het */}
      <section id="hoe-werkt-het" style={{ padding: '80px 32px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ color: '#FF6B2B', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Hoe het werkt</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#F0F0F8', letterSpacing: '-1px', marginBottom: '16px' }}>
            In 3 stappen een woning vinden
          </h2>
          <p style={{ color: '#8888AA', fontSize: '17px' }}>Duurt minder dan 2 minuten om in te stellen</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {[
            { stap: '01', titel: 'Stel je wensen in', tekst: 'Kies je steden, budget en type woning. Je kunt meerdere plaatsen in Noord-Brabant selecteren.', icoon: '⚙️' },
            { stap: '02', titel: 'Wij monitoren voor jou', tekst: 'Onze app checkt elk uur nieuwe woningen die bij jouw wensen passen in Noord-Brabant.', icoon: '🔍' },
            { stap: '03', titel: 'Jij krijgt direct een melding', tekst: 'Zodra er een match is sturen we direct een email. Met één klik ga je naar de advertentie.', icoon: '🔔' },
          ].map((item) => (
            <div key={item.stap} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,107,43,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
                {item.icoon}
              </div>
              <div style={{ color: '#FF6B2B', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' }}>{item.stap}</div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F0F0F8', marginBottom: '10px', letterSpacing: '-0.3px' }}>{item.titel}</h3>
              <p style={{ color: '#8888AA', lineHeight: 1.7, fontSize: '15px', margin: 0 }}>{item.tekst}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Verhuurder sectie */}
      <section style={{ margin: '0 32px 80px', maxWidth: '1036px', marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.2)', color: '#FF6B2B', fontSize: '12px', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', marginBottom: '20px', letterSpacing: '0.5px' }}>
              VOOR VERHUURDERS
            </div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 3vw, 32px)', color: '#F0F0F8', marginBottom: '16px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Snel de juiste huurder vinden
            </h2>
            <p style={{ color: '#8888AA', lineHeight: 1.7, marginBottom: '28px', fontSize: '15px' }}>
              Plaats jouw huurwoning gratis. Wij sturen direct een melding naar honderden actieve zoekers in Noord-Brabant.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
              {['✅ Gratis plaatsen', '⚡ Direct zichtbaar voor actieve zoekers', '🎯 Gericht op Noord-Brabant', '📧 Huurders krijgen direct een melding'].map(item => (
                <div key={item} style={{ color: '#F0F0F8', fontSize: '14px' }}>{item}</div>
              ))}
            </div>
            <Link href="/woning-plaatsen" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '15px', padding: '12px 24px', borderRadius: '10px', display: 'inline-block' }}>
              Woning gratis plaatsen →
            </Link>
          </div>
          <div style={{ backgroundColor: '#08080F', border: '1px solid #2A2A42', borderRadius: '14px', padding: '28px' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🏠</div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '17px', color: '#F0F0F8', marginBottom: '6px', letterSpacing: '-0.3px' }}>
              Ruim appartement centrum
            </h3>
            <p style={{ color: '#8888AA', fontSize: '13px', marginBottom: '16px' }}>📍 Den Bosch</p>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <span style={{ color: '#FF6B2B', fontWeight: 700, fontSize: '16px' }}>€950,-/mnd</span>
              <span style={{ color: '#8888AA', fontSize: '13px' }}>🚪 3 kamers</span>
              <span style={{ color: '#8888AA', fontSize: '13px' }}>📐 75m²</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.15)', borderRadius: '8px', padding: '10px 14px', color: '#FF6B2B', fontSize: '13px', fontWeight: 600 }}>
              ⚡ 47 huurders ontvingen een melding
            </div>
          </div>
        </div>
      </section>

      {/* Prijzen */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: '#FF6B2B', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Prijzen</p>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#F0F0F8', letterSpacing: '-1px', marginBottom: '12px' }}>
              Begin gratis
            </h2>
            <p style={{ color: '#8888AA', fontSize: '17px' }}>Upgrade wanneer je wil</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '16px', padding: '36px' }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '6px' }}>Gratis</h3>
              <div style={{ fontSize: '44px', fontWeight: 800, color: '#F0F0F8', marginBottom: '28px', letterSpacing: '-2px' }}>€0</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {['✅ Tot 3 meldingen per dag', '✅ Email meldingen', '✅ Alle woningen in Noord-Brabant', '❌ Automatisch reageren', '❌ WhatsApp meldingen'].map((item, i) => (
                  <div key={i} style={{ color: '#8888AA', fontSize: '14px' }}>{item}</div>
                ))}
              </div>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontWeight: 600, padding: '12px', borderRadius: '10px', fontSize: '15px' }}>
                Gratis beginnen
              </Link>
            </div>
            <div style={{ backgroundColor: '#11111C', border: '2px solid #FF6B2B', borderRadius: '16px', padding: '36px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '20px', backgroundColor: '#FF6B2B', color: 'white', fontSize: '11px', fontWeight: 800, padding: '3px 12px', borderRadius: '100px', letterSpacing: '0.5px' }}>
                MEEST GEKOZEN
              </div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '6px' }}>Premium</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', marginBottom: '28px' }}>
                <span style={{ fontSize: '44px', fontWeight: 800, color: '#F0F0F8', letterSpacing: '-2px', lineHeight: 1 }}>€9,99</span>
                <span style={{ color: '#8888AA', fontSize: '14px', marginBottom: '6px' }}>/maand</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {['✅ Onbeperkte meldingen', '✅ Email meldingen', '✅ Alle woningen in Noord-Brabant', '✅ Automatisch reageren', '✅ WhatsApp meldingen (binnenkort)'].map((item, i) => (
                  <div key={i} style={{ color: '#8888AA', fontSize: '14px' }}>{item}</div>
                ))}
              </div>
              <Link href="/register" style={{ display: 'block', textAlign: 'center', backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '12px', borderRadius: '10px', fontSize: '15px' }}>
                Premium starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 32px 80px', maxWidth: '740px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#FF6B2B', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#F0F0F8', letterSpacing: '-1px' }}>
            Veelgestelde vragen
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { vraag: 'Welke woningen staan op WoningAlert NL?', antwoord: 'Woningen geplaatst door verhuurders in Noord-Brabant. We breiden continu uit met meer platforms.' },
            { vraag: 'Hoe snel krijg ik een melding?', antwoord: 'Onze app checkt elk uur op nieuwe woningen. Zodra er een match is sturen we direct een email.' },
            { vraag: 'Kan ik mijn woonwensen aanpassen?', antwoord: 'Ja, je kunt op elk moment je woonwensen aanpassen via je profiel pagina.' },
            { vraag: 'Wat betekent automatisch reageren?', antwoord: 'Met Premium reageert de app automatisch namens jou op nieuwe woningen met een persoonlijke motivatiebrief.' },
            { vraag: 'Ik ben verhuurder, hoe plaats ik een woning?', antwoord: 'Ga naar "Woning plaatsen" en vul het formulier in. Je woning is na goedkeuring direct zichtbaar voor alle zoekers.' },
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '12px', padding: '24px 28px' }}>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px', color: '#F0F0F8', marginBottom: '8px' }}>{item.vraag}</h3>
              <p style={{ color: '#8888AA', margin: 0, lineHeight: 1.6, fontSize: '14px' }}>{item.antwoord}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 32px 80px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', backgroundColor: '#FF6B2B', borderRadius: '20px', padding: '56px 48px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 4vw, 40px)', color: 'white', marginBottom: '16px', letterSpacing: '-1px' }}>
            Nooit meer een woning missen
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '17px', marginBottom: '32px', lineHeight: 1.6 }}>
            Maak gratis een account aan en ontvang direct meldingen.
          </p>
          <Link href="/register" style={{ backgroundColor: 'white', color: '#FF6B2B', textDecoration: 'none', fontWeight: 800, fontSize: '16px', padding: '14px 36px', borderRadius: '10px', display: 'inline-block' }}>
            Gratis beginnen →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2A2A42', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '18px', letterSpacing: '-0.5px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/woning-plaatsen" style={{ color: '#55557A', textDecoration: 'none', fontSize: '14px' }}>Woning plaatsen</Link>
          <Link href="/login" style={{ color: '#55557A', textDecoration: 'none', fontSize: '14px' }}>Inloggen</Link>
          <Link href="/register" style={{ color: '#55557A', textDecoration: 'none', fontSize: '14px' }}>Registreren</Link>
        </div>
        <p style={{ color: '#55557A', fontSize: '13px', margin: 0 }}>© 2026 WoningAlert NL</p>
      </footer>

    </main>
  )
}
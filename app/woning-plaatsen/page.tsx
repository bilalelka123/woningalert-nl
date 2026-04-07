'use client'

import { useState } from 'react'
import Link from 'next/link'
import { maakSupabaseClient } from '../../lib/supabase'

const STEDEN = [
  'Den Bosch', 'Tilburg', 'Eindhoven', 'Breda', 'Helmond',
  'Roosendaal', 'Bergen op Zoom', 'Oss', 'Waalwijk', 'Boxtel',
  'Schijndel', 'Veghel', 'Uden', 'Vught', 'Best', 'Oosterhout',
  'Sint-Michielsgestel', 'Drunen', 'Nuenen', 'Son en Breugel',
]

const TYPES = ['appartement', 'huis', 'studio', 'kamer']

export default function WoningPlaatsen() {
  const [verzonden, setVerzonden] = useState(false)
  const [bezig, setBezig] = useState(false)
  const [fout, setFout] = useState('')

  const [titel, setTitel] = useState('')
  const [adres, setAdres] = useState('')
  const [stad, setStad] = useState('Den Bosch')
  const [prijs, setPrijs] = useState('')
  const [kamers, setKamers] = useState('')
  const [oppervlakte, setOppervlakte] = useState('')
  const [type, setType] = useState('appartement')
  const [url, setUrl] = useState('')
  const [beschrijving, setBeschrijving] = useState('')
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')

  async function handleVerzenden() {
    if (!titel || !adres || !stad || !prijs || !url) {
      setFout('Vul alle verplichte velden in.')
      return
    }

    setBezig(true)
    setFout('')

    const supabase = maakSupabaseClient()

    const { error } = await supabase.from('gevonden_woningen').insert({
      titel,
      adres,
      stad,
      prijs: parseInt(prijs),
      kamers: kamers ? parseInt(kamers) : null,
      oppervlakte: oppervlakte ? parseInt(oppervlakte) : null,
      url,
      platform: 'verhuurder',
      actief: false,
      gevonden_op: new Date().toISOString(),
    })

    if (error) {
      setFout('Er ging iets mis. Probeer het opnieuw.')
      setBezig(false)
      return
    }

    setVerzonden(true)
    setBezig(false)
  }

  const invoerStijl = {
    width: '100%',
    backgroundColor: '#1A1A28',
    border: '1px solid #2A2A42',
    color: '#F0F0F8',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    fontFamily: "'Inter', sans-serif",
  }

  const labelStijl = {
    display: 'block',
    color: '#F0F0F8',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
  }

  if (verzonden) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '28px', color: '#F0F0F8', marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Woning ingediend!
          </h1>
          <p style={{ color: '#8888AA', marginBottom: '32px', lineHeight: 1.6 }}>
            Bedankt! We controleren je woning en plaatsen hem zo snel mogelijk op WoningAlert NL.
          </p>
          <Link href="/" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '14px 28px', borderRadius: '12px', fontSize: '15px' }}>
            Terug naar home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ borderBottom: '1px solid #2A2A42', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '18px', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/" style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontSize: '14px', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
            ← Terug
          </Link>
          <Link href="/login" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
            Inloggen
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 16px' }}>

        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(24px, 5vw, 36px)', color: '#F0F0F8', marginBottom: '12px', letterSpacing: '-1px' }}>
            Woning plaatsen 🏠
          </h1>
          <p style={{ color: '#8888AA', fontSize: '15px', lineHeight: 1.6 }}>
            Plaats jouw huurwoning gratis op WoningAlert NL. Wij sturen direct een melding naar huurders die op zoek zijn in jouw regio.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            {['✅ Gratis plaatsen', '⚡ Direct meldingen', '🎯 Gericht op Noord-Brabant'].map(item => (
              <span key={item} style={{ backgroundColor: 'rgba(255,107,43,0.1)', border: '1px solid rgba(255,107,43,0.2)', color: '#FF6B2B', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F0F0F8', marginBottom: '20px' }}>Jouw gegevens</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStijl}>Naam</label>
                <input type="text" value={naam} onChange={e => setNaam(e.target.value)} placeholder="Jan de Vries" style={invoerStijl} />
              </div>
              <div>
                <label style={labelStijl}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jan@email.nl" style={invoerStijl} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #2A2A42' }} />

          <div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F0F0F8', marginBottom: '20px' }}>
              Woninggegevens <span style={{ color: '#FF6B2B', fontSize: '13px' }}>* verplicht</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStijl}>Titel *</label>
                <input type="text" value={titel} onChange={e => setTitel(e.target.value)} placeholder="Ruim appartement centrum Den Bosch" style={invoerStijl} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStijl}>Adres *</label>
                  <input type="text" value={adres} onChange={e => setAdres(e.target.value)} placeholder="Hoofdstraat 12" style={invoerStijl} />
                </div>
                <div>
                  <label style={labelStijl}>Stad *</label>
                  <select value={stad} onChange={e => setStad(e.target.value)} style={{ ...invoerStijl, cursor: 'pointer' }}>
                    {STEDEN.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStijl}>Huurprijs/mnd *</label>
                  <input type="number" value={prijs} onChange={e => setPrijs(e.target.value)} placeholder="950" style={invoerStijl} />
                </div>
                <div>
                  <label style={labelStijl}>Kamers</label>
                  <input type="number" value={kamers} onChange={e => setKamers(e.target.value)} placeholder="3" style={invoerStijl} />
                </div>
                <div>
                  <label style={labelStijl}>Oppervlakte m²</label>
                  <input type="number" value={oppervlakte} onChange={e => setOppervlakte(e.target.value)} placeholder="75" style={invoerStijl} />
                </div>
              </div>
              <div>
                <label style={labelStijl}>Type woning</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setType(t)} style={{
                      padding: '10px', borderRadius: '10px',
                      border: type === t ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                      backgroundColor: type === t ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                      color: type === t ? '#FF6B2B' : '#8888AA',
                      fontWeight: 600, cursor: 'pointer', fontSize: '13px',
                      textTransform: 'capitalize', fontFamily: "'Inter', sans-serif",
                    }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={labelStijl}>Link naar advertentie *</label>
                <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.pararius.nl/..." style={invoerStijl} />
                <p style={{ color: '#55557A', fontSize: '12px', marginTop: '6px' }}>Link naar je eigen website of advertentie</p>
              </div>
              <div>
                <label style={labelStijl}>Beschrijving</label>
                <textarea value={beschrijving} onChange={e => setBeschrijving(e.target.value)} placeholder="Beschrijf de woning..." rows={4}
                  style={{ ...invoerStijl, resize: 'vertical' as const }} />
              </div>
            </div>
          </div>

          {fout && (
            <div style={{ backgroundColor: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: '10px', padding: '12px 16px', color: '#FF5555', fontSize: '14px' }}>
              {fout}
            </div>
          )}

          <button onClick={handleVerzenden} disabled={bezig} style={{
            width: '100%', backgroundColor: bezig ? '#8888AA' : '#FF6B2B',
            color: 'white', border: 'none', padding: '16px', borderRadius: '12px',
            fontSize: '16px', fontWeight: 700, cursor: bezig ? 'not-allowed' : 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}>
            {bezig ? 'Bezig...' : 'Woning gratis plaatsen →'}
          </button>

          <p style={{ color: '#55557A', fontSize: '12px', textAlign: 'center' }}>
            We controleren elke woning handmatig voor publicatie. Gemiddeld binnen 24 uur online.
          </p>
        </div>
      </div>
    </main>
  )
}
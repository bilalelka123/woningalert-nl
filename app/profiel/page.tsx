'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { maakSupabaseClient } from '../../lib/supabase'

const STEDEN = [
  'Den Bosch', 'Tilburg', 'Eindhoven', 'Breda', 'Helmond',
  'Roosendaal', 'Bergen op Zoom', 'Oss', 'Waalwijk', 'Boxtel',
  'Schijndel', 'Veghel', 'Uden', 'Vught', 'Sint-Michielsgestel',
  'Drunen', 'Heusden', 'Bernheze', 'Meierijstad', 'Landerd',
  'Nuenen', 'Son en Breugel', 'Best', 'Oisterwijk', 'Haaren',
  'Loon op Zand', 'Dongen', 'Gilze en Rijen', 'Oosterhout',
  'Geertruidenberg', 'Werkendam', 'Altena', 'Steenbergen',
  'Halderberge', 'Rucphen', 'Zundert', 'Moerdijk', 'Drimmelen',
]

const TYPES = ['appartement', 'huis', 'studio', 'kamer']

export default function ProfielPagina() {
  const router = useRouter()
  const [laden, setLaden] = useState(true)
  const [gebruiker, setGebruiker] = useState<any>(null)
  const [opslaan, setOpslaan] = useState(false)
  const [opgeslagen, setOpgeslagen] = useState(false)
  const [woonwensId, setWoonwensId] = useState<string | null>(null)

  const [steden, setSteden] = useState<string[]>(['Den Bosch'])
  const [alleSteden, setAlleSteden] = useState(false)
  const [straal, setStraal] = useState(10)
  const [minPrijs, setMinPrijs] = useState(400)
  const [maxPrijs, setMaxPrijs] = useState(1200)
  const [minKamers, setMinKamers] = useState(1)
  const [typeWoning, setTypeWoning] = useState<string[]>(['appartement', 'huis'])
  const [huisdieren, setHuisdieren] = useState('maakt_niet_uit')
  const [gemeubileerd, setGemeubileerd] = useState('maakt_niet_uit')

  useEffect(() => {
    async function laadWoonwensen() {
      const supabase = maakSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('woonwensen').select('*').eq('user_id', user.id).single()

      if (data) {
        setWoonwensId(data.id)
        if (Array.isArray(data.stad) && data.stad.length === 0) {
          setAlleSteden(true)
          setSteden([])
        } else if (Array.isArray(data.stad)) {
          setSteden(data.stad)
        } else if (data.stad) {
          setSteden([data.stad])
        }
        setStraal(data.straal_km)
        setMinPrijs(data.min_prijs)
        setMaxPrijs(data.max_prijs)
        setMinKamers(data.min_kamers)
        setTypeWoning(data.type_woning)
        setHuisdieren(data.huisdieren)
        setGemeubileerd(data.gemeubileerd)
      }

      setGebruiker(user)
      setLaden(false)
    }
    laadWoonwensen()
  }, [])

  async function handleOpslaan() {
    setOpslaan(true)
    const supabase = maakSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const gegevens = {
      user_id: user.id,
      stad: alleSteden ? [] : steden,
      straal_km: straal,
      min_prijs: minPrijs,
      max_prijs: maxPrijs,
      min_kamers: minKamers,
      type_woning: typeWoning,
      huisdieren,
      gemeubileerd,
      actief: true,
    }

    if (woonwensId) {
      await supabase.from('woonwensen').update(gegevens).eq('id', woonwensId)
    } else {
      const { data } = await supabase.from('woonwensen').insert(gegevens).select().single()
      if (data) setWoonwensId(data.id)
    }

    setOpgeslagen(true)
    setOpslaan(false)
    setTimeout(() => setOpgeslagen(false), 3000)
  }

  function toggleStad(stad: string) {
    if (alleSteden) return
    setSteden(prev => prev.includes(stad) ? prev.filter(s => s !== stad) : [...prev, stad])
  }

  function toggleType(type: string) {
    setTypeWoning(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const labelStijl = {
    display: 'block',
    color: '#F0F0F8',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
  }

  if (laden) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#8888AA' }}>Laden...</div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', fontFamily: "'Inter', sans-serif" }}>

      <nav style={{ borderBottom: '1px solid #2A2A42', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '18px', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </Link>
        <Link href="/dashboard" style={{ backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
          ← Dashboard
        </Link>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 16px' }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '32px', color: '#F0F0F8', marginBottom: '8px', letterSpacing: '-1px' }}>
          Mijn profiel
        </h1>
        <p style={{ color: '#8888AA', marginBottom: '40px' }}>
          Beheer je persoonlijke gegevens en woonwensen
        </p>

        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '24px' }}>
            Persoonlijke gegevens
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#F0F0F8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Naam</label>
              <input type="text" defaultValue={gebruiker?.user_metadata?.naam || ''} placeholder="Jouw naam"
                style={{ width: '100%', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ display: 'block', color: '#F0F0F8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email</label>
              <input type="email" defaultValue={gebruiker?.email || ''} disabled
                style={{ width: '100%', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#55557A', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, cursor: 'not-allowed' }} />
            </div>
          </div>
          <p style={{ color: '#55557A', fontSize: '13px', marginTop: '12px' }}>Email adres kan niet worden gewijzigd.</p>
        </div>

        <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '24px' }}>
          Woonwensen
        </h2>

        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Steden */}
          <div>
            <label style={labelStijl}>Plaatsen</label>

            {/* Heel Noord-Brabant toggle */}
            <button
              onClick={() => { setAlleSteden(!alleSteden); if (!alleSteden) setSteden([]) }}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '10px', marginBottom: '12px',
                border: alleSteden ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                backgroundColor: alleSteden ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                color: alleSteden ? '#FF6B2B' : '#8888AA',
                fontWeight: 600, cursor: 'pointer', fontSize: '14px', textAlign: 'left' as const,
              }}
            >
              {alleSteden ? '✓ ' : ''}🗺️ Heel Noord-Brabant — alle plaatsen
            </button>

            {!alleSteden && (
              <>
                <p style={{ color: '#55557A', fontSize: '12px', marginBottom: '12px' }}>
                  Of kies specifieke plaatsen {steden.length > 0 ? `(${steden.length} geselecteerd)` : '— kies er minimaal één'}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {STEDEN.map(s => (
                    <button key={s} onClick={() => toggleStad(s)} style={{
                      padding: '8px 14px', borderRadius: '20px',
                      border: steden.includes(s) ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                      backgroundColor: steden.includes(s) ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                      color: steden.includes(s) ? '#FF6B2B' : '#8888AA',
                      fontWeight: 600, cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap',
                    }}>
                      {steden.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Straal */}
          <div>
            <label style={labelStijl}>Straal: <span style={{ color: '#FF6B2B' }}>{straal} km</span></label>
            <input type="range" min={5} max={25} step={5} value={straal}
              onChange={e => setStraal(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#FF6B2B' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#55557A', fontSize: '12px', marginTop: '4px' }}>
              <span>5 km</span><span>25 km</span>
            </div>
          </div>

          {/* Prijs */}
          <div>
            <label style={labelStijl}>Huurprijs: <span style={{ color: '#FF6B2B' }}>€{minPrijs} – €{maxPrijs}</span></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <div style={{ color: '#8888AA', fontSize: '12px', marginBottom: '6px' }}>Minimum</div>
                <input type="range" min={400} max={2000} step={50} value={minPrijs}
                  onChange={e => setMinPrijs(Number(e.target.value))} style={{ width: '100%', accentColor: '#FF6B2B' }} />
              </div>
              <div>
                <div style={{ color: '#8888AA', fontSize: '12px', marginBottom: '6px' }}>Maximum</div>
                <input type="range" min={400} max={2000} step={50} value={maxPrijs}
                  onChange={e => setMaxPrijs(Number(e.target.value))} style={{ width: '100%', accentColor: '#FF6B2B' }} />
              </div>
            </div>
          </div>

          {/* Kamers */}
          <div>
            <label style={labelStijl}>Minimaal aantal kamers</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3, 4, 5].map(k => (
                <button key={k} onClick={() => setMinKamers(k)} style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: minKamers === k ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                  backgroundColor: minKamers === k ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                  color: minKamers === k ? '#FF6B2B' : '#8888AA',
                  fontWeight: 700, cursor: 'pointer', fontSize: '15px',
                }}>
                  {k === 5 ? '5+' : k}
                </button>
              ))}
            </div>
          </div>

          {/* Type woning */}
          <div>
            <label style={labelStijl}>Type woning</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {TYPES.map(type => (
                <button key={type} onClick={() => toggleType(type)} style={{
                  padding: '12px', borderRadius: '10px',
                  border: typeWoning.includes(type) ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                  backgroundColor: typeWoning.includes(type) ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                  color: typeWoning.includes(type) ? '#FF6B2B' : '#8888AA',
                  fontWeight: 600, cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize',
                }}>
                  {typeWoning.includes(type) ? '✓ ' : ''}{type}
                </button>
              ))}
            </div>
          </div>

          {/* Huisdieren */}
          <div>
            <label style={labelStijl}>Huisdieren toegestaan</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[{ waarde: 'ja', label: '✅ Ja' }, { waarde: 'nee', label: '❌ Nee' }, { waarde: 'maakt_niet_uit', label: '🤷 Maakt niet uit' }].map(opt => (
                <button key={opt.waarde} onClick={() => setHuisdieren(opt.waarde)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: huisdieren === opt.waarde ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                  backgroundColor: huisdieren === opt.waarde ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                  color: huisdieren === opt.waarde ? '#FF6B2B' : '#8888AA',
                  fontWeight: 600, cursor: 'pointer', fontSize: '13px',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gemeubileerd */}
          <div>
            <label style={labelStijl}>Gemeubileerd</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[{ waarde: 'ja', label: '🛋️ Ja' }, { waarde: 'nee', label: '📦 Nee' }, { waarde: 'maakt_niet_uit', label: '🤷 Maakt niet uit' }].map(opt => (
                <button key={opt.waarde} onClick={() => setGemeubileerd(opt.waarde)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px',
                  border: gemeubileerd === opt.waarde ? '2px solid #FF6B2B' : '1px solid #2A2A42',
                  backgroundColor: gemeubileerd === opt.waarde ? 'rgba(255,107,43,0.1)' : '#1A1A28',
                  color: gemeubileerd === opt.waarde ? '#FF6B2B' : '#8888AA',
                  fontWeight: 600, cursor: 'pointer', fontSize: '13px',
                }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opslaan */}
          <button onClick={handleOpslaan} disabled={opslaan || (!alleSteden && steden.length === 0)} style={{
            width: '100%',
            backgroundColor: opgeslagen ? '#22C55E' : opslaan ? '#8888AA' : (!alleSteden && steden.length === 0) ? '#2A2A42' : '#FF6B2B',
            color: 'white', border: 'none', padding: '16px', borderRadius: '12px',
            fontSize: '16px', fontWeight: 700,
            cursor: opslaan || (!alleSteden && steden.length === 0) ? 'not-allowed' : 'pointer', marginTop: '8px',
          }}>
            {opgeslagen ? '✅ Opgeslagen!' : opslaan ? 'Bezig...' : (!alleSteden && steden.length === 0) ? 'Kies minimaal één plaats' : 'Woonwensen opslaan'}
          </button>

        </div>
      </div>
    </main>
  )
}
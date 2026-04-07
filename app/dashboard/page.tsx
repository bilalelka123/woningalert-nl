'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { maakSupabaseClient } from '../../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [gebruiker, setGebruiker] = useState<any>(null)
  const [woningen, setWoningen] = useState<any[]>([])
  const [alleWoningen, setAlleWoningen] = useState<any[]>([])
  const [woonwensen, setWoonwensen] = useState<any>(null)
  const [laden, setLaden] = useState(true)
  const [toonAlles, setToonAlles] = useState(false)

  useEffect(() => {
    async function laadData() {
      const supabase = maakSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setGebruiker(user)

      const { data: woonwensData } = await supabase
        .from('woonwensen').select('*').eq('user_id', user.id).single()
      setWoonwensen(woonwensData)

      // Haal alle woningen op
      const { data: alle } = await supabase
        .from('gevonden_woningen').select('*')
        .eq('actief', true)
        .order('gevonden_op', { ascending: false })
        .limit(100)
      setAlleWoningen(alle || [])

      // Geen filter — toon alle woningen als matches
      setWoningen(alle || [])
      setLaden(false)
    }
    laadData()
  }, [])

  async function uitloggen() {
    const supabase = maakSupabaseClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  function tijdGeleden(datum: string) {
    const uren = Math.floor((new Date().getTime() - new Date(datum).getTime()) / (1000 * 60 * 60))
    if (uren < 1) return 'zojuist'
    if (uren < 24) return `${uren}u geleden`
    return `${Math.floor(uren / 24)}d geleden`
  }

  function isNieuw(datum: string) {
    return (new Date().getTime() - new Date(datum).getTime()) / (1000 * 60 * 60) < 24
  }

  function stedenKort(stad: any) {
    const lijst = Array.isArray(stad) ? stad : [stad]
    if (lijst.length === 0) return 'Heel Noord-Brabant'
    if (lijst.length <= 2) return lijst.join(', ')
    return `${lijst[0]}, ${lijst[1]} +${lijst.length - 2} meer`
  }

  function stedenVol(stad: any) {
    if (Array.isArray(stad) && stad.length === 0) return 'Heel Noord-Brabant'
    return Array.isArray(stad) ? stad.join(', ') : stad
  }

  const getoondWoningen = toonAlles ? alleWoningen : woningen

  if (laden) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #2A2A42', borderTop: '3px solid #FF6B2B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <div style={{ color: '#8888AA' }}>Laden...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link href="/profiel" style={{ backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
            ⚙ Wensen
          </Link>
          <button onClick={uitloggen} style={{ backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Uitloggen
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }}>

        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 5vw, 32px)', color: '#F0F0F8', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Welkom terug! 👋
          </h1>
          <p style={{ color: '#8888AA', fontSize: '14px' }}>
            {woonwensen
              ? `${stedenKort(woonwensen.stad)} · €${woonwensen.min_prijs}–€${woonwensen.max_prijs} · min. ${woonwensen.min_kamers} kamer${woonwensen.min_kamers > 1 ? 's' : ''}`
              : 'Stel je woonwensen in voor gepersonaliseerde resultaten'
            }
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Gevonden', waarde: woningen.length, kleur: '#FF6B2B' },
            { label: 'Nieuw vandaag', waarde: woningen.filter(w => isNieuw(w.gevonden_op)).length, kleur: '#FFB800' },
            { label: 'Totaal aanbod', waarde: alleWoningen.length, kleur: '#8888AA' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '12px', padding: '14px 10px' }}>
              <div style={{ color: stat.kleur, fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, marginBottom: '2px' }}>{stat.waarde}</div>
              <div style={{ color: '#8888AA', fontSize: '11px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {!woonwensen && (
          <div style={{ backgroundColor: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.2)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ color: '#F0F0F8', fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>⚡ Stel je woonwensen in</div>
            <div style={{ color: '#8888AA', fontSize: '13px', marginBottom: '12px' }}>Geef aan wat je zoekt zodat we de juiste woningen vinden</div>
            <Link href="/profiel" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '10px 20px', borderRadius: '8px', fontSize: '13px' }}>
              Nu instellen →
            </Link>
          </div>
        )}

        {woonwensen && (
          <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div title={stedenVol(woonwensen.stad)}>
                <div style={{ color: '#55557A', fontSize: '10px', marginBottom: '1px' }}>📍 Plaatsen</div>
                <div style={{ color: '#F0F0F8', fontWeight: 600, fontSize: '13px' }}>{stedenKort(woonwensen.stad)}</div>
              </div>
              <div>
                <div style={{ color: '#55557A', fontSize: '10px', marginBottom: '1px' }}>💰 Prijs</div>
                <div style={{ color: '#F0F0F8', fontWeight: 600, fontSize: '13px' }}>€{woonwensen.min_prijs}–€{woonwensen.max_prijs}</div>
              </div>
              <div>
                <div style={{ color: '#55557A', fontSize: '10px', marginBottom: '1px' }}>🚪 Kamers</div>
                <div style={{ color: '#F0F0F8', fontWeight: 600, fontSize: '13px' }}>min. {woonwensen.min_kamers}</div>
              </div>
            </div>
            <Link href="/profiel" style={{ color: '#FF6B2B', textDecoration: 'none', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Aanpassen →
            </Link>
          </div>
        )}

        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '14px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ color: '#8888AA', fontSize: '13px' }}>🏠 Heb je een woning te huur? Bereik direct honderden zoekers.</div>
          <Link href="/woning-plaatsen" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', fontSize: '13px', whiteSpace: 'nowrap' }}>
            Woning plaatsen →
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '18px', color: '#F0F0F8', letterSpacing: '-0.3px', margin: 0 }}>
            {toonAlles ? `Alle woningen (${alleWoningen.length})` : `Woningen (${woningen.length})`}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setToonAlles(false)} style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              backgroundColor: !toonAlles ? '#FF6B2B' : '#1A1A28',
              color: !toonAlles ? 'white' : '#8888AA',
              border: !toonAlles ? 'none' : '1px solid #2A2A42',
            }}>
              Mijn matches
            </button>
            <button onClick={() => setToonAlles(true)} style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              backgroundColor: toonAlles ? '#FF6B2B' : '#1A1A28',
              color: toonAlles ? 'white' : '#8888AA',
              border: toonAlles ? 'none' : '1px solid #2A2A42',
            }}>
              Alles tonen
            </button>
          </div>
        </div>

        {getoondWoningen.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', backgroundColor: '#11111C', borderRadius: '16px', border: '1px solid #2A2A42' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏠</div>
            <div style={{ color: '#F0F0F8', fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>Geen woningen gevonden</div>
            <div style={{ color: '#8888AA', marginBottom: '20px', fontSize: '14px' }}>Pas je woonwensen aan of klik op "Alles tonen"</div>
            <Link href="/profiel" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}>
              Woonwensen aanpassen
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
            {getoondWoningen.map((woning) => (
              <div key={woning.id} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '180px', backgroundColor: '#1A1A28' }}>
                  {woning.foto_url
                    ? <img src={woning.foto_url} alt={woning.titel} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>🏠</div>
                  }
                  {isNieuw(woning.gevonden_op) && (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#FF6B2B', color: 'white', fontSize: '10px', fontWeight: 800, padding: '3px 8px', borderRadius: '5px' }}>NIEUW</div>
                  )}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#F0F0F8', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '5px', textTransform: 'capitalize' }}>
                    {woning.platform}
                  </div>
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '15px', color: '#F0F0F8', marginBottom: '6px', lineHeight: 1.3, letterSpacing: '-0.2px' }}>
                    {woning.titel}
                  </h3>
                  <p style={{ color: '#8888AA', fontSize: '12px', marginBottom: '10px' }}>
                    📍 {woning.adres ? `${woning.adres}, ` : ''}{woning.stad}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {woning.prijs
                      ? <span style={{ color: '#FF6B2B', fontWeight: 700, fontSize: '16px' }}>€{woning.prijs},-/mnd</span>
                      : <span style={{ color: '#8888AA', fontSize: '14px' }}>Prijs op aanvraag</span>
                    }
                    {woning.kamers && <span style={{ color: '#8888AA', fontSize: '13px' }}>🚪 {woning.kamers}</span>}
                    {woning.oppervlakte && <span style={{ color: '#8888AA', fontSize: '13px' }}>📐 {woning.oppervlakte}m²</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#55557A', fontSize: '11px' }}>{tijdGeleden(woning.gevonden_op)}</span>
                    <a href={woning.url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '13px', padding: '7px 14px', borderRadius: '8px' }}>
                      Bekijk →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
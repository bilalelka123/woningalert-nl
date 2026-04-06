'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { maakSupabaseClient } from '../../lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [gebruiker, setGebruiker] = useState<any>(null)
  const [woningen, setWoningen] = useState<any[]>([])
  const [woonwensen, setWoonwensen] = useState<any>(null)
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    async function laadData() {
      const supabase = maakSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setGebruiker(user)

      // Haal woonwensen op
      const { data: woonwensData } = await supabase
        .from('woonwensen')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setWoonwensen(woonwensData)

      if (woonwensData) {
        // Haal woningen op die passen bij woonwensen
        let query = supabase
          .from('gevonden_woningen')
          .select('*')
          .eq('actief', true)
          .gte('prijs', woonwensData.min_prijs)
          .lte('prijs', woonwensData.max_prijs)
          .order('gevonden_op', { ascending: false })
          .limit(20)

        if (woonwensData.stad) {
          query = query.ilike('stad', `%${woonwensData.stad}%`)
        }

        const { data: woningData } = await query
        setWoningen(woningData || [])
      } else {
        // Geen woonwensen? Toon alle woningen
        const { data: woningData } = await supabase
          .from('gevonden_woningen')
          .select('*')
          .eq('actief', true)
          .order('gevonden_op', { ascending: false })
          .limit(20)
        setWoningen(woningData || [])
      }

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
    const nu = new Date()
    const d = new Date(datum)
    const uren = Math.floor((nu.getTime() - d.getTime()) / (1000 * 60 * 60))
    if (uren < 1) return 'zojuist'
    if (uren < 24) return `${uren} uur geleden`
    return `${Math.floor(uren / 24)} dagen geleden`
  }

  function isNieuw(datum: string) {
    const uren = (new Date().getTime() - new Date(datum).getTime()) / (1000 * 60 * 60)
    return uren < 24
  }

  if (laden) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #2A2A42', borderTop: '3px solid #FF6B2B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <div style={{ color: '#8888AA' }}>Laden...</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Navigatie */}
      <nav style={{ borderBottom: '1px solid #2A2A42', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '20px' }}>
          <span style={{ color: '#FF6B2B' }}>Woning</span>
          <span style={{ color: '#F0F0F8' }}>Alert NL</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/profiel" style={{ color: '#8888AA', textDecoration: 'none', fontSize: '14px' }}>
            ⚙️ Woonwensen
          </Link>
          <button onClick={uitloggen} style={{ backgroundColor: 'transparent', border: '1px solid #2A2A42', color: '#8888AA', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
            Uitloggen
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '32px', color: '#F0F0F8', marginBottom: '8px' }}>
            Welkom terug! 👋
          </h1>
          <p style={{ color: '#8888AA', fontSize: '16px' }}>
            {woonwensen
              ? `Je zoekt in ${woonwensen.stad} · €${woonwensen.min_prijs} - €${woonwensen.max_prijs} · min. ${woonwensen.min_kamers} kamer${woonwensen.min_kamers > 1 ? 's' : ''}`
              : 'Stel je woonwensen in om gepersonaliseerde resultaten te zien'
            }
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Gevonden woningen', waarde: woningen.length, kleur: '#FF6B2B' },
            { label: 'Nieuw vandaag', waarde: woningen.filter(w => isNieuw(w.gevonden_op)).length, kleur: '#FFB800' },
            { label: 'Platforms', waarde: 3, kleur: '#8888AA' },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '16px', padding: '24px' }}>
              <div style={{ color: stat.kleur, fontSize: '36px', fontWeight: 800, marginBottom: '4px' }}>{stat.waarde}</div>
              <div style={{ color: '#8888AA', fontSize: '14px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Woonwensen banner als niet ingesteld */}
        {!woonwensen && (
          <div style={{ backgroundColor: 'rgba(255,107,43,0.08)', border: '1px solid rgba(255,107,43,0.2)', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ color: '#F0F0F8', fontWeight: 600, marginBottom: '4px' }}>⚡ Stel je woonwensen in</div>
              <div style={{ color: '#8888AA', fontSize: '14px' }}>Geef aan wat je zoekt zodat we de juiste woningen voor je vinden</div>
            </div>
            <Link href="/profiel" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '12px 24px', borderRadius: '10px', fontSize: '14px', whiteSpace: 'nowrap' }}>
              Nu instellen →
            </Link>
          </div>
        )}

        {/* Woonwensen samenvatting als wel ingesteld */}
        {woonwensen && (
          <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '16px', padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {[
                { label: '📍 Stad', waarde: woonwensen.stad },
                { label: '💰 Budget', waarde: `€${woonwensen.min_prijs} - €${woonwensen.max_prijs}` },
                { label: '🚪 Kamers', waarde: `min. ${woonwensen.min_kamers}` },
                { label: '📐 Straal', waarde: `${woonwensen.straal_km} km` },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ color: '#55557A', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{item.label}</div>
                  <div style={{ color: '#F0F0F8', fontWeight: 600, fontSize: '15px' }}>{item.waarde}</div>
                </div>
              ))}
            </div>
            <Link href="/profiel" style={{ color: '#FF6B2B', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              Aanpassen →
            </Link>
          </div>
        )}

        {/* Woningen grid */}
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '22px', color: '#F0F0F8', marginBottom: '24px' }}>
          {woonwensen ? `Woningen in ${woonwensen.stad}` : 'Alle woningen'}
        </h2>

        {woningen.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 32px', backgroundColor: '#11111C', borderRadius: '20px', border: '1px solid #2A2A42' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
            <div style={{ color: '#F0F0F8', fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>
              {woonwensen ? `Geen woningen gevonden in ${woonwensen.stad}` : 'Nog geen woningen gevonden'}
            </div>
            <div style={{ color: '#8888AA', marginBottom: '24px' }}>
              {woonwensen ? 'Probeer je zoekcriteria aan te passen' : 'Stel je woonwensen in en we gaan direct voor je zoeken'}
            </div>
            <Link href="/profiel" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, padding: '12px 24px', borderRadius: '10px' }}>
              Woonwensen aanpassen
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {woningen.map((woning) => (
              <div key={woning.id} style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: '200px', backgroundColor: '#1A1A28' }}>
                  {woning.foto_url ? (
                    <img src={woning.foto_url} alt={woning.titel} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🏠</div>
                  )}
                  {isNieuw(woning.gevonden_op) && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#FF6B2B', color: 'white', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
                      NIEUW
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#F0F0F8', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px', textTransform: 'capitalize' }}>
                    {woning.platform}
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '16px', color: '#F0F0F8', marginBottom: '8px', lineHeight: 1.3 }}>
                    {woning.titel}
                  </h3>
                  {woning.adres && (
                    <p style={{ color: '#8888AA', fontSize: '13px', marginBottom: '12px' }}>
                      📍 {woning.adres}{woning.stad ? `, ${woning.stad}` : ''}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {woning.prijs && (
                      <span style={{ color: '#FF6B2B', fontWeight: 700, fontSize: '18px' }}>
                        €{woning.prijs},-/mnd
                      </span>
                    )}
                    {woning.kamers && (
                      <span style={{ color: '#8888AA', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                        🚪 {woning.kamers} kamers
                      </span>
                    )}
                    {woning.oppervlakte && (
                      <span style={{ color: '#8888AA', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                        📐 {woning.oppervlakte}m²
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#55557A', fontSize: '12px' }}>
                      {tijdGeleden(woning.gevonden_op)}
                    </span>
                    <a href={woning.url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '13px', padding: '8px 16px', borderRadius: '8px' }}>
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
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { maakSupabaseClient } from '../../lib/supabase'

export default function WachtwoordVergetenPagina() {
  const [email, setEmail] = useState('')
  const [verstuurd, setVerstuurd] = useState(false)
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')

  async function handleVerstuur(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFout('')

    const supabase = maakSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nieuw-wachtwoord`,
    })

    if (error) {
      setFout('Er is iets misgegaan. Probeer het opnieuw.')
      setLaden(false)
    } else {
      setVerstuurd(true)
      setLaden(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '24px' }}>
            <span style={{ color: '#FF6B2B' }}>Woning</span>
            <span style={{ color: '#F0F0F8' }}>Alert NL</span>
          </Link>
          <p style={{ color: '#8888AA', marginTop: '8px', fontSize: '15px' }}>
            Wachtwoord vergeten
          </p>
        </div>

        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '40px' }}>

          {verstuurd ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '20px', color: '#F0F0F8', marginBottom: '12px' }}>
                Email verstuurd!
              </h2>
              <p style={{ color: '#8888AA', lineHeight: 1.6, marginBottom: '24px' }}>
                We hebben een link gestuurd naar <strong style={{ color: '#F0F0F8' }}>{email}</strong>. Klik op de link om je wachtwoord te resetten.
              </p>
              <p style={{ color: '#55557A', fontSize: '13px' }}>
                Geen email ontvangen? Check je spam map.
              </p>
            </div>
          ) : (
            <>
              {fout && (
                <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', color: '#FF3B30', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px' }}>
                  {fout}
                </div>
              )}

              <p style={{ color: '#8888AA', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
                Vul je email adres in en we sturen je een link om je wachtwoord te resetten.
              </p>

              <form onSubmit={handleVerstuur}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: '#F0F0F8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jij@voorbeeld.nl"
                    required
                    style={{ width: '100%', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={laden}
                  style={{ width: '100%', backgroundColor: laden ? '#8888AA' : '#FF6B2B', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: laden ? 'not-allowed' : 'pointer' }}
                >
                  {laden ? 'Versturen...' : 'Reset link versturen'}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#8888AA', marginTop: '24px', fontSize: '14px' }}>
          <Link href="/login" style={{ color: '#FF6B2B', textDecoration: 'none', fontWeight: 600 }}>
            ← Terug naar inloggen
          </Link>
        </p>

      </div>
    </main>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { maakSupabaseClient } from '../../lib/supabase'

export default function RegisterPagina() {
  const router = useRouter()
  const [naam, setNaam] = useState('')
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [fout, setFout] = useState('')
  const [laden, setLaden] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFout('')

    if (wachtwoord.length < 6) {
      setFout('Wachtwoord moet minimaal 6 tekens zijn')
      setLaden(false)
      return
    }

    const supabase = maakSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password: wachtwoord,
      options: {
        data: { naam },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setFout(`Fout: ${error.message}`)
      setLaden(false)
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      setFout('Dit email adres is al in gebruik.')
      setLaden(false)
    } else {
      // Stuur welkomstmail
      await fetch('/api/welkomstmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ naam, email }),
      })
      router.push('/dashboard')
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none', fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#FF6B2B' }}>Woning</span>
            <span style={{ color: '#F0F0F8' }}>Alert NL</span>
          </Link>
          <p style={{ color: '#8888AA', marginTop: '8px', fontSize: '15px' }}>
            Maak een gratis account aan
          </p>
        </div>

        <div style={{ backgroundColor: '#11111C', border: '1px solid #2A2A42', borderRadius: '20px', padding: '40px' }}>

          {fout && (
            <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', color: '#FF3B30', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', fontSize: '14px' }}>
              {fout}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#F0F0F8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Naam</label>
              <input
                type="text"
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
                placeholder="Jouw naam"
                required
                style={{ width: '100%', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#F0F0F8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jij@voorbeeld.nl"
                required
                style={{ width: '100%', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', color: '#F0F0F8', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Wachtwoord</label>
              <input
                type="password"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                placeholder="Minimaal 6 tekens"
                required
                style={{ width: '100%', backgroundColor: '#1A1A28', border: '1px solid #2A2A42', color: '#F0F0F8', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <button
              type="submit"
              disabled={laden}
              style={{ width: '100%', backgroundColor: laden ? '#8888AA' : '#FF6B2B', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: laden ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              {laden ? 'Account aanmaken...' : 'Gratis account aanmaken'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#8888AA', marginTop: '24px', fontSize: '14px' }}>
          Al een account?{' '}
          <Link href="/login" style={{ color: '#FF6B2B', textDecoration: 'none', fontWeight: 600 }}>
            Log hier in
          </Link>
        </p>

      </div>
    </main>
  )
}
import Link from 'next/link'

export default function NietGevonden() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08080F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>

        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '120px', color: '#2A2A42', lineHeight: 1, marginBottom: '8px' }}>
          404
        </div>

        <div style={{ fontSize: '48px', marginBottom: '24px' }}>🏠</div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '28px', color: '#F0F0F8', marginBottom: '12px' }}>
          Deze pagina bestaat niet
        </h1>

        <p style={{ color: '#8888AA', fontSize: '16px', lineHeight: 1.6, marginBottom: '40px' }}>
          De pagina die je zoekt is niet gevonden. Misschien is de link verkeerd of is de pagina verplaatst.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ backgroundColor: '#FF6B2B', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '15px', padding: '14px 28px', borderRadius: '10px' }}>
            🏠 Naar home
          </Link>
          <Link href="/dashboard" style={{ border: '1px solid #2A2A42', color: '#F0F0F8', textDecoration: 'none', fontWeight: 600, fontSize: '15px', padding: '13px 28px', borderRadius: '10px' }}>
            Dashboard
          </Link>
        </div>

      </div>
    </main>
  )
}
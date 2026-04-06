import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WoningAlert NL – Nooit meer een woning missen',
  description: 'Automatische woningmeldingen voor huurwoningen in Noord-Brabant.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-background text-tekst antialiased">
        {children}
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'WoningAlert NL – Nooit meer een woning missen',
  description: 'Automatische woningmeldingen voor huurwoningen in Noord-Brabant.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏠</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LTH4T6LZ7C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LTH4T6LZ7C');
          `}
        </Script>
      </head>
      <body className="bg-background text-tekst antialiased">
        {children}
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'WoningAlert NL – Nooit meer een woning missen',
  description: 'Automatische woningmeldingen voor huurwoningen in Noord-Brabant.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WoningAlert NL',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#FF6B2B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WoningAlert NL" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-LTH4T6LZ7C" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LTH4T6LZ7C');
        `}</Script>
      </head>
      <body className="bg-background text-tekst antialiased">
        {children}
      </body>
    </html>
  )
}
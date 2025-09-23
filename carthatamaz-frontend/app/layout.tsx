import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Toaster as ToasterShadcn } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarthaTamaz - Plateforme de Réservation d\'Hébergements',
  description: 'Découvrez et réservez les meilleurs hébergements en Tunisie avec CarthaTamaz. Maisons d\'hôtes, villas et appartements de qualité.',
  keywords: 'hébergement, réservation, Tunisie, maison d\'hôte, villa, appartement, vacances',
  authors: [{ name: 'CarthaTamaz Team' }],
  creator: 'CarthaTamaz',
  publisher: 'CarthaTamaz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://carthatamaz.com'),
  openGraph: {
    title: 'CarthaTamaz - Plateforme de Réservation d\'Hébergements',
    description: 'Découvrez et réservez les meilleurs hébergements en Tunisie avec CarthaTamaz.',
    url: 'https://carthatamaz.com',
    siteName: 'CarthaTamaz',
    locale: 'fr_TN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CarthaTamaz - Plateforme de Réservation d\'Hébergements',
    description: 'Découvrez et réservez les meilleurs hébergements en Tunisie avec CarthaTamaz.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
            <ToasterShadcn />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PortalNav } from '@/components/PortalNav'
import { PortalFooter } from '@/components/PortalFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://home.iai.one'),
  title: {
    default: 'IAI Portal',
    template: '%s | IAI Portal',
  },
  description:
    'Portal for the iai.one ecosystem. Route into app, flow, docs, developer, dashboard, and the migrated community destination.',
  keywords: [
    'IAI',
    'iai.one',
    'portal',
    'app.iai.one',
    'flow.iai.one',
    'docs.iai.one',
    'developer.iai.one',
  ],
  alternates: {
    canonical: 'https://home.iai.one',
  },
  openGraph: {
    title: 'IAI Portal',
    description: 'Enter the IAI ecosystem through the right surface.',
    url: 'https://home.iai.one',
    siteName: 'IAI Portal',
    type: 'website',
    images: [{ url: '/og-portal.svg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IAI Portal',
    description: 'Enter the IAI ecosystem through the right surface.',
    images: ['/og-portal.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0D0D0F',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-obsidian text-white antialiased">
        <PortalNav />
        {children}
        <PortalFooter />
      </body>
    </html>
  )
}

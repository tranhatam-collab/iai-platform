// ═══════════════════════════════════════════════════════════════
//  IAI Platform — Root Layout
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: {
    default: 'IAI — Intelligence · Artistry · International',
    template: '%s | IAI',
  },
  description:
    'Nền tảng giáo dục cộng đồng nơi mọi thông tin được AI kiểm chứng và lưu trữ phi tập trung. Học hỏi, thảo luận, chia sẻ — với sự thật là nền tảng.',
  keywords: ['IAI', 'fact-check', 'giáo dục', 'AI', 'blockchain', 'kiểm chứng', 'iai.one'],
  authors: [{ name: 'IAI — Hiệp Hội Trí Tuệ Sáng Tạo Toàn Cầu' }],
  creator: 'IAI',
  openGraph: {
    type:        'website',
    locale:      'vi_VN',
    url:         'https://iai.one',
    siteName:    'IAI',
    title:       'IAI — Intelligence · Artistry · International',
    description: 'Giáo dục bằng sự thật. Lưu trữ bởi phi tập trung.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'IAI — Intelligence · Artistry · International',
    description: 'Giáo dục bằng sự thật. Lưu trữ bởi phi tập trung.',
    images:      ['/og-image.png'],
  },
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor:  '#0D0D0F',
  colorScheme: 'dark',
  width:       'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-obsidian text-white antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

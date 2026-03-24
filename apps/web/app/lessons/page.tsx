// ═══════════════════════════════════════════════════════════════
//  IAI Lessons Page — Knowledge Library
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { LessonsClient } from './LessonsClient'
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Kho Bài Học — IAI',
  description: 'Bài học chất lượng cao được AI kiểm chứng, do cộng đồng và IAI Mind tạo ra trên app.iai.one.',
  path: '/lessons',
  keywords: ['bài học AI', 'lesson library', 'giáo dục cộng đồng'],
})

export default function LessonsPage() {
  const lessonsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Kho Bài Học IAI',
    url: absoluteUrl('/lessons'),
    description: metadata.description,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(lessonsJsonLd) }}
      />
      <LessonsClient />
    </>
  )
}

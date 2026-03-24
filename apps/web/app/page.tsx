// ═══════════════════════════════════════════════════════════════
//  IAI Homepage — Social Feed
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { FeedPage } from './FeedPage'
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI V3.0 — Giáo dục, cộng tác và tài sản kiểm chứng',
  description: 'App surface cho social, collaboration, marketplace và automation. nft.iai.one giữ lớp tài sản kiểm chứng cho bài học, nội dung và tri thức đã verify.',
  path: '/',
  keywords: ['social learning', 'community feed', 'knowledge marketplace', 'verified assets'],
})

export default function HomePage() {
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'IAI V3.0',
    url: absoluteUrl('/'),
    description: metadata.description,
    isPartOf: absoluteUrl('/'),
    about: [
      'Social learning',
      'Collaboration',
      'Marketplace',
      'Knowledge NFT',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(homeJsonLd) }}
      />
      <FeedPage />
    </>
  )
}

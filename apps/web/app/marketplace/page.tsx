// ═══════════════════════════════════════════════════════════════
//  IAI Marketplace — Kho Tri Thức
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { MarketplaceClient } from './MarketplaceClient'
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo'

export const runtime = 'edge'

export const metadata: Metadata = pageMetadata({
  title: 'Kho Tri Thức IAI — Marketplace',
  description:
    'Khóa học, tài liệu và chuyên đề premium như Scaffolding cho người làm giáo dục chuyên sâu trên nền tảng IAI.',
  path: '/marketplace',
  keywords: ['marketplace', 'khóa học premium', 'scaffolding', 'tài liệu giáo dục'],
})

export default function MarketplacePage() {
  const marketplaceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'IAI Marketplace',
    url: absoluteUrl('/marketplace'),
    description: metadata.description,
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Scaffolding cho giáo dục chuyên sâu' } },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(marketplaceJsonLd) }}
      />
      <MarketplaceClient />
    </>
  )
}

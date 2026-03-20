// ═══════════════════════════════════════════════════════════════
//  IAI Marketplace — Kho Tri Thức
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { MarketplaceClient } from './MarketplaceClient'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Kho Tri Thức IAI — Marketplace',
  description:
    'Khóa học và tài liệu chất lượng cao, được AI kiểm chứng. Mua, học và chia sẻ tri thức trên nền tảng IAI.',
  openGraph: {
    title: 'Kho Tri Thức IAI',
    description: 'Khóa học và tài liệu được kiểm chứng bởi AI. Học ngay trên IAI.',
    type: 'website',
  },
}

export default function MarketplacePage() {
  return <MarketplaceClient />
}

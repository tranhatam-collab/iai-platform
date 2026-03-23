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
    'Khóa học, tài liệu và chuyên đề premium như Scaffolding cho người làm giáo dục chuyên sâu trên nền tảng IAI.',
  openGraph: {
    title: 'Kho Tri Thức IAI',
    description: 'Khóa học, tài liệu và chuyên đề premium được kiểm chứng bởi AI. Học ngay trên IAI.',
    type: 'website',
  },
}

export default function MarketplacePage() {
  return <MarketplaceClient />
}

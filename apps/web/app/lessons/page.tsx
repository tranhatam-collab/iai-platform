// ═══════════════════════════════════════════════════════════════
//  IAI Lessons Page — Knowledge Library
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { LessonsClient } from './LessonsClient'

export const metadata: Metadata = {
  title: 'Kho Bài Học — IAI',
  description: 'Bài học chất lượng cao, được AI kiểm chứng, do cộng đồng và IAI Mind tạo ra.',
}

export default function LessonsPage() {
  return <LessonsClient />
}

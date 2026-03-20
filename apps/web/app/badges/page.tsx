// ═══════════════════════════════════════════════════════════════
//  IAI Badge System — Explorer Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { BadgesExplorer } from './BadgesExplorer'

export const metadata: Metadata = {
  title: 'Huy hiệu IAI — Badge System',
  description: 'Khám phá toàn bộ hệ thống huy hiệu IAI — từ Truth Shield đến Obsidian Legend.',
}

export default function BadgesPage() {
  return <BadgesExplorer />
}

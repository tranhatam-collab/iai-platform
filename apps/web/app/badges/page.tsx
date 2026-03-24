// ═══════════════════════════════════════════════════════════════
//  IAI Badge System — Explorer Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { BadgesExplorer } from './BadgesExplorer'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Huy hiệu IAI — Badge System',
  description: 'Khám phá toàn bộ hệ thống huy hiệu IAI, từ Truth Shield đến Obsidian Legend, và cách chúng nối sang lớp tài sản kiểm chứng.',
  path: '/badges',
  keywords: ['badge system', 'uy tín', 'reputation', 'truth shield'],
})

export default function BadgesPage() {
  return <BadgesExplorer />
}

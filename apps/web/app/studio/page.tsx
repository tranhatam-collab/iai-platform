// ═══════════════════════════════════════════════════════════════
//  IAI Studio — AI Content Creation Studio
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { StudioClient } from './StudioClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'IAI Studio — Xưởng sáng tạo AI',
  description: 'Tạo bài học, kiểm chứng nội dung, kết nối flow.iai.one và lớp tài sản kiểm chứng của nft.iai.one từ một studio chung.',
  path: '/studio',
  keywords: ['IAI Studio', 'automation', 'n8n flow', 'nft proof layer'],
})

export default function StudioPage() {
  return <StudioClient />
}

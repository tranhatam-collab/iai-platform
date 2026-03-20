// ═══════════════════════════════════════════════════════════════
//  IAI Studio — AI Content Creation Studio
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { StudioClient } from './StudioClient'

export const metadata: Metadata = {
  title: 'IAI Studio — Xưởng sáng tạo AI',
  description: 'Tạo bài học, kiểm chứng nội dung, và quản lý nội dung của bạn với sức mạnh của Claude AI.',
}

export default function StudioPage() {
  return <StudioClient />
}

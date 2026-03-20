// ═══════════════════════════════════════════════════════════════
//  IAI Verify Page — AI Fact-Check Interface
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { VerifyClient } from './VerifyClient'

export const metadata: Metadata = {
  title: 'Kiểm Chứng AI — IAI Verify',
  description: 'Kiểm chứng bất kỳ thông tin nào với Claude AI. Phân tích luận điểm, đối chiếu nguồn, gắn nhãn sự thật.',
}

export default function VerifyPage() {
  return <VerifyClient />
}

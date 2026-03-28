// ═══════════════════════════════════════════════════════════════
//  IAI Verify Page — AI Fact-Check Interface
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { VerifyClient } from './VerifyClient'
import { absoluteUrl, jsonLd, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Kiểm Chứng AI — IAI Verify',
  description: 'Kiểm chứng bất kỳ thông tin nào với Claude AI. Phân tích luận điểm, đối chiếu nguồn và gắn nhãn sự thật trên IAI.',
  path: '/verify',
  keywords: ['kiểm chứng AI', 'fact-check', 'Claude AI', 'verify'],
})

export default function VerifyPage() {
  const verifyJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'IAI Verify',
    url: absoluteUrl('/verify'),
    description: metadata.description,
    applicationCategory: 'EducationalApplication',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(verifyJsonLd) }}
      />
      <VerifyClient />
    </>
  )
}

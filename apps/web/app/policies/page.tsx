// ═══════════════════════════════════════════════════════════════
//  IAI Policies Page — Điều khoản · Bảo mật · Bản quyền
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { PoliciesClient } from './PoliciesClient'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Chính sách — IAI',
  description:
    'Điều khoản sử dụng, chính sách bảo mật và chính sách bản quyền của nền tảng IAI. Minh bạch và bảo vệ người dùng là ưu tiên hàng đầu.',
  path: '/policies',
  keywords: ['chính sách', 'điều khoản', 'bảo mật', 'bản quyền'],
})

export default function PoliciesPage() {
  return <PoliciesClient />
}

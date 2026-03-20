// ═══════════════════════════════════════════════════════════════
//  IAI Policies Page — Điều khoản · Bảo mật · Bản quyền
//  Intelligence · Artistry · International · iai.one
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { PoliciesClient } from './PoliciesClient'

export const metadata: Metadata = {
  title: 'Chính sách — IAI',
  description:
    'Điều khoản sử dụng, chính sách bảo mật và chính sách bản quyền của nền tảng IAI. Minh bạch và bảo vệ người dùng là ưu tiên hàng đầu.',
}

export default function PoliciesPage() {
  return <PoliciesClient />
}

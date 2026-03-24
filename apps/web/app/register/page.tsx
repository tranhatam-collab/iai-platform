// ═══════════════════════════════════════════════════════════════
//  IAI Register Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Tham gia IAI — Intelligence · Artistry · International',
  description: 'Tạo tài khoản IAI để tham gia social learning, marketplace và lớp tài sản kiểm chứng của hệ sinh thái.',
  path: '/register',
  noIndex: true,
})

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  )
}

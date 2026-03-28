// ═══════════════════════════════════════════════════════════════
//  IAI Login Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Đăng nhập — IAI',
  description: 'Đăng nhập vào IAI để học, đăng bài, kiểm chứng nội dung và quản lý tài sản kiểm chứng.',
  path: '/login',
  noIndex: true,
})

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  )
}

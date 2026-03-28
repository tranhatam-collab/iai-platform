export const runtime = 'edge'
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { AuthCallbackClient } from './AuthCallbackClient'

export const metadata: Metadata = pageMetadata({
  title: 'Đang xác thực đăng nhập — IAI',
  description: 'Trang callback xác thực đăng nhập của IAI.',
  path: '/auth/callback',
  noIndex: true,
})

export default function AuthCallbackPage() {
  return <AuthCallbackClient />
}

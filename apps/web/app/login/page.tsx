// ═══════════════════════════════════════════════════════════════
//  IAI Login Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Đăng nhập — IAI',
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-sm text-white/50">Đang tải…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  IAI Register Page
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from 'next'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Tham gia IAI — Intelligence · Artistry · International',
}

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  )
}

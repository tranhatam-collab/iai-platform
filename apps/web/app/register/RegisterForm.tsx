// ═══════════════════════════════════════════════════════════════
//  IAI RegisterForm — Đăng ký chỉ cần email + handle
//  Sau khi gửi form → nhận email xác nhận → tự động đăng nhập
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.iai.one'

type Step = 'form' | 'check-email'

export function RegisterForm() {
  const [step, setStep]         = useState<Step>('form')
  const [form, setForm]         = useState({ handle: '', email: '', name: '' })
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [sentEmail, setSentEmail] = useState('')

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { handle, email } = form
    if (!handle || !email) return

    if (!/^[a-z0-9_.-]{3,30}$/.test(handle.toLowerCase())) {
      setError('Handle chỉ được dùng a-z, 0-9, _, . (3-30 ký tự)')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/v1/users/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          handle: handle.toLowerCase(),
          email:  email.toLowerCase(),
          name:   form.name.trim() || handle,
        }),
      }).then(r => r.json()) as { ok: boolean; pending?: boolean; token?: string; error?: string }

      if (!res.ok) { setError(res.error ?? 'Đăng ký thất bại'); return }

      setSentEmail(email)
      setStep('check-email')
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: Check your email ──────────────────────────────
  if (step === 'check-email') {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-gold mb-6">
          <span className="text-2xl">✉️</span>
        </div>
        <h1 className="font-serif text-2xl text-white mb-2">Kiểm tra email</h1>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          Chúng tôi đã gửi link xác nhận tới<br />
          <strong className="text-gold">{sentEmail}</strong>
        </p>

        <div className="card p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-jade text-lg mt-0.5">1</span>
            <p className="text-sm text-white/60">Mở email từ <strong className="text-white/80">noreply@iai.one</strong></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-jade text-lg mt-0.5">2</span>
            <p className="text-sm text-white/60">Nhấn nút <strong className="text-white/80">"Xác nhận email"</strong></p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-jade text-lg mt-0.5">3</span>
            <p className="text-sm text-white/60">Bạn sẽ tự động đăng nhập vào IAI</p>
          </div>
        </div>

        <p className="text-xs text-white/25 mt-4">Link hết hạn sau 24 giờ.</p>

        <ResendButton email={sentEmail} />

        <p className="text-center text-sm text-white/35 mt-4">
          Sai email?{' '}
          <button onClick={() => setStep('form')} className="text-gold hover:text-gold-light transition-colors font-medium">
            Nhập lại
          </button>
        </p>
      </div>
    )
  }

  // ── Step 1: Register form ─────────────────────────────────
  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-gold mb-4">
          <span className="font-serif text-2xl font-bold text-obsidian">I</span>
        </div>
        <h1 className="font-serif text-2xl text-white mb-1">Tham gia IAI</h1>
        <p className="text-sm text-white/40">Intelligence · Artistry · International</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {/* Handle */}
        <div className="input-wrapper">
          <label htmlFor="handle">Username (handle)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 text-sm">@</span>
            <input
              id="handle"
              type="text"
              value={form.handle}
              onChange={e => setForm(f => ({ ...f, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, '') }))}
              placeholder="your_handle"
              className="pl-8"
              required minLength={3} maxLength={30}
            />
          </div>
          <p className="text-xs text-white/25 mt-1 font-mono">Chỉ a-z, 0-9, _, . — dùng cho profile URL</p>
        </div>

        {/* Name (optional) */}
        <div className="input-wrapper">
          <label htmlFor="name">
            Tên hiển thị <span className="text-white/25 font-normal text-xs">(tùy chọn)</span>
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Nguyễn Văn A"
            maxLength={60}
          />
        </div>

        {/* Email */}
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
          <p className="text-xs text-white/25 mt-1">Link xác nhận sẽ gửi về email này</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <p className="text-xs text-white/30 leading-relaxed">
          Bằng cách tham gia, bạn đồng ý với{' '}
          <Link href="/policies" className="text-gold/60 hover:text-gold">Điều khoản sử dụng</Link>{' '}
          và{' '}
          <Link href="/policies#privacy" className="text-gold/60 hover:text-gold">Chính sách bảo mật</Link> của IAI.
        </p>

        <button
          type="submit"
          disabled={!form.handle || !form.email || loading}
          className="btn btn-gold btn-lg w-full justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner w-4 h-4" /> Đang tạo tài khoản…
            </span>
          ) : 'Tạo tài khoản'}
        </button>
      </form>

      <p className="text-center text-sm text-white/35 mt-5">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
          Đăng nhập
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-5">
        <div className="flex-1 h-px bg-obsidian-border" />
        <span className="text-xs text-white/25 font-mono">hoặc đăng ký nhanh với</span>
        <div className="flex-1 h-px bg-obsidian-border" />
      </div>

      {/* Social signup */}
      <div className="mt-4 space-y-2.5">
        <a href="https://api.iai.one/v1/auth/google"
           className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </a>
        <a href="https://api.iai.one/v1/auth/facebook"
           className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </a>
        <a href="https://api.iai.one/v1/auth/x"
           className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.86L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          X (Twitter)
        </a>
      </div>
    </div>
  )
}

// ── Resend verification button ────────────────────────────────
function ResendButton({ email }: { email: string }) {
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)

  async function resend() {
    setLoading(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'https://api.iai.one'}/v1/users/resend-verification`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      {sent ? (
        <p className="text-jade text-sm">Email đã được gửi lại!</p>
      ) : (
        <button
          onClick={resend}
          disabled={loading}
          className="text-sm text-white/40 hover:text-gold transition-colors underline underline-offset-2"
        >
          {loading ? 'Đang gửi…' : 'Chưa nhận được email? Gửi lại'}
        </button>
      )}
    </div>
  )
}

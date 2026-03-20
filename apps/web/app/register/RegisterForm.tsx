// ═══════════════════════════════════════════════════════════════
//  IAI RegisterForm — Join IAI
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import type { User } from '@/types'

function PasswordStrength({ password }: { password: string }) {
  const strength =
    password.length === 0   ? 0 :
    password.length < 6     ? 1 :
    password.length < 10    ? 2 :
    /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3

  const bars   = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-jade']
  const labels = ['', 'Yếu',   'Trung bình',   'Tốt',          'Mạnh']

  return password.length > 0 ? (
    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex gap-0.5 flex-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? bars[strength - 1] : 'bg-obsidian-muted'}`} />
        ))}
      </div>
      <span className="text-xs text-white/40 font-mono w-20 text-right">{labels[strength]}</span>
    </div>
  ) : null
}

export function RegisterForm() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [form, setForm] = useState({ handle: '', name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { handle, name, email, password } = form
    if (!handle || !name || !email || !password) return
    if (password.length < 8) { setError('Mật khẩu phải ít nhất 8 ký tự'); return }
    if (!/^[a-z0-9_.-]+$/.test(handle)) { setError('Handle chỉ được dùng a-z, 0-9, _, .'); return }

    setLoading(true)
    setError('')
    try {
      const res = await api.auth.register({ handle, name, email, password }) as {
        ok: boolean; token?: string; user?: User; error?: string
      }
      if (!res.ok || !res.token || !res.user) {
        setError(res.error ?? 'Đăng ký thất bại')
        return
      }
      setAuth(res.token, res.user)
      router.push('/')
    } catch {
      setError('Không thể kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

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
              required
              minLength={3}
              maxLength={30}
            />
          </div>
          <p className="text-xs text-white/25 mt-1 font-mono">Chỉ a-z, 0-9, _, . (3-30 ký tự)</p>
        </div>

        {/* Name */}
        <div className="input-wrapper">
          <label htmlFor="name">Tên hiển thị</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Nguyễn Văn A"
            required
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
        </div>

        {/* Password */}
        <div className="input-wrapper">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="Ít nhất 8 ký tự"
            autoComplete="new-password"
            required
            minLength={8}
          />
          <PasswordStrength password={form.password} />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Terms */}
        <p className="text-xs text-white/30 leading-relaxed">
          Bằng cách tham gia, bạn đồng ý với{' '}
          <span className="text-gold/60 hover:text-gold cursor-pointer">Điều khoản sử dụng</span>{' '}
          và{' '}
          <span className="text-gold/60 hover:text-gold cursor-pointer">Chính sách bảo mật</span> của IAI.
        </p>

        <button
          type="submit"
          disabled={!form.handle || !form.name || !form.email || !form.password || loading}
          className="btn btn-gold btn-lg w-full justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner w-4 h-4" /> Đang tạo tài khoản…
            </span>
          ) : 'Tham gia IAI'}
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
        <a
          href="https://api.iai.one/v1/auth/google"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </a>
        <a
          href="https://api.iai.one/v1/auth/facebook"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>
        <a
          href="https://api.iai.one/v1/auth/x"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.86L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          X (Twitter)
        </a>
      </div>
    </div>
  )
}

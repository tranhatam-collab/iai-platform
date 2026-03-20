// ═══════════════════════════════════════════════════════════════
//  IAI LoginForm — Client-side login
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import type { User } from '@/types'

export function LoginForm() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')
    try {
      const res = await api.auth.login({ email, password }) as {
        ok: boolean; token?: string; user?: User; error?: string
      }
      if (!res.ok || !res.token || !res.user) {
        setError(res.error ?? 'Email hoặc mật khẩu không đúng')
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
        <h1 className="font-serif text-2xl text-white mb-1">Chào mừng trở lại</h1>
        <p className="text-sm text-white/40">Đăng nhập vào IAI</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="input-wrapper">
          <label htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!email || !password || loading}
          className="btn btn-gold btn-lg w-full justify-center"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner w-4 h-4" /> Đang đăng nhập…
            </span>
          ) : 'Đăng nhập'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 mt-5">
        <div className="flex-1 h-px bg-obsidian-border" />
        <span className="text-xs text-white/25 font-mono">hoặc</span>
        <div className="flex-1 h-px bg-obsidian-border" />
      </div>

      {/* Social login */}
      <div className="mt-4 space-y-2.5">
        <a
          href="https://api.iai.one/v1/auth/google"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Tiếp tục với Google
        </a>

        <a
          href="https://api.iai.one/v1/auth/facebook"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Tiếp tục với Facebook
        </a>

        <a
          href="https://api.iai.one/v1/auth/x"
          className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-obsidian-border bg-obsidian-mid hover:bg-obsidian-hover hover:border-gold/30 transition-all text-sm text-white/80 font-medium"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.86L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          Tiếp tục với X (Twitter)
        </a>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-white/35 mt-5">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="text-gold hover:text-gold-light transition-colors font-medium">
          Tham gia IAI
        </Link>
      </p>

      {/* IAI Value Prop */}
      <div className="mt-8 p-4 rounded-xl border border-obsidian-border bg-obsidian-mid">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gold text-xs">✦</span>
          <span className="text-xs font-mono text-white/40 uppercase tracking-wide">IAI cam kết</span>
        </div>
        <ul className="space-y-1.5 text-xs text-white/40">
          <li className="flex items-center gap-2">
            <span className="text-jade">✓</span> Không spam, không quảng cáo rác
          </li>
          <li className="flex items-center gap-2">
            <span className="text-jade">✓</span> Dữ liệu được bảo mật
          </li>
          <li className="flex items-center gap-2">
            <span className="text-jade">✓</span> Mọi nội dung được AI kiểm chứng
          </li>
        </ul>
      </div>
    </div>
  )
}

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

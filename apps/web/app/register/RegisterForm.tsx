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
    </div>
  )
}

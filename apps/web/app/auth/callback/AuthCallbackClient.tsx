'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/store/auth'
import type { User } from '@/types'

export function AuthCallbackClient() {
  const router       = useRouter()
  const params       = useSearchParams()
  const { setAuth }  = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    const token   = params.get('token')
    const userB64 = params.get('user')
    const errCode = params.get('error')

    if (errCode) {
      const msgs: Record<string, string> = {
        provider_not_configured: 'Nhà cung cấp OAuth chưa được cấu hình.',
        oauth_failed:            'Đăng nhập thất bại. Vui lòng thử lại.',
        invalid_state:           'Phiên đăng nhập hết hạn. Vui lòng thử lại.',
        token_failed:            'Không thể xác thực token.',
        missing_profile:         'Không lấy được thông tin tài khoản.',
        oauth_error:             'Lỗi đăng nhập mạng xã hội.',
      }
      setError(msgs[errCode] ?? 'Đăng nhập thất bại.')
      setTimeout(() => router.replace('/login'), 3000)
      return
    }

    if (!token || !userB64) {
      setError('Thiếu thông tin đăng nhập.')
      setTimeout(() => router.replace('/login'), 3000)
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(atob(userB64))) as User
      setAuth(token, user)
      router.replace('/')
    } catch {
      setError('Không thể đọc thông tin người dùng.')
      setTimeout(() => router.replace('/login'), 3000)
    }
  }, [params, setAuth, router])

  if (error) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center">
        <div className="card p-8 max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-red-400 text-sm">{error}</p>
          <p className="text-white/40 text-xs">Đang chuyển về trang đăng nhập…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center">
      <div className="card p-8 max-w-sm w-full text-center space-y-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-dark shadow-gold">
          <span className="font-serif text-2xl font-bold text-obsidian">I</span>
        </div>
        <p className="text-white/60 text-sm">Đang xác thực…</p>
        <div className="flex justify-center">
          <span className="spinner w-6 h-6 border-gold/40 border-t-gold" />
        </div>
      </div>
    </div>
  )
}

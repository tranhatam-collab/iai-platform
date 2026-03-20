// ═══════════════════════════════════════════════════════════════
//  IAI UserProfileClient — User profile view
// ═══════════════════════════════════════════════════════════════

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { cn, getTrustColor, formatDate } from '@/lib/utils'
import type { User } from '@/types'

type Props = { handle: string }

const EDU_LEVELS: Record<string, { label: string; icon: string; color: string }> = {
  learner:  { label: 'Người học',  icon: '◉', color: 'text-jade' },
  educator: { label: 'Giáo viên',  icon: '✦', color: 'text-gold' },
  expert:   { label: 'Chuyên gia', icon: '◈', color: 'text-cyan-iai' },
}

export function UserProfileClient({ handle }: Props) {
  const [user, setUser]     = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.auth.profile(handle) as { ok: boolean; user?: User; error?: string }
        if (!res.ok || !res.user) { setError('Không tìm thấy người dùng'); return }
        setUser(res.user)
      } catch {
        setError('Không thể tải hồ sơ.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [handle])

  if (loading) return <ProfileSkeleton />
  if (error || !user) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-4">◉</div>
      <h2 className="font-serif text-xl text-white/60 mb-4">{error || 'Người dùng không tồn tại'}</h2>
      <Link href="/" className="btn btn-outline">← Về trang chủ</Link>
    </div>
  )

  const eduInfo = EDU_LEVELS[user.edu_level] ?? EDU_LEVELS.learner

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Cover + Avatar */}
      <div className="relative h-32 rounded-2xl bg-gradient-to-br from-obsidian-mid via-obsidian-light to-obsidian-mid border border-obsidian-border mb-16">
        <div className="absolute -bottom-12 left-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold to-gold-dark border-4 border-obsidian flex items-center justify-center text-obsidian font-bold text-3xl font-serif shadow-gold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-2">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="font-serif text-2xl text-white">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-white/40 font-mono">@{user.handle}</span>
              {user.verified >= 1 && (
                <span className="badge badge-verified text-xs">✓ Xác thực</span>
              )}
              <span className={cn('badge text-xs', eduInfo.color)}>
                {eduInfo.icon} {eduInfo.label}
              </span>
            </div>
          </div>
          <button className="btn btn-outline btn-sm shrink-0">Theo dõi</button>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-white/60 leading-relaxed mb-5">{user.bio}</p>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 text-xs text-white/35 font-mono mb-6">
          {user.location && <span>📍 {user.location}</span>}
          {user.website && (
            <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-cyan-iai/60 hover:text-cyan-iai transition-colors">
              ↗ {user.website.replace(/^https?:\/\//, '')}
            </a>
          )}
          <span>Tham gia {formatDate(user.created_at)}</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Trust Score',  value: `${user.trust_score}`,  color: getTrustColor(user.trust_score) },
            { label: 'Reputation',   value: String(user.reputation), color: 'text-white/70' },
            { label: 'Cấp độ AI',    value: String(user.edu_level),  color: 'text-cyan-iai' },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className={`text-xl font-bold font-serif ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/30 font-mono">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Wallet */}
        {user.wallet_address && (
          <div className="card p-4 flex items-center gap-3 mb-4">
            <span className="text-cyan-iai text-xl">⬡</span>
            <div>
              <div className="text-xs font-mono text-white/40">Ví Web3</div>
              <div className="text-sm font-mono text-white/60">
                {user.wallet_address.slice(0, 6)}…{user.wallet_address.slice(-4)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="h-32 rounded-2xl skeleton mb-16" />
      <div className="px-2 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <div className="skeleton h-7 w-48 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}
        </div>
      </div>
    </div>
  )
}

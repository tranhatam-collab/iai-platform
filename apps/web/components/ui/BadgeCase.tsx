'use client'

/* ═══════════════════════════════════════════════════════════════
   IAI BadgeCase — Profile badge showcase & collection viewer
   ═══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { IaiBadge } from './IaiBadge'
import { BADGES, BADGE_MAP, PILLAR_CONFIG, TIER_CONFIG } from '@/lib/badges'
import type { BadgePillar, EarnedBadge } from '@/types/badges'

interface BadgeCaseProps {
  earned: EarnedBadge[]
  featured?: string[]    // up to 5 highlighted badge IDs
  xpTotal?: number
  compact?: boolean      // show only featured strip
}

export function BadgeCase({ earned, featured = [], xpTotal = 0, compact = false }: BadgeCaseProps) {
  const [activeFilter, setActiveFilter] = useState<BadgePillar | 'all'>('all')
  const earnedIds = new Set(earned.map(e => e.badgeId))

  const filteredBadges = BADGES.filter(b =>
    activeFilter === 'all' || b.pillar === activeFilter
  )

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {featured.slice(0, 5).map(id => {
          const earnedBadge = earned.find(e => e.badgeId === id)
          return (
            <IaiBadge
              key={id}
              badgeId={id}
              earned={earnedBadge}
              size="sm"
              locked={!earnedIds.has(id)}
            />
          )
        })}
        {earned.length > 5 && (
          <span className="text-xs text-white/40 font-mono">+{earned.length - 5}</span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif text-white">Bộ sưu tập huy hiệu</h3>
          <p className="text-xs text-white/40 mt-0.5 font-mono">
            {earnedIds.size}/{BADGES.length} đã đạt được · {xpTotal.toLocaleString()} XP
          </p>
        </div>
        {/* XP progress ring summary */}
        <XpSummary earned={earnedIds.size} total={BADGES.length} xp={xpTotal} />
      </div>

      {/* Featured strip */}
      {featured.length > 0 && (
        <div>
          <p className="text-xs text-white/30 font-mono uppercase tracking-wide mb-3">
            Huy hiệu nổi bật
          </p>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-obsidian-mid border border-obsidian-border">
            {featured.slice(0, 5).map(id => {
              const earnedBadge = earned.find(e => e.badgeId === id)
              return (
                <IaiBadge
                  key={id}
                  badgeId={id}
                  earned={earnedBadge}
                  size="lg"
                  locked={!earnedIds.has(id)}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Pillar filter tabs */}
      <div className="flex gap-1 flex-wrap">
        <FilterChip active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} color="#ffffff">
          Tất cả
        </FilterChip>
        {(Object.entries(PILLAR_CONFIG) as [BadgePillar, typeof PILLAR_CONFIG[BadgePillar]][]).map(([key, cfg]) => (
          <FilterChip
            key={key}
            active={activeFilter === key}
            onClick={() => setActiveFilter(key)}
            color={cfg.color}
          >
            {cfg.label}
          </FilterChip>
        ))}
      </div>

      {/* Badge grid grouped by tier */}
      {(['obsidian', 'platinum', 'gold', 'silver', 'bronze'] as const).map(tier => {
        const tierBadges = filteredBadges.filter(b => b.tier === tier)
        if (tierBadges.length === 0) return null
        const tierCfg = TIER_CONFIG[tier]
        const tierEarned = tierBadges.filter(b => earnedIds.has(b.id)).length

        return (
          <div key={tier}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, ${tierCfg.border}, transparent)` }}
              />
              <span
                className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  color: tierCfg.color,
                  background: tierCfg.bg,
                  border: `1px solid ${tierCfg.border}`,
                }}
              >
                {tierCfg.label} · {tierEarned}/{tierBadges.length}
              </span>
              <div
                className="h-px flex-1"
                style={{ background: `linear-gradient(90deg, transparent, ${tierCfg.border})` }}
              />
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {tierBadges.map(badge => {
                const earnedBadge = earned.find(e => e.badgeId === badge.id)
                const isLocked = !earnedIds.has(badge.id)
                return (
                  <div key={badge.id} className="flex flex-col items-center gap-1.5">
                    <IaiBadge
                      badgeId={badge.id}
                      earned={earnedBadge}
                      size="md"
                      locked={isLocked}
                    />
                    <span
                      className="text-xs text-center leading-tight font-mono"
                      style={{ color: isLocked ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)' }}
                    >
                      {badge.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Filter chip ───────────────────────────────────────────────────
function FilterChip({
  active,
  onClick,
  color,
  children,
}: {
  active: boolean
  onClick: () => void
  color: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-mono px-3 py-1 rounded-full transition-all duration-200"
      style={{
        color: active ? '#0D0D0F' : color,
        background: active ? color : 'transparent',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
      }}
    >
      {children}
    </button>
  )
}

// ── XP Summary ring ───────────────────────────────────────────────
function XpSummary({ earned, total, xp }: { earned: number; total: number; xp: number }) {
  const pct = Math.round((earned / total) * 100)
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={56} height={56} viewBox="0 0 56 56">
        {/* Track */}
        <circle cx={28} cy={28} r={r} fill="none" stroke="#242430" strokeWidth={3} />
        {/* Progress */}
        <circle
          cx={28}
          cy={28}
          r={r}
          fill="none"
          stroke="#C9A84C"
          strokeWidth={3}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text x={28} y={24} textAnchor="middle" fill="white" fontSize={11} fontWeight={700} fontFamily="DM Mono">
          {pct}%
        </text>
        <text x={28} y={35} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={7} fontFamily="DM Mono">
          {earned}/{total}
        </text>
      </svg>
      <span className="text-xs text-gold font-mono">{xp >= 1000 ? `${(xp/1000).toFixed(1)}K` : xp} XP</span>
    </div>
  )
}

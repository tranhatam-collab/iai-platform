'use client'

/* ═══════════════════════════════════════════════════════════════
   IAI Badges Explorer — Full badge system showcase
   ═══════════════════════════════════════════════════════════════ */

import { BadgeCase } from '@/components/ui/BadgeCase'
import { IaiBadge } from '@/components/ui/IaiBadge'
import { BADGES, PILLAR_CONFIG, TIER_CONFIG } from '@/lib/badges'
import type { EarnedBadge } from '@/types/badges'

// Demo: simulate a user who has earned a few badges
const DEMO_EARNED: EarnedBadge[] = [
  { badgeId: 'TRUTH_SEEKER',  earnedAt: '2025-01-15T10:00:00Z', context: 'First fact-check submitted' },
  { badgeId: 'MYTH_BUSTER',   earnedAt: '2025-02-03T14:30:00Z', context: '10 disputes confirmed' },
  { badgeId: 'FIRST_LIGHT',   earnedAt: '2025-01-15T11:00:00Z' },
  { badgeId: 'SCHOLAR',       earnedAt: '2025-03-01T09:00:00Z' },
  { badgeId: 'INK_DROP',      earnedAt: '2025-01-20T16:00:00Z', context: 'First post published' },
  { badgeId: 'STORYTELLER',   earnedAt: '2025-02-28T18:00:00Z' },
  { badgeId: 'PIONEER',       earnedAt: '2025-01-10T08:00:00Z', context: 'User #342' },
  { badgeId: 'CATALYST',      earnedAt: '2025-03-10T12:00:00Z', context: 'Post sparked 63 replies' },
  { badgeId: 'IAI_VERIFIED',  earnedAt: '2025-01-10T08:00:00Z' },
]

const DEMO_FEATURED = ['PIONEER', 'IAI_VERIFIED', 'ORACLE', 'MYTH_BUSTER', 'LEGEND']
const DEMO_XP = DEMO_EARNED.reduce((sum, e) => {
  const b = BADGES.find(b => b.id === e.badgeId)
  return sum + (b?.xp ?? 0)
}, 0)

export function BadgesExplorer() {
  const totalBadges = BADGES.length
  const pillars = Object.entries(PILLAR_CONFIG)
  const tiers = Object.entries(TIER_CONFIG)

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-obsidian-border">
        <div className="absolute inset-0 bg-glow-gold opacity-30 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Showcase 5 animated badges */}
            {(['GENESIS', 'ETERNAL_LIGHT', 'TRUTH_ENGINE', 'LEGEND', 'FLAME_OF_AGES'] as const).map((id, i) => (
              <IaiBadge
                key={id}
                badgeId={id}
                size={i === 2 ? 'xl' : i % 2 === 0 ? 'lg' : 'md'}
                locked={i > 0 && i < 4}
              />
            ))}
          </div>
          <h1 className="text-4xl font-serif text-gradient-gold mt-6 mb-3">
            Hệ thống Huy hiệu IAI
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Mỗi huy hiệu là một câu chuyện — về sự thật, tri thức, sáng tạo và cộng đồng.
            Không chỉ là phần thưởng. Đây là danh dự.
          </p>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm">
            <Stat label="Huy hiệu" value={totalBadges} color="#C9A84C" />
            <div className="w-px h-8 bg-obsidian-border" />
            <Stat label="Trụ cột" value={pillars.length} color="#00D4FF" />
            <div className="w-px h-8 bg-obsidian-border" />
            <Stat label="Cấp độ" value={tiers.length} color="#00A878" />
            <div className="w-px h-8 bg-obsidian-border" />
            <Stat label="XP tổng" value="285K+" color="#8B5CF6" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Pillar overview */}
        <section>
          <SectionHeader
            title="5 Trụ Cột Huy Hiệu"
            subtitle="Mỗi trụ cột đại diện cho một giá trị cốt lõi của IAI"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map(([key, cfg]) => {
              const pillarBadges = BADGES.filter(b => b.pillar === key)
              return (
                <div
                  key={key}
                  className="card p-5 group hover:border-opacity-60 transition-all"
                  style={{ borderColor: `${cfg.color}20` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-xl"
                    style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}
                  >
                    {key === 'truth' ? '🔍' : key === 'knowledge' ? '📖' : key === 'creator' ? '✍️' : key === 'community' ? '🌐' : '⭐'}
                  </div>
                  <p className="font-serif text-white text-base mb-1">{cfg.label}</p>
                  <p className="text-white/40 text-xs mb-3 leading-snug">{cfg.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {pillarBadges.slice(0, 5).map(b => (
                      <IaiBadge key={b.id} badgeId={b.id} size="xs" locked={!DEMO_EARNED.find(e => e.badgeId === b.id)} />
                    ))}
                    {pillarBadges.length > 5 && (
                      <span className="text-xs text-white/30 font-mono">+{pillarBadges.length - 5}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Tier ladder */}
        <section>
          <SectionHeader
            title="5 Cấp Độ Vinh Quang"
            subtitle="Từ Bronze đến Obsidian — hành trình ngày càng khan hiếm và ý nghĩa"
          />
          <div className="space-y-3">
            {(['bronze', 'silver', 'gold', 'platinum', 'obsidian'] as const).map(tier => {
              const cfg = TIER_CONFIG[tier]
              const count = BADGES.filter(b => b.tier === tier).length
              const rarityAvg = Math.round(
                BADGES.filter(b => b.tier === tier).reduce((s, b) => s + b.rarity, 0) / count
              )
              return (
                <div
                  key={tier}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  <IaiBadge
                    badgeId={BADGES.find(b => b.tier === tier && b.animated)?.id ?? BADGES.find(b => b.tier === tier)!.id}
                    size="md"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-white">{cfg.label}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                        {count} huy hiệu
                      </span>
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">
                      {tier === 'bronze' && 'Dành cho mọi người bắt đầu hành trình. Dễ đạt, đầy ý nghĩa.'}
                      {tier === 'silver' && 'Những ai kiên trì và đã tạo dấu ấn đầu tiên trên nền tảng.'}
                      {tier === 'gold' && 'Tinh hoa — chỉ ~5% người dùng đạt được ở mỗi huy hiệu.'}
                      {tier === 'platinum' && 'Huyền thoại cộng đồng. Công nhận từ chính cộng đồng IAI.'}
                      {tier === 'obsidian' && 'Cực kỳ khan hiếm. Có thể trở thành NFT trong Phase 3.'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono" style={{ color: cfg.color }}>~{rarityAvg}%</p>
                    <p className="text-xs text-white/30">người dùng</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Demo profile */}
        <section>
          <SectionHeader
            title="Tủ huy hiệu — Demo Profile"
            subtitle="Ví dụ bộ sưu tập huy hiệu của một người dùng IAI"
          />
          <div className="card p-6">
            <BadgeCase
              earned={DEMO_EARNED}
              featured={DEMO_FEATURED}
              xpTotal={DEMO_XP}
            />
          </div>
        </section>

      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold font-mono" style={{ color }}>{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-serif text-white">{title}</h2>
      <p className="text-white/40 text-sm mt-1">{subtitle}</p>
    </div>
  )
}

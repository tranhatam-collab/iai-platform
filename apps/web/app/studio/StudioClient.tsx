// ═══════════════════════════════════════════════════════════════
//  IAI StudioClient — Content creation hub
// ═══════════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { useAuth } from '@/store/auth'

const STUDIO_TOOLS = [
  {
    id:    'lesson-gen',
    icon:  '✦',
    name:  'IAI Mind',
    label: 'AI Tạo Bài Học',
    desc:  'Nhập chủ đề, Claude AI sẽ tạo bài học đầy đủ với nguồn dẫn và fact-check tự động.',
    href:  '/lessons',
    color: 'from-gold/20 to-gold/5',
    badge: 'Phase 1 · Active',
    badgeColor: 'badge-gold',
  },
  {
    id:    'verify',
    icon:  '◎',
    name:  'IAI Verify',
    label: 'AI Kiểm Chứng',
    desc:  'Kiểm chứng bất kỳ nội dung nào — bài báo, luận điểm, tin tức — với Claude AI.',
    href:  '/verify',
    color: 'from-jade/20 to-jade/5',
    badge: 'Phase 1 · Active',
    badgeColor: 'badge-verified',
  },
  {
    id:    'post',
    icon:  '◈',
    name:  'IAI Social',
    label: 'Đăng bài viết',
    desc:  'Chia sẻ kiến thức, tin tức, tranh luận. AI sẽ kiểm chứng sau khi bạn đăng.',
    href:  '/',
    color: 'from-cyan/20 to-cyan/5',
    badge: 'Phase 1 · Active',
    badgeColor: 'badge-cyan',
  },
  {
    id:    'ipfs',
    icon:  '⬡',
    name:  'IAI Chain',
    label: 'IPFS & Blockchain',
    desc:  'Pin nội dung đã kiểm chứng lên IPFS. Anchor lên Polygon (Phase 3).',
    href:  '#',
    color: 'from-purple-500/20 to-purple-500/5',
    badge: 'Phase 3 · Coming',
    badgeColor: 'badge-opinion',
    disabled: true,
  },
  {
    id:    'nft',
    icon:  '◇',
    name:  'Knowledge NFT',
    label: 'Mint NFT Kiến Thức',
    desc:  'Bài học chất lượng cao → Knowledge NFT. Tác giả giữ quyền sở hữu vĩnh viễn.',
    href:  '#',
    color: 'from-amber-500/20 to-amber-500/5',
    badge: 'Phase 3 · Coming',
    badgeColor: 'badge-disputed',
    disabled: true,
  },
  {
    id:    'n8n',
    icon:  '⟡',
    name:  'IAI Flow',
    label: 'Automation (n8n)',
    desc:  'Tự động hóa workflow: auto post, fact-check, notify, và hơn thế nữa.',
    href:  '#',
    color: 'from-white/10 to-white/5',
    badge: 'Phase 2 · Planned',
    badgeColor: 'badge-unverified',
    disabled: true,
  },
]

export function StudioClient() {
  const { isAuth, user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-gold font-mono text-[10px]">⟡ IAI STUDIO</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-white mb-3">
          Xưởng Sáng Tạo AI
        </h1>
        <p className="text-sm text-white/45 max-w-xl leading-relaxed">
          Tất cả công cụ AI của IAI trong một chỗ — tạo bài học, kiểm chứng nội dung,
          quản lý tác phẩm và kết nối với blockchain.
        </p>
      </div>

      {/* Auth Gate */}
      {!isAuth && (
        <div className="card p-6 mb-8 flex items-center gap-5 border border-gold/20">
          <div className="text-3xl">⟡</div>
          <div className="flex-1">
            <h3 className="font-serif text-lg text-white mb-1">Đăng nhập để sử dụng Studio</h3>
            <p className="text-sm text-white/45">Tạo tài khoản miễn phí để truy cập tất cả công cụ AI.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/login" className="btn btn-outline btn-sm">Đăng nhập</Link>
            <Link href="/register" className="btn btn-gold btn-sm">Tham gia</Link>
          </div>
        </div>
      )}

      {/* User Stats (if auth) */}
      {isAuth && user && (
        <div className="card p-5 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Trust Score',  value: `${user.trust_score}/100`, color: 'text-gold' },
            { label: 'Cấp độ',       value: user.edu_level,            color: 'text-jade' },
            { label: 'Reputation',   value: String(user.reputation),   color: 'text-cyan-iai' },
            { label: 'Verified',     value: user.verified >= 1 ? '✓ Email' : '○ Chưa', color: user.verified >= 1 ? 'text-jade' : 'text-white/35' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-xl font-bold font-serif ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/35 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STUDIO_TOOLS.map(tool => (
          <Link
            key={tool.id}
            href={tool.disabled ? '#' : tool.href}
            className={`card group p-5 flex flex-col gap-4 transition-all duration-200
              ${tool.disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-gold/30 hover:shadow-card-hover hover:-translate-y-0.5'
              }`}
            onClick={e => tool.disabled && e.preventDefault()}
          >
            {/* Icon + Badge */}
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl border border-white/5`}>
                <span className="text-gold">{tool.icon}</span>
              </div>
              <span className={`badge text-xs ${tool.badgeColor}`}>{tool.badge}</span>
            </div>

            {/* Content */}
            <div>
              <div className="text-xs font-mono text-white/35 mb-1">{tool.name}</div>
              <h3 className={`font-serif text-base text-white mb-2 ${!tool.disabled ? 'group-hover:text-gold' : ''} transition-colors`}>
                {tool.label}
              </h3>
              <p className="text-xs text-white/45 leading-relaxed">{tool.desc}</p>
            </div>

            {/* Arrow */}
            {!tool.disabled && (
              <div className="mt-auto flex items-center gap-1 text-xs text-gold/50 group-hover:text-gold transition-colors">
                <span>Sử dụng</span>
                <span>→</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Phase Indicator */}
      <div className="mt-8 p-5 rounded-2xl border border-obsidian-border bg-obsidian-mid">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
          <span className="text-xs font-mono text-white/50 uppercase tracking-wide">Trạng thái hệ thống</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { phase: 'Phase 1', status: 'active',  items: ['Fact-Check AI', 'Lesson Gen', 'Social Feed', 'Auth'] },
            { phase: 'Phase 2', status: 'planned', items: ['Social+', 'Collaboration', 'Marketplace', 'n8n Flow'] },
            { phase: 'Phase 3', status: 'future',  items: ['IPFS', 'Polygon', 'Knowledge NFT', 'DAO'] },
          ].map(p => (
            <div key={p.phase}>
              <div className={`text-xs font-mono font-bold mb-2 ${
                p.status === 'active' ? 'text-jade' :
                p.status === 'planned' ? 'text-gold/70' : 'text-white/25'
              }`}>
                {p.phase} {p.status === 'active' ? '· LIVE' : p.status === 'planned' ? '· Q4 2025' : '· Q1 2026'}
              </div>
              <ul className="space-y-1">
                {p.items.map(i => (
                  <li key={i} className={`text-xs flex items-center gap-1.5 ${
                    p.status === 'active' ? 'text-white/55' : 'text-white/25'
                  }`}>
                    <span className={p.status === 'active' ? 'text-jade' : 'text-white/15'}>
                      {p.status === 'active' ? '✓' : '○'}
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

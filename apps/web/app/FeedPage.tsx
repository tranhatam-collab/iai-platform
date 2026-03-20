// ═══════════════════════════════════════════════════════════════
//  IAI FeedPage — Client-side Feed with tabs
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { PostCard } from '@/components/feed/PostCard'
import { CreatePost } from '@/components/feed/CreatePost'
import type { Post, FeedTab } from '@/types'

const TABS: { id: FeedTab; label: string; icon: string }[] = [
  { id: 'hot',      label: 'Hot',          icon: '🔥' },
  { id: 'verified', label: 'Đã kiểm chứng', icon: '✓' },
  { id: 'lesson',   label: 'Bài học',       icon: '✦' },
  { id: 'debate',   label: 'Tranh luận',    icon: '⚡' },
  { id: 'chain',    label: 'On-Chain',      icon: '⬡' },
]

// ── Skeleton Loader ──────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3 w-32 rounded" />
          <div className="skeleton h-2.5 w-24 rounded" />
        </div>
        <div className="skeleton h-5 w-20 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
      </div>
      <div className="flex gap-3">
        <div className="skeleton h-7 w-16 rounded-lg" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  )
}

// ── Hero Banner ──────────────────────────────────────────────────
function HeroBanner() {
  const { isAuth } = useAuth()
  if (isAuth) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-obsidian-mid via-obsidian-light to-obsidian-mid border border-obsidian-border mb-6 p-6 sm:p-8">
      {/* Glow */}
      <div className="absolute inset-0 bg-glow-gold opacity-50 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-gold font-mono text-[10px]">✦ PHASE 1 — EDUCATION + TRUTH</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-white mb-3 leading-tight">
          Giáo dục bằng{' '}
          <span className="text-gradient-gold">sự thật</span>.
          <br />Lưu trữ bởi{' '}
          <span className="text-gradient-iai">phi tập trung</span>.
        </h1>
        <p className="text-sm text-white/55 max-w-lg mb-5 leading-relaxed">
          Mỗi bài viết, mỗi cuộc thảo luận đều được AI kiểm chứng trước khi đến tay bạn.
          Không có chỗ cho tin giả trên IAI.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/register" className="btn btn-gold">
            Tham gia ngay
          </Link>
          <Link href="/lessons" className="btn btn-outline">
            ✦ Xem bài học
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-5 mt-6 pt-5 border-t border-obsidian-border">
          {[
            { label: 'Bài viết', value: '1,247+', color: 'text-gold' },
            { label: 'Đã kiểm chứng', value: '94%', color: 'text-jade' },
            { label: 'Bài học AI', value: '89+', color: 'text-cyan-iai' },
          ].map(s => (
            <div key={s.label}>
              <div className={`text-xl font-serif font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/35 font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Sidebar Stats ────────────────────────────────────────────────
function SidebarStats() {
  return (
    <aside className="space-y-4">
      {/* IAI Verify */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold text-[10px] font-bold">AI</span>
          </div>
          <h3 className="text-xs font-mono font-medium text-white/60 uppercase tracking-wide">
            IAI Verify Engine
          </h3>
        </div>
        <p className="text-xs text-white/40 leading-relaxed mb-4">
          Mỗi bài viết được Claude AI phân tích và gắn nhãn sự thật. Nguồn dẫn minh bạch.
        </p>
        <Link href="/verify" className="btn btn-outline btn-sm w-full justify-center">
          ◎ Kiểm chứng ngay
        </Link>
      </div>

      {/* Trending Topics */}
      <div className="card p-5">
        <h3 className="text-xs font-mono font-medium text-white/60 uppercase tracking-wide mb-3">
          Chủ đề nổi bật
        </h3>
        <div className="space-y-2">
          {[
            { tag: '#AIViệtNam',   count: 234 },
            { tag: '#Blockchain',  count: 189 },
            { tag: '#GiáoDục',     count: 156 },
            { tag: '#KiểmChứng',   count: 143 },
            { tag: '#KhoaHọc',     count: 98 },
          ].map(t => (
            <div key={t.tag} className="flex items-center justify-between text-sm">
              <span className="text-gold/70 hover:text-gold cursor-pointer transition-colors">{t.tag}</span>
              <span className="text-white/25 font-mono text-xs">{t.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Roadmap */}
      <div className="card p-5">
        <h3 className="text-xs font-mono font-medium text-white/60 uppercase tracking-wide mb-3">
          Roadmap
        </h3>
        <div className="space-y-3">
          {[
            { phase: 'Phase 1', label: 'Education + Truth', status: 'active',  icon: '✓' },
            { phase: 'Phase 2', label: 'Social + Community', status: 'planned', icon: '◉' },
            { phase: 'Phase 3', label: 'Blockchain + Web3',  status: 'future',  icon: '⬡' },
          ].map(p => (
            <div key={p.phase} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${p.status === 'active' ? 'bg-jade text-white' :
                  p.status === 'planned' ? 'bg-gold/20 text-gold' :
                  'bg-obsidian-muted text-white/25'}`}>
                {p.icon}
              </div>
              <div>
                <div className="text-xs font-mono text-white/50">{p.phase}</div>
                <div className={`text-xs ${p.status === 'active' ? 'text-white/80' : 'text-white/35'}`}>
                  {p.label}
                </div>
              </div>
              {p.status === 'active' && (
                <div className="ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

// ── Main Feed Page ───────────────────────────────────────────────
export function FeedPage() {
  const [tab, setTab]       = useState<FeedTab>('hot')
  const [posts, setPosts]   = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor]   = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = useCallback(async (reset = false) => {
    setLoading(true)
    try {
      const res = await api.posts.list({ tab, limit: 10, cursor: reset ? undefined : cursor ?? undefined }) as {
        ok: boolean; posts: Post[]; cursor: string | null
      }
      if (res.ok) {
        setPosts(p => reset ? res.posts : [...p, ...res.posts])
        setCursor(res.cursor)
        setHasMore(!!res.cursor && res.posts.length === 10)
      }
    } catch {
      // API not ready yet — show empty state
    } finally {
      setLoading(false)
    }
  }, [tab, cursor])

  useEffect(() => {
    setPosts([])
    setCursor(null)
    setHasMore(true)
    loadPosts(true)
  }, [tab]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HeroBanner />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Main Feed ─── */}
        <div className="min-w-0 space-y-4">

          {/* Create Post */}
          <CreatePost onCreated={() => loadPosts(true)} />

          {/* Tab Navigation */}
          <div className="tab-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={tab === t.id ? 'active' : ''}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
            </div>
          ) : posts.length === 0 ? (
            <EmptyFeed tab={tab} />
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
              {hasMore && (
                <button
                  onClick={() => loadPosts(false)}
                  disabled={loading}
                  className="w-full btn btn-outline py-3"
                >
                  {loading ? 'Đang tải…' : 'Xem thêm'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ─── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <SidebarStats />
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyFeed({ tab }: { tab: FeedTab }) {
  const messages: Record<FeedTab, { title: string; desc: string }> = {
    hot:      { title: 'Chưa có bài viết',           desc: 'Hãy là người đầu tiên chia sẻ!' },
    verified: { title: 'Chưa có bài đã kiểm chứng',  desc: 'Các bài viết được AI xác nhận sẽ xuất hiện ở đây.' },
    lesson:   { title: 'Chưa có bài học',             desc: 'Tạo bài học AI đầu tiên!' },
    debate:   { title: 'Chưa có tranh luận',          desc: 'Bắt đầu một cuộc tranh luận với bằng chứng!' },
    chain:    { title: 'Chưa có nội dung On-Chain',   desc: 'Phase 3 — IPFS + Blockchain sắp ra mắt!' },
  }
  const m = messages[tab]

  return (
    <div className="card p-12 text-center">
      <div className="text-4xl mb-4">◈</div>
      <h3 className="font-serif text-lg text-white/60 mb-2">{m.title}</h3>
      <p className="text-sm text-white/35">{m.desc}</p>
    </div>
  )
}

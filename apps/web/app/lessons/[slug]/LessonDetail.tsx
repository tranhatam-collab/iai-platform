// ═══════════════════════════════════════════════════════════════
//  IAI Lesson Detail — Full lesson reader
// ═══════════════════════════════════════════════════════════════

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { api } from '@/lib/api'
import { cn, timeAgo, formatCount, getLevelLabel, getLevelColor, getFactScoreBg, safeJsonParse } from '@/lib/utils'
import { FactBadge } from '@/components/ai/FactBadge'
import type { Lesson } from '@/types'

type Props = { slug: string }

export function LessonDetail({ slug }: Props) {
  const [lesson, setLesson]   = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.lessons.get(slug) as { ok: boolean; lesson?: Lesson; error?: string }
        if (!res.ok || !res.lesson) { setError(res.error ?? 'Không tìm thấy bài học'); return }
        setLesson(res.lesson)
      } catch {
        setError('Không thể tải bài học.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return <LessonDetailSkeleton />
  if (error || !lesson) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-4xl mb-4">✕</div>
      <h2 className="font-serif text-xl text-white/60 mb-4">{error || 'Bài học không tồn tại'}</h2>
      <Link href="/lessons" className="btn btn-outline">← Quay lại kho bài học</Link>
    </div>
  )

  const sources  = safeJsonParse<{ url: string; title: string }[]>(lesson.sources ?? null, [])
  const concepts = safeJsonParse<string[]>(lesson.key_concepts ?? null, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

        {/* ── Main Content ─── */}
        <article>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 font-mono mb-6">
            <Link href="/" className="hover:text-white/60 transition-colors">IAI</Link>
            <span>/</span>
            <Link href="/lessons" className="hover:text-white/60 transition-colors">Bài học</Link>
            <span>/</span>
            <span className="text-white/50 truncate">{lesson.title}</span>
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={cn('badge badge-gold', getLevelColor(lesson.level))}>
                {getLevelLabel(lesson.level)}
              </span>
              {lesson.subject && (
                <span className="badge badge-cyan">{lesson.subject}</span>
              )}
              {lesson.ai_generated === 1 && (
                <span className="badge bg-gold/10 text-gold/70 border border-gold/20">✦ AI Tạo</span>
              )}
              <FactBadge
                status={lesson.fact_verified ? 'verified' : 'unverified'}
                score={lesson.fact_score ?? undefined}
                size="sm"
              />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-white mb-4 leading-tight">
              {lesson.title}
            </h1>

            {lesson.summary && (
              <p className="text-base text-white/55 leading-relaxed border-l-4 border-gold/30 pl-4 mb-4">
                {lesson.summary}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/35 font-mono">
              {lesson.handle && (
                <Link href={`/u/${lesson.handle}`} className="hover:text-gold transition-colors">
                  @{lesson.handle}
                </Link>
              )}
              {lesson.published_at && <span>{timeAgo(lesson.published_at)}</span>}
              <span>⏱ {lesson.estimated_minutes} phút đọc</span>
              <span>👁 {formatCount(lesson.view_count)}</span>
              <span>♥ {formatCount(lesson.like_count)}</span>
            </div>
          </header>

          {/* ── Fact Verified Banner ─── */}
          {lesson.fact_verified === 1 && lesson.fact_score !== undefined && (
            <div className="mb-6 p-4 rounded-xl border border-jade/20 bg-jade/5 flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center font-bold font-mono text-sm text-white shrink-0',
                getFactScoreBg(lesson.fact_score)
              )}>
                {lesson.fact_score}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-jade text-sm font-semibold">✓ Đã Kiểm Chứng bởi IAI Verify Bot</span>
                </div>
                <p className="text-xs text-white/45">
                  Bài học này đã được Claude AI phân tích và đạt điểm sự thật {lesson.fact_score}/100.
                  Nguồn dẫn được liệt kê bên dưới.
                </p>
              </div>
            </div>
          )}

          {/* ── IPFS Badge ─── */}
          {lesson.ipfs_cid && (
            <div className="mb-6 flex items-center gap-2 text-xs font-mono text-white/25">
              <span className="text-cyan-iai">⬡</span>
              <span>LƯU TRÊN IPFS:</span>
              <code className="text-white/15 text-[10px]">{lesson.ipfs_cid}</code>
            </div>
          )}

          {/* ── Markdown Content ─── */}
          <div className="prose-iai">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lesson.content_md}
            </ReactMarkdown>
          </div>

          {/* ── Sources ─── */}
          {sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-obsidian-border">
              <h3 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-3">
                Nguồn tham khảo
              </h3>
              <ol className="space-y-2">
                {sources.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-gold/50 font-mono text-xs mt-0.5">{i + 1}.</span>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-iai/70 hover:text-cyan-iai transition-colors underline underline-offset-2"
                    >
                      {s.title || s.url}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>

        {/* ── Sidebar ─── */}
        <aside className="space-y-4">
          <div className="sticky top-24 space-y-4">

            {/* Key Concepts */}
            {concepts.length > 0 && (
              <div className="card p-5">
                <h3 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-3">
                  Khái niệm chính
                </h3>
                <div className="flex flex-wrap gap-2">
                  {concepts.map(c => (
                    <span key={c} className="badge badge-gold text-xs">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Share / Actions */}
            <div className="card p-5 space-y-2">
              <h3 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-3">
                Hành động
              </h3>
              <button className="btn btn-outline btn-sm w-full justify-center">
                ♥ Thích bài học
              </button>
              <button className="btn btn-outline btn-sm w-full justify-center">
                ↗ Chia sẻ
              </button>
              {lesson.ipfs_cid && (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${lesson.ipfs_cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm w-full justify-center text-cyan-iai/70 hover:text-cyan-iai"
                >
                  ⬡ Xem trên IPFS
                </a>
              )}
            </div>

            {/* Navigation */}
            <div className="card p-4">
              <Link href="/lessons" className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
                <span>←</span> Kho bài học
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function LessonDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl space-y-4">
        <div className="flex gap-2 mb-6">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-5 w-20 rounded-full" />)}
        </div>
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-8 w-1/2 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="mt-8 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`skeleton h-3 rounded ${i % 4 === 3 ? 'w-3/4' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
//  IAI LessonCard — Lesson listing card
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { cn, timeAgo, formatCount, getLevelLabel, getLevelColor, getFactScoreBg, safeJsonParse } from '@/lib/utils'
import type { Lesson } from '@/types'

type Props = { lesson: Lesson }

export function LessonCard({ lesson }: Props) {
  const concepts = safeJsonParse<string[]>(lesson.key_concepts ?? null, [])
  const isAI = lesson.ai_generated === 1

  return (
    <article className="card-hover group p-5 flex flex-col gap-4">
      {/* ── Header ─── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Subject Icon */}
          <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center">
            <span className="text-gold text-sm">✦</span>
          </div>
          <div className="min-w-0">
            <Link href={`/lessons/${lesson.slug}`}>
              <h3 className="font-serif text-base text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
                {lesson.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1 text-xs text-white/35 font-mono">
              {lesson.handle && <span>@{lesson.handle}</span>}
              {lesson.published_at && (
                <>
                  <span>·</span>
                  <span>{timeAgo(lesson.published_at)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Fact Score */}
        {lesson.fact_score !== undefined && (
          <div className={cn(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm text-white',
            getFactScoreBg(lesson.fact_score)
          )}>
            {lesson.fact_score}
          </div>
        )}
      </div>

      {/* ── Summary ─── */}
      {lesson.summary && (
        <p className="text-sm text-white/55 leading-relaxed line-clamp-2">
          {lesson.summary}
        </p>
      )}

      {/* ── Tags ─── */}
      <div className="flex flex-wrap gap-1.5">
        {/* Level */}
        <span className={cn('badge badge-gold text-xs', getLevelColor(lesson.level))}>
          {getLevelLabel(lesson.level)}
        </span>

        {/* Subject */}
        {lesson.subject && (
          <span className="badge badge-cyan text-xs">{lesson.subject}</span>
        )}

        {/* AI Generated */}
        {isAI && (
          <span className="badge bg-gold/10 text-gold/70 border border-gold/20 text-xs">
            ✦ AI Tạo
          </span>
        )}

        {/* Concepts */}
        {concepts.slice(0, 3).map(c => (
          <span key={c} className="badge badge-unverified text-xs">{c}</span>
        ))}
      </div>

      {/* ── Footer ─── */}
      <div className="flex items-center justify-between pt-3 border-t border-obsidian-border mt-auto">
        <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
          <span>⏱ {lesson.estimated_minutes} phút</span>
          <span>·</span>
          <span>👁 {formatCount(lesson.view_count)}</span>
          <span>·</span>
          <span>♥ {formatCount(lesson.like_count)}</span>
        </div>

        <Link
          href={`/lessons/${lesson.slug}`}
          className="flex items-center gap-1 text-xs text-gold/70 hover:text-gold transition-colors font-medium"
        >
          Đọc bài <span>→</span>
        </Link>
      </div>
    </article>
  )
}

// ═══════════════════════════════════════════════════════════════
//  IAI PostCard — Social Feed Card
// ═══════════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn, timeAgo, formatCount, getTrustColor, safeJsonParse } from '@/lib/utils'
import { FactBadge, FactBadgeInline } from '@/components/ai/FactBadge'
import type { Post } from '@/types'

const POST_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  discussion: { label: 'THẢO LUẬN',  color: 'text-white/40' },
  lesson:     { label: 'BÀI HỌC',    color: 'text-gold' },
  news:       { label: 'TIN TỨC',    color: 'text-cyan-iai' },
  debate:     { label: 'TRANH LUẬN', color: 'text-amber-400' },
  knowledge:  { label: 'KIẾN THỨC',  color: 'text-jade' },
}

type Props = {
  post:       Post
  onLike?:    (id: string) => void
  showFull?:  boolean
}

export function PostCard({ post, onLike, showFull = false }: Props) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.like_count)

  const typeInfo = POST_TYPE_LABELS[post.type] ?? { label: post.type.toUpperCase(), color: 'text-white/40' }
  const hasClaims = post.fact_summary && post.fact_score !== undefined

  function handleLike() {
    if (liked) return
    setLiked(true)
    setLikes(l => l + 1)
    onLike?.(post.id)
  }

  return (
    <article className="card-hover group p-0 overflow-hidden animate-in">
      {/* ── Fact Status Accent Bar ─── */}
      <div className={cn(
        'h-0.5 w-full',
        post.fact_status === 'verified'   ? 'bg-jade' :
        post.fact_status === 'disputed'   ? 'bg-amber-500' :
        post.fact_status === 'false'      ? 'bg-red-500' :
        post.fact_status === 'checking'   ? 'bg-cyan-iai animate-pulse' :
        'bg-obsidian-border'
      )} />

      <div className="p-5">
        {/* ── Header: User + Type + Time ─── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-obsidian font-bold text-sm">
              {post.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/u/${post.handle}`}
                  className="text-sm font-semibold text-white hover:text-gold transition-colors truncate"
                >
                  {post.name}
                </Link>
                {/* Trust Score */}
                <span className={cn('text-xs font-mono shrink-0', getTrustColor(post.trust_score))}>
                  T{post.trust_score}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/35 font-mono">
                <span>@{post.handle}</span>
                <span>·</span>
                <span>{timeAgo(post.created_at)}</span>
                <span>·</span>
                <span className={typeInfo.color}>{typeInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Fact Badge */}
          <div className="shrink-0">
            <FactBadgeInline status={post.fact_status} score={post.fact_score ?? undefined} />
          </div>
        </div>

        {/* ── Content ─── */}
        <div className={cn(
          'text-white/80 text-sm leading-relaxed mb-4',
          !showFull && 'line-clamp-4'
        )}>
          {post.content}
        </div>

        {/* ── Fact Check Result Panel ─── */}
        {hasClaims && (
          <div className={cn(
            'mb-4 p-4 rounded-xl border text-sm',
            post.fact_status === 'verified' ? 'bg-jade/5 border-jade/20' :
            post.fact_status === 'disputed' ? 'bg-amber-500/5 border-amber-500/20' :
            'bg-red-500/5 border-red-500/20'
          )}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="text-obsidian text-[8px] font-bold">AI</span>
              </div>
              <span className="text-xs font-mono text-white/50">IAI Verify Bot ·</span>
              <FactBadge status={post.fact_status} score={post.fact_score ?? undefined} size="sm" showScore={false} />
            </div>
            <p className="text-white/60 text-xs leading-relaxed">{post.fact_summary}</p>
          </div>
        )}

        {/* ── Blockchain Badge ─── */}
        {(post.ipfs_cid || post.chain_tx_hash) && (
          <div className="flex items-center gap-2 mb-4 text-xs font-mono text-white/25">
            <span className="text-cyan-iai">⬡</span>
            <span>ĐÃ LƯU TRÊN CHAIN</span>
            {post.content_hash && (
              <span className="text-white/15">#{post.content_hash.slice(0, 8)}</span>
            )}
          </div>
        )}

        {/* ── Media ─── */}
        {post.media_urls && (() => {
          const urls = safeJsonParse<string[]>(post.media_urls, [])
          return urls.length > 0 ? (
            <div className={cn(
              'mb-4 grid gap-2 rounded-xl overflow-hidden',
              urls.length === 1 ? 'grid-cols-1' :
              urls.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            )}>
              {urls.slice(0, 3).map((url, i) => (
                <div key={i} className="aspect-video bg-obsidian-light rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : null
        })()}

        {/* ── Actions ─── */}
        <div className="flex items-center justify-between pt-3 border-t border-obsidian-border">
          <div className="flex items-center gap-1">

            {/* Like */}
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                liked
                  ? 'text-gold bg-gold/10'
                  : 'text-white/40 hover:text-white hover:bg-obsidian-light'
              )}
            >
              <svg className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{formatCount(likes)}</span>
            </button>

            {/* Comment */}
            <Link
              href={`/post/${post.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-white hover:bg-obsidian-light transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{formatCount(post.comment_count)}</span>
            </Link>

            {/* View */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white/25">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{formatCount(post.view_count)}</span>
            </span>
          </div>

          {/* Verify Button */}
          <Link
            href={`/verify?postId=${post.id}&content=${encodeURIComponent(post.content.slice(0,200))}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/35 hover:text-gold hover:bg-gold/5 transition-all border border-transparent hover:border-gold/20"
          >
            <span>◎</span>
            <span>Kiểm chứng</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

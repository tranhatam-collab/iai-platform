// ═══════════════════════════════════════════════════════════════
//  IAI DocumentCard — Document listing card
// ═══════════════════════════════════════════════════════════════

'use client'

import Image from 'next/image'
import { cn, formatCount } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { PriceTag } from '@/components/ui/PriceTag'
import type { Document, FileType } from '@/types/marketplace'

type Props = {
  document:   Document
  purchased?: boolean
  onBuy?:     (doc: Document) => void
}

const FILE_ICONS: Record<FileType, { icon: string; label: string; color: string }> = {
  pdf:   { icon: '📄', label: 'PDF',   color: 'text-red-400' },
  video: { icon: '📹', label: 'Video', color: 'text-blue-400' },
  audio: { icon: '🎵', label: 'Audio', color: 'text-purple-400' },
  zip:   { icon: '📦', label: 'ZIP',   color: 'text-amber-400' },
  epub:  { icon: '📖', label: 'EPUB',  color: 'text-jade' },
  doc:   { icon: '📝', label: 'DOC',   color: 'text-blue-300' },
  ppt:   { icon: '📊', label: 'PPT',   color: 'text-orange-400' },
  other: { icon: '📁', label: 'File',  color: 'text-white/50' },
}

function formatFileSize(kb: number): string {
  if (kb < 1024)      return `${kb} KB`
  if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${(kb / (1024 * 1024)).toFixed(1)} GB`
}

export function DocumentCard({ document: doc, purchased = false, onBuy }: Props) {
  const fileInfo = FILE_ICONS[doc.file_type] ?? FILE_ICONS.other

  function handleAction(e: React.MouseEvent) {
    e.preventDefault()
    if (purchased) {
      window.open(doc.file_url, '_blank', 'noopener,noreferrer')
    } else if (doc.price === 0) {
      window.open(doc.file_url, '_blank', 'noopener,noreferrer')
    } else {
      onBuy?.(doc)
    }
  }

  return (
    <article className={cn(
      'card-hover flex flex-col gap-4 p-4',
      'transition-all duration-300',
      'hover:shadow-gold hover:[border-color:rgba(201,168,76,0.35)]'
    )}>
      {/* ── Header ─── */}
      <div className="flex items-start gap-3">

        {/* File type icon / thumbnail */}
        <div className={cn(
          'w-12 h-12 shrink-0 rounded-xl',
          'bg-obsidian-light border border-obsidian-border',
          'flex items-center justify-center text-xl',
          'overflow-hidden relative'
        )}>
          {doc.thumbnail_url ? (
            <Image
              src={doc.thumbnail_url}
              alt={doc.title}
              fill
              sizes="48px"
              className="object-cover rounded-xl"
            />
          ) : (
            <span role="img" aria-label={fileInfo.label}>{fileInfo.icon}</span>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={cn('badge badge-unverified text-[10px]', fileInfo.color)}>
              {fileInfo.icon} {fileInfo.label}
            </span>
            {doc.fact_verified === 1 && (
              <span className="badge-verified text-[10px]">✓ Kiểm chứng</span>
            )}
          </div>

          <h3 className="font-serif text-sm text-white leading-snug line-clamp-2 group-hover:text-gold transition-colors">
            {doc.title}
          </h3>
        </div>
      </div>

      {/* ── Description ─── */}
      <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
        {doc.description}
      </p>

      {/* ── Creator ─── */}
      <div className="flex items-center gap-2">
        {doc.avatar_url ? (
          <Image
            src={doc.avatar_url}
            alt={doc.name}
            width={18}
            height={18}
            className="rounded-full shrink-0"
          />
        ) : (
          <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
            <span className="text-gold text-[9px] font-bold">
              {doc.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-xs text-white/40 font-mono truncate">
          @{doc.handle}
        </span>
        <span className="ml-auto text-[10px] text-white/25 font-mono shrink-0">
          {formatFileSize(doc.file_size_kb)}
        </span>
      </div>

      {/* ── Stats ─── */}
      <div className="flex items-center justify-between gap-3">
        <StarRating rating={doc.rating_avg} count={doc.rating_count} size="sm" />
        <span className="text-[10px] text-white/30 font-mono shrink-0">
          ↓ {formatCount(doc.download_count)} tải
        </span>
      </div>

      {/* ── Divider ─── */}
      <div className="border-t border-obsidian-border" />

      {/* ── Footer: price + action ─── */}
      <div className="flex items-center justify-between gap-3">
        <PriceTag price={doc.price} currency={doc.currency} size="md" />

        <button
          onClick={handleAction}
          className={cn(
            'btn btn-sm shrink-0 transition-all',
            purchased
              ? 'btn-outline border-jade/40 text-jade hover:border-jade hover:text-jade'
              : doc.price === 0
                ? 'bg-jade/10 text-jade border border-jade/30 hover:bg-jade/20 btn'
                : 'btn-gold'
          )}
        >
          {purchased
            ? '↓ Tải lại'
            : doc.price === 0
              ? '↓ Tải miễn phí'
              : 'Mua ngay'}
        </button>
      </div>

      {/* Purchased badge */}
      {purchased && (
        <div className="absolute top-2 right-2">
          <span className="badge bg-jade/90 text-white border-jade/50 text-[10px]">
            ✓ Đã tải
          </span>
        </div>
      )}
    </article>
  )
}

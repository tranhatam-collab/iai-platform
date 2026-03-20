// ═══════════════════════════════════════════════════════════════
//  IAI CourseCard — Course listing card
// ═══════════════════════════════════════════════════════════════

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn, formatCount, getLevelLabel, getLevelColor } from '@/lib/utils'
import { StarRating } from '@/components/ui/StarRating'
import { PriceTag } from '@/components/ui/PriceTag'
import type { Course } from '@/types/marketplace'
import { CATEGORIES } from '@/types/marketplace'

type Props = {
  course:     Course
  purchased?: boolean
  compact?:   boolean
}

export function CourseCard({ course, purchased = false, compact = false }: Props) {
  const categoryConfig = CATEGORIES.find(c => c.id === course.category)
  const levelColor = getLevelColor(course.level)

  return (
    <Link href={`/courses/${course.slug}`} className="group block">
      <article
        className={cn(
          'card-hover relative overflow-hidden flex flex-col',
          'transition-all duration-300',
          'hover:shadow-gold hover:[border-color:rgba(201,168,76,0.35)]',
          compact ? 'p-3' : 'p-0'
        )}
      >
        {/* ── Thumbnail ─── */}
        {!compact && (
          <div className="relative w-full aspect-video bg-obsidian-light overflow-hidden">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-obsidian-light to-obsidian-mid">
                <span className="text-4xl text-gold/20 font-serif select-none">✦</span>
              </div>
            )}

            {/* Category badge overlay */}
            {categoryConfig && (
              <div className="absolute top-2 left-2">
                <span className={cn(
                  'badge bg-obsidian/80 backdrop-blur-sm border-obsidian-border',
                  categoryConfig.color
                )}>
                  <span>{categoryConfig.icon}</span>
                  {categoryConfig.label}
                </span>
              </div>
            )}

            {/* Purchased overlay */}
            {purchased && (
              <div className="absolute inset-0 bg-jade/20 backdrop-blur-[2px] flex items-center justify-center">
                <span className="badge bg-jade text-white border-jade font-semibold text-sm px-4 py-1.5">
                  ✓ Đã mua
                </span>
              </div>
            )}

            {/* Free preview indicator */}
            {course.price === 0 && !purchased && (
              <div className="absolute top-2 right-2">
                <span className="badge bg-jade/90 text-white border-jade/50 backdrop-blur-sm">
                  Miễn phí
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Content ─── */}
        <div className={cn('flex flex-col gap-3', compact ? '' : 'p-4')}>

          {/* Category + Level (compact mode only) */}
          {compact && (
            <div className="flex items-center gap-2">
              {categoryConfig && (
                <span className={cn('badge badge-gold text-[10px]', categoryConfig.color)}>
                  {categoryConfig.icon} {categoryConfig.label}
                </span>
              )}
              <span className={cn('badge badge-unverified text-[10px]', levelColor)}>
                {getLevelLabel(course.level)}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className={cn(
            'font-serif text-white leading-snug',
            'group-hover:text-gold transition-colors duration-200',
            'line-clamp-2',
            compact ? 'text-sm' : 'text-base'
          )}>
            {course.title}
          </h3>

          {/* Creator */}
          <div className="flex items-center gap-2">
            {course.avatar_url ? (
              <Image
                src={course.avatar_url}
                alt={course.name}
                width={20}
                height={20}
                className="rounded-full shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <span className="text-gold text-[10px] font-bold">
                  {course.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-white/45 font-mono truncate">
              @{course.handle}
            </span>
            {course.fact_verified === 1 && (
              <span className="badge-verified text-[10px] ml-auto shrink-0">✓ Đã kiểm chứng</span>
            )}
          </div>

          {/* Level badge (non-compact only) */}
          {!compact && (
            <div className="flex items-center gap-2">
              <span className={cn('badge badge-unverified text-[10px]', levelColor)}>
                {getLevelLabel(course.level)}
              </span>
              <span className="badge badge-unverified text-[10px]">
                {course.chapters_count} chương
              </span>
              <span className="badge badge-unverified text-[10px]">
                {course.total_minutes} phút
              </span>
            </div>
          )}

          {/* Rating + Students */}
          <div className="flex items-center justify-between gap-2">
            <StarRating
              rating={course.rating_avg}
              count={course.rating_count}
              size="sm"
            />
            <span className="text-xs text-white/35 font-mono shrink-0">
              {formatCount(course.student_count)} học viên
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-obsidian-border" />

          {/* Price + AI Score */}
          <div className="flex items-center justify-between gap-2">
            <PriceTag
              price={course.price}
              currency={course.currency}
              size={compact ? 'sm' : 'md'}
            />
            {course.ai_quality_score !== undefined && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                <span className="text-gold/50">✦ AI</span>
                {course.ai_quality_score}/100
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

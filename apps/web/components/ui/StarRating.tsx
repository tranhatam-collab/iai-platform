// ═══════════════════════════════════════════════════════════════
//  IAI StarRating — Reusable star rating component
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  rating:      number
  count?:      number
  size?:       'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?:   (r: number) => void
  className?:  string
}

const SIZE_MAP = {
  sm: { star: 12, text: 'text-xs', gap: 'gap-0.5' },
  md: { star: 16, text: 'text-sm', gap: 'gap-1'   },
  lg: { star: 20, text: 'text-base', gap: 'gap-1.5' },
}

function StarIcon({
  fill,
  size,
}: {
  fill: 'full' | 'half' | 'empty'
  size: number
}) {
  if (fill === 'full') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
          fill="#C9A84C"
          stroke="#C9A84C"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (fill === 'half') {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="half-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
          fill="url(#half-grad)"
          stroke="#C9A84C"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27l-4.94 2.43.94-5.49-4-3.9 5.53-.8z"
        fill="transparent"
        stroke="#2E2E3A"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function getStarFill(starIndex: number, rating: number): 'full' | 'half' | 'empty' {
  if (rating >= starIndex) return 'full'
  if (rating >= starIndex - 0.5) return 'half'
  return 'empty'
}

export function StarRating({ rating, count, size = 'md', interactive = false, onChange, className }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const displayRating = hovered ?? rating
  const { star: starSize, text: textSize, gap } = SIZE_MAP[size]

  function handleClick(star: number) {
    if (interactive && onChange) onChange(star)
  }

  function formatCount(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return String(n)
  }

  return (
    <div className={cn('flex items-center', gap, className)}>
      {/* Stars */}
      <div
        className={cn('flex items-center', gap, interactive && 'cursor-pointer')}
        onMouseLeave={() => interactive && setHovered(null)}
        aria-label={`Đánh giá ${displayRating} trên 5 sao`}
      >
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            className={cn(
              'transition-transform duration-100',
              interactive
                ? 'cursor-pointer hover:scale-110 focus-visible:scale-110'
                : 'cursor-default',
              'focus:outline-none'
            )}
            tabIndex={interactive ? 0 : -1}
            aria-label={interactive ? `${star} sao` : undefined}
          >
            <StarIcon
              fill={
                interactive && hovered !== null
                  ? star <= hovered ? 'full' : 'empty'
                  : getStarFill(star, displayRating)
              }
              size={starSize}
            />
          </button>
        ))}
      </div>

      {/* Numeric rating */}
      <span className={cn('font-mono font-semibold text-gold', textSize)}>
        {displayRating.toFixed(1)}
      </span>

      {/* Count */}
      {count !== undefined && count > 0 && (
        <span className={cn('text-white/35 font-mono', textSize)}>
          ({formatCount(count)})
        </span>
      )}
    </div>
  )
}

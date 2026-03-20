// ═══════════════════════════════════════════════════════════════
//  IAI PriceTag — Price display component
// ═══════════════════════════════════════════════════════════════

'use client'

import { cn } from '@/lib/utils'

type Props = {
  price:     number
  currency?: string
  size?:     'sm' | 'md' | 'lg'
  showFree?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export function formatVND(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price)
}

export function PriceTag({ price, currency = 'VND', size = 'md', showFree = true, className }: Props) {
  const sizeClass = SIZE_MAP[size]

  if (price === 0) {
    if (!showFree) return null
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-mono font-semibold',
          'text-jade-light',
          sizeClass,
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-jade-light inline-block animate-pulse" />
        Miễn phí
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-0.5 font-mono font-bold',
        'text-gold',
        '[text-shadow:0_0_12px_rgba(201,168,76,0.4)]',
        sizeClass,
        className
      )}
    >
      <span className={cn('text-gold-light', size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base')}>
        ₫
      </span>
      {formatVND(price)}
    </span>
  )
}

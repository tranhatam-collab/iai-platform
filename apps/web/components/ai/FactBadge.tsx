// ═══════════════════════════════════════════════════════════════
//  IAI FactBadge — Compact fact-check status indicator
// ═══════════════════════════════════════════════════════════════

import { cn, getFactBadgeClass, getFactStatusLabel, getFactScoreBg } from '@/lib/utils'
import type { FactStatus } from '@/types'

type Props = {
  status:  FactStatus
  score?:  number
  size?:   'sm' | 'md' | 'lg'
  showScore?: boolean
}

export function FactBadge({ status, score, size = 'md', showScore = true }: Props) {
  const icons: Record<FactStatus, string> = {
    verified:   '✓',
    disputed:   '!',
    unverified: '?',
    opinion:    '💬',
    false:      '✗',
    checking:   '⟳',
  }

  const sizeClasses = {
    sm:  'text-[10px] px-1.5 py-0.5 gap-0.5',
    md:  'text-xs px-2 py-1 gap-1',
    lg:  'text-sm px-3 py-1.5 gap-1.5',
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('badge font-mono', getFactBadgeClass(status), sizeClasses[size])}>
        <span>{icons[status]}</span>
        <span>{getFactStatusLabel(status)}</span>
      </span>

      {showScore && score !== undefined && (
        <span className={cn(
          'inline-flex items-center justify-center rounded-full font-bold font-mono text-white',
          getFactScoreBg(score),
          size === 'sm' ? 'w-5 h-5 text-[9px]' :
          size === 'lg' ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-[10px]'
        )}>
          {score}
        </span>
      )}
    </div>
  )
}

// ── Inline Compact Version ───────────────────────────────────────
export function FactBadgeInline({ status, score }: { status: FactStatus; score?: number }) {
  const color: Record<FactStatus, string> = {
    verified:   'text-jade',
    disputed:   'text-amber-400',
    unverified: 'text-white/30',
    opinion:    'text-purple-400',
    false:      'text-red-400',
    checking:   'text-cyan-iai animate-pulse',
  }
  const icon: Record<FactStatus, string> = {
    verified: '✓', disputed: '!', unverified: '?',
    opinion: '💬', false: '✗', checking: '⟳',
  }

  return (
    <span className={cn('inline-flex items-center gap-1 font-mono text-xs', color[status])}>
      <span>{icon[status]}</span>
      {score !== undefined && <span className="font-bold">{score}/100</span>}
    </span>
  )
}

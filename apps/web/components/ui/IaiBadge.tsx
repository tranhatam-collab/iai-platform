'use client'

/* ═══════════════════════════════════════════════════════════════
   IAI Badge Component — Hexagonal badge with tier glow & tooltip
   ═══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { BADGE_MAP, TIER_CONFIG, PILLAR_CONFIG } from '@/lib/badges'
import type { BadgeDefinition, BadgeTier, EarnedBadge } from '@/types/badges'

// ── Hex SVG clip path ────────────────────────────────────────────
const HEX_CLIP_ID = 'iai-hex-clip'

function HexShape({ size }: { size: number }) {
  // Regular hexagon points (flat-top orientation)
  const r = size / 2
  const cx = r
  const cy = r
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
  return <polygon points={points} />
}

// ── Tier ring glow animation ─────────────────────────────────────
function TierGlow({ tier, size, animated }: { tier: BadgeTier; size: number; animated?: boolean }) {
  const cfg = TIER_CONFIG[tier]
  const r = size / 2
  const cx = r
  const cy = r
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    const pr = r - 2
    return `${cx + pr * Math.cos(angle)},${cy + pr * Math.sin(angle)}`
  }).join(' ')

  return (
    <polygon
      points={points}
      fill="none"
      stroke={cfg.border}
      strokeWidth={tier === 'obsidian' ? 2.5 : tier === 'platinum' ? 2 : 1.5}
      style={{
        filter: animated ? `drop-shadow(0 0 6px ${cfg.glow})` : undefined,
        animation: animated && tier === 'obsidian'
          ? 'iai-badge-pulse 2s ease-in-out infinite'
          : animated && tier === 'platinum'
          ? 'iai-badge-shimmer 3s linear infinite'
          : undefined,
      }}
    />
  )
}

// ── Size map ─────────────────────────────────────────────────────
const SIZE_MAP = { xs: 28, sm: 36, md: 48, lg: 64, xl: 88 } as const
type BadgeSize = keyof typeof SIZE_MAP

// ── Main Badge Component ─────────────────────────────────────────
interface IaiBadgeProps {
  badgeId: string
  earned?: EarnedBadge
  size?: BadgeSize
  showTooltip?: boolean
  locked?: boolean       // greyed out / not yet earned
  className?: string
}

export function IaiBadge({
  badgeId,
  earned,
  size = 'md',
  showTooltip = true,
  locked = false,
  className = '',
}: IaiBadgeProps) {
  const [hover, setHover] = useState(false)
  const badge = BADGE_MAP[badgeId]
  if (!badge) return null

  const px = SIZE_MAP[size]
  const tierCfg = TIER_CONFIG[badge.tier]
  const pillarCfg = PILLAR_CONFIG[badge.pillar]
  const iconSize = px * 0.38

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: px, height: px }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={badge.name}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        style={{
          filter: locked
            ? 'grayscale(1) opacity(0.3)'
            : badge.animated
            ? `drop-shadow(0 0 8px ${tierCfg.glow})`
            : `drop-shadow(0 0 4px ${tierCfg.glow})`,
          transition: 'filter 0.3s ease',
          cursor: showTooltip ? 'pointer' : 'default',
        }}
      >
        {/* Background hex */}
        <clipPath id={`${HEX_CLIP_ID}-${badgeId}-${size}`}>
          <HexShape size={px} />
        </clipPath>
        <g clipPath={`url(#${HEX_CLIP_ID}-${badgeId}-${size})`}>
          {/* Background fill */}
          <rect
            width={px}
            height={px}
            fill={locked ? '#1A1A20' : tierCfg.bg}
          />
          {/* Subtle pillar color wash at top */}
          {!locked && (
            <rect
              width={px}
              height={px / 2}
              fill={`${pillarCfg.color}08`}
            />
          )}
        </g>
        {/* Border ring */}
        <TierGlow tier={badge.tier} size={px} animated={!locked && badge.animated} />
        {/* Icon */}
        <text
          x={px / 2}
          y={px / 2 + iconSize * 0.35}
          textAnchor="middle"
          fontSize={iconSize}
          style={{ userSelect: 'none' }}
        >
          {badge.icon}
        </text>
        {/* Obsidian: extra inner sparkle dots */}
        {badge.tier === 'obsidian' && !locked && (
          <>
            <circle cx={px * 0.2} cy={px * 0.25} r={1.2} fill={tierCfg.color} opacity={0.6} />
            <circle cx={px * 0.8} cy={px * 0.25} r={1.2} fill={tierCfg.color} opacity={0.6} />
            <circle cx={px * 0.5} cy={px * 0.88} r={1.2} fill={tierCfg.color} opacity={0.6} />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {showTooltip && hover && (
        <BadgeTooltip badge={badge} earned={earned} locked={locked} px={px} />
      )}

      {/* Keyframe styles (injected once) */}
      <style>{`
        @keyframes iai-badge-pulse {
          0%, 100% { filter: drop-shadow(0 0 6px ${TIER_CONFIG.obsidian.glow}); }
          50%       { filter: drop-shadow(0 0 14px ${TIER_CONFIG.obsidian.glow}); }
        }
        @keyframes iai-badge-shimmer {
          0%   { stroke-opacity: 0.6; }
          50%  { stroke-opacity: 1; }
          100% { stroke-opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

// ── Tooltip ──────────────────────────────────────────────────────
function BadgeTooltip({
  badge,
  earned,
  locked,
  px,
}: {
  badge: BadgeDefinition
  earned?: EarnedBadge
  locked: boolean
  px: number
}) {
  const tierCfg = TIER_CONFIG[badge.tier]
  const pillarCfg = PILLAR_CONFIG[badge.pillar]

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        bottom: `calc(100% + 10px)`,
        left: '50%',
        transform: 'translateX(-50%)',
        minWidth: 220,
        maxWidth: 280,
      }}
    >
      <div
        style={{
          background: '#0D0D0F',
          border: `1px solid ${tierCfg.border}`,
          borderRadius: 12,
          padding: '12px 14px',
          boxShadow: `0 4px 24px rgba(0,0,0,0.7), 0 0 12px ${tierCfg.glow}`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: 18 }}>{badge.icon}</span>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{badge.name}</p>
            <p className="text-xs font-mono uppercase tracking-wide" style={{ color: pillarCfg.color }}>
              {pillarCfg.label}
            </p>
          </div>
          <span
            className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full"
            style={{
              background: tierCfg.bg,
              color: tierCfg.color,
              border: `1px solid ${tierCfg.border}`,
            }}
          >
            {tierCfg.label}
          </span>
        </div>

        {/* Lore */}
        <p className="text-white/50 text-xs italic leading-snug mb-2">
          &ldquo;{badge.lore}&rdquo;
        </p>

        {/* How to earn */}
        {locked ? (
          <p className="text-white/40 text-xs leading-snug border-t border-white/5 pt-2">
            🔒 {badge.description}
          </p>
        ) : (
          <>
            <p className="text-white/60 text-xs leading-snug border-t border-white/5 pt-2">
              {badge.description}
            </p>
            {earned && (
              <p className="text-xs mt-2" style={{ color: pillarCfg.color }}>
                ✓ Earned {new Date(earned.earnedAt).toLocaleDateString('vi-VN')}
                {earned.context && ` · ${earned.context}`}
              </p>
            )}
          </>
        )}

        {/* XP */}
        {badge.xp > 0 && (
          <p className="text-xs mt-1.5 text-white/30 font-mono">
            +{badge.xp.toLocaleString()} XP
          </p>
        )}

        {/* Phase note */}
        {badge.phase && badge.phase > 1 && (
          <p className="text-xs mt-1 text-amber-400/60 font-mono">
            ⚡ Available in Phase {badge.phase}
          </p>
        )}
      </div>
      {/* Arrow */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: -6,
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${tierCfg.border}`,
        }}
      />
    </div>
  )
}

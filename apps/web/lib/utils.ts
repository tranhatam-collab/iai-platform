// ═══════════════════════════════════════════════════════════════
//  IAI Web — Utility Functions
// ═══════════════════════════════════════════════════════════════

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FactStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Fact Status ──────────────────────────────────────────────────
export function getFactStatusLabel(status: FactStatus): string {
  const labels: Record<FactStatus, string> = {
    verified:   '✓ ĐÃ KIỂM CHỨNG',
    disputed:   '! ĐANG TRANH LUẬN',
    unverified: '? CHƯA KIỂM CHỨNG',
    opinion:    '💬 QUAN ĐIỂM',
    false:      '✗ SAI THÔNG TIN',
    checking:   '⟳ ĐANG KIỂM CHỨNG',
  }
  return labels[status] ?? '? CHƯA XÁC ĐỊNH'
}

export function getFactStatusColor(status: FactStatus): string {
  const colors: Record<FactStatus, string> = {
    verified:   'text-jade font-semibold',
    disputed:   'text-amber-400 font-semibold',
    unverified: 'text-white/40',
    opinion:    'text-purple-400',
    false:      'text-red-400 font-semibold',
    checking:   'text-cyan-iai animate-pulse',
  }
  return colors[status] ?? 'text-white/40'
}

export function getFactScoreBg(score: number): string {
  if (score >= 90) return 'bg-jade'
  if (score >= 70) return 'bg-jade/70'
  if (score >= 50) return 'bg-amber-500'
  if (score >= 30) return 'bg-orange-500'
  return 'bg-red-500'
}

export function getFactBadgeClass(status: FactStatus): string {
  const classes: Record<FactStatus, string> = {
    verified:   'badge-verified',
    disputed:   'badge-disputed',
    unverified: 'badge-unverified',
    opinion:    'badge-opinion',
    false:      'badge-false',
    checking:   'badge-cyan',
  }
  return classes[status] ?? 'badge-unverified'
}

// ── Date ─────────────────────────────────────────────────────────
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now  = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60)    return 'vừa xong'
  if (diff < 3600)  return `${Math.floor(diff / 60)} phút trước`
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`
  if (diff < 604800)return `${Math.floor(diff / 86400)} ngày trước`
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// ── Numbers ──────────────────────────────────────────────────────
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

// ── String ───────────────────────────────────────────────────────
export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── JSON safe parse ──────────────────────────────────────────────
export function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) }
  catch { return fallback }
}

// ── Level Badge ──────────────────────────────────────────────────
export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    beginner:     'Cơ bản',
    intermediate: 'Trung cấp',
    advanced:     'Nâng cao',
  }
  return labels[level] ?? level
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    beginner:     'text-jade',
    intermediate: 'text-gold',
    advanced:     'text-red-400',
  }
  return colors[level] ?? 'text-white/50'
}

// ── Trust Score ──────────────────────────────────────────────────
export function getTrustColor(score: number): string {
  if (score >= 90) return 'text-jade'
  if (score >= 70) return 'text-gold'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

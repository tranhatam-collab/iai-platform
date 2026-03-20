// ═══════════════════════════════════════════════════════════════
//  IAI Navbar — Top Navigation
// ═══════════════════════════════════════════════════════════════

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/store/auth'

const NAV_LINKS = [
  { href: '/',         label: 'Feed',      icon: '◈' },
  { href: '/lessons',  label: 'Bài Học',   icon: '✦' },
  { href: '/verify',   label: 'Kiểm Chứng',icon: '◎' },
  { href: '/studio',   label: 'Studio',    icon: '⟡' },
]

export function Navbar() {
  const pathname  = usePathname()
  const { isAuth, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 border-b border-obsidian-border bg-obsidian/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">

        {/* ── Logo ─── */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-gold-sm">
            <span className="font-serif font-bold text-obsidian text-sm leading-none">I</span>
          </div>
          <span className="font-serif text-xl font-bold tracking-wide logo-iai hidden sm:block">
            <span className="i-intel">I</span>
            <span className="a-art">A</span>
            <span className="i-intl">I</span>
          </span>
          <span className="text-white/20 text-xs font-mono hidden lg:block">·  iai.one</span>
        </Link>

        {/* ── Desktop Nav ─── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname === link.href
                  ? 'bg-obsidian-light text-white'
                  : 'text-white/50 hover:text-white hover:bg-obsidian-light'
              )}
            >
              <span className="text-gold text-xs">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Right Side ─── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Verify Quick Button */}
          <Link
            href="/verify"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold/30 text-gold text-xs font-mono font-medium hover:bg-gold/10 hover:border-gold/50 transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            Kiểm Chứng AI
          </Link>

          {/* Auth */}
          {isAuth && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-obsidian-light transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-obsidian font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-medium text-white leading-none">{user.name}</div>
                  <div className="text-xs text-white/40 font-mono">T{user.trust_score}</div>
                </div>
                <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-obsidian-mid border border-obsidian-border rounded-xl shadow-lg overflow-hidden z-50">
                  <Link href={`/u/${user.handle}`} className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-obsidian-light transition-colors">
                    <span>◎</span> Hồ sơ cá nhân
                  </Link>
                  <Link href="/studio" className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-obsidian-light transition-colors">
                    <span>⟡</span> IAI Studio
                  </Link>
                  <div className="border-t border-obsidian-border" />
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-obsidian-light transition-colors"
                  >
                    <span>→</span> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm text-white/60">
                Đăng nhập
              </Link>
              <Link href="/register" className="btn btn-gold btn-sm">
                Tham gia
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-obsidian-light transition-colors text-white/60"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-obsidian-border bg-obsidian-mid">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-obsidian-light text-white'
                    : 'text-white/50 hover:text-white'
                )}
              >
                <span className="text-gold">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

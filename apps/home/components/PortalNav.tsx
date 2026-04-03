'use client'

import { useState } from 'react'

const links = [
  { label: 'App', href: 'https://app.iai.one' },
  { label: 'Flow', href: 'https://flow.iai.one' },
  { label: 'Docs', href: 'https://docs.iai.one' },
  { label: 'Developer', href: 'https://developer.iai.one' },
  { label: 'Dashboard', href: 'https://dash.iai.one' },
]

export function PortalNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <a href="https://home.iai.one" className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
          IAI Portal
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map(link => (
            <a key={link.label} href={link.href} className="text-sm text-white/65 transition hover:text-white">
              {link.label}
            </a>
          ))}
          <a
            href="https://app.iai.one"
            className="rounded-xl bg-gold px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
          >
            Open App
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(value => !value)}
          className="inline-flex items-center rounded-xl border border-white/15 px-3 py-2 text-sm text-white/80 md:hidden"
          aria-expanded={open}
          aria-controls="portal-mobile-nav"
        >
          Menu
        </button>
      </div>

      {open ? (
        <div id="portal-mobile-nav" className="border-t border-white/10 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/75 transition hover:border-gold/30 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#entry-points"
              className="rounded-xl border border-cyan/30 bg-cyan/10 px-4 py-3 text-sm font-medium text-cyan"
            >
              Explore the system
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── IAI Brand Colors ──────────────────────────────────
        // Gold of Truth (Primary)
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C96A',
          pale:    '#FDF6E3',
          dark:    '#8B6914',
        },
        // Obsidian (Dark BG)
        obsidian: {
          DEFAULT: '#0D0D0F',
          mid:     '#141418',
          light:   '#1A1A20',
          border:  '#242430',
          muted:   '#2E2E3A',
        },
        // Cyan of Intelligence
        cyan: {
          iai:     '#00D4FF',
          mid:     '#0099CC',
          deep:    '#005580',
          pale:    '#E8F8FF',
        },
        // Jade of Vietnam
        jade: {
          DEFAULT: '#00A878',
          light:   '#00D49A',
          pale:    '#E6FFF8',
          dark:    '#006B4E',
        },
        // Fact Status Colors
        verified:   '#00D49A',
        disputed:   '#F59E0B',
        unverified: '#6B7280',
        'fact-false': '#EF4444',
        opinion:    '#8B5CF6',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono:  ['"DM Mono"', '"Fira Code"', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
        'obsidian-gradient': 'linear-gradient(180deg, #0D0D0F 0%, #141418 100%)',
        'glow-gold': 'radial-gradient(ellipse at center, rgba(201,168,76,0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(0,212,255,0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold':      '0 0 20px rgba(201,168,76,0.3)',
        'gold-sm':   '0 0 8px rgba(201,168,76,0.2)',
        'cyan':      '0 0 20px rgba(0,212,255,0.3)',
        'card':      '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.4)',
      },
      animation: {
        'shimmer':       'shimmer 2s linear infinite',
        'pulse-gold':    'pulse-gold 2s ease-in-out infinite',
        'fade-in':       'fade-in 0.3s ease-out',
        'slide-up':      'slide-up 0.4s ease-out',
        'fact-check':    'fact-check 1.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201,168,76,0.2)' },
          '50%':       { boxShadow: '0 0 20px rgba(201,168,76,0.5)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fact-check': {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}

export default config

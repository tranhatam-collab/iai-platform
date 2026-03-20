// ═══════════════════════════════════════════════════════════════
//  IAI Footer
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-obsidian-border bg-obsidian-mid mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="font-serif font-bold text-obsidian text-sm">I</span>
              </div>
              <span className="font-serif text-xl font-bold logo-iai">
                <span className="i-intel">I</span>
                <span className="a-art">A</span>
                <span className="i-intl">I</span>
              </span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Hiệp Hội Trí Tuệ Sáng Tạo Toàn Cầu<br />
              Intelligence · Artistry · International
            </p>
            <p className="text-xs text-white/25 font-mono">
              iai.one · ai.muonnoi.org
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-4">Nền tảng</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Feed cộng đồng' },
                { href: '/lessons', label: 'Kho bài học' },
                { href: '/verify', label: 'Kiểm chứng AI' },
                { href: '/studio', label: 'IAI Studio' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/50 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-4">Công nghệ</h4>
            <ul className="space-y-2">
              {[
                { label: 'AI Fact-Check', desc: 'Claude AI' },
                { label: 'Edge API',      desc: 'Cloudflare Workers' },
                { label: 'Database',      desc: 'D1 SQLite' },
                { label: 'IPFS Storage',  desc: 'Phase 3' },
              ].map(t => (
                <li key={t.label} className="text-sm">
                  <span className="text-white/50">{t.label}</span>
                  <span className="text-white/25 font-mono text-xs ml-2">· {t.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Truth Engine */}
          <div>
            <h4 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-4">Sự thật</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-jade animate-pulse" />
                <span className="text-xs text-white/50">AI kiểm chứng 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-xs text-white/50">Nguồn dẫn minh bạch</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-iai" />
                <span className="text-xs text-white/50">IPFS bất biến (Phase 3)</span>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-obsidian-light border border-obsidian-border">
                <p className="text-xs text-white/40 italic leading-relaxed">
                  "Sự thật không thể bị xóa — nội dung đã verified được lưu mãi mãi."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-obsidian-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25 font-mono">
            © 2025 IAI — Hiệp Hội Trí Tuệ Sáng Tạo Toàn Cầu · iai.one
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/20 font-mono">v1.0.0 · Phase 1</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
              <span className="text-xs text-white/30 font-mono">API Online</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

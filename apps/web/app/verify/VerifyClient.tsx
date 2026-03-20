// ═══════════════════════════════════════════════════════════════
//  IAI VerifyClient — Interactive fact-check interface
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/store/auth'
import { cn, getFactScoreBg } from '@/lib/utils'
import { FactBadge } from '@/components/ai/FactBadge'
import type { FactCheckResult, FactStatus } from '@/types'

// ── Claim Card ───────────────────────────────────────────────────
function ClaimCard({ claim, index }: { claim: FactCheckResult['claims'][0]; index: number }) {
  const verdictColor: Record<string, string> = {
    true:    'border-jade/30 bg-jade/5',
    false:   'border-red-500/30 bg-red-500/5',
    unclear: 'border-amber-500/30 bg-amber-500/5',
    opinion: 'border-purple-500/30 bg-purple-500/5',
  }
  const verdictIcon:  Record<string, string> = { true: '✓', false: '✗', unclear: '?', opinion: '💬' }
  const verdictLabel: Record<string, string> = { true: 'ĐÚNG', false: 'SAI', unclear: 'KHÔNG RÕ', opinion: 'QUAN ĐIỂM' }
  const verdictText:  Record<string, string> = {
    true: 'text-jade', false: 'text-red-400', unclear: 'text-amber-400', opinion: 'text-purple-400'
  }

  return (
    <div className={cn('p-4 rounded-xl border', verdictColor[claim.verdict] ?? 'border-obsidian-border')}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={cn('text-xs font-mono font-bold', verdictText[claim.verdict])}>
          {verdictIcon[claim.verdict]} {verdictLabel[claim.verdict]}
        </span>
        <span className="text-xs font-mono text-white/30">Độ tin cậy: {claim.confidence}%</span>
      </div>
      <p className="text-sm text-white/80 mb-2 italic">"{claim.text}"</p>
      <p className="text-xs text-white/50 leading-relaxed">{claim.explanation}</p>
      {claim.source_url && (
        <a
          href={claim.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-iai/60 hover:text-cyan-iai transition-colors"
        >
          ↗ Nguồn
        </a>
      )}
    </div>
  )
}

// ── Result Panel ─────────────────────────────────────────────────
function ResultPanel({ result }: { result: FactCheckResult }) {
  return (
    <div className="card p-6 space-y-6 animate-in">
      {/* Score Header */}
      <div className="flex items-center gap-5">
        <div className={cn(
          'w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold font-mono text-2xl shrink-0',
          getFactScoreBg(result.truth_score)
        )}>
          {result.truth_score}
        </div>
        <div>
          <FactBadge status={result.status as FactStatus} score={result.truth_score} size="lg" />
          <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-md">
            {result.summary}
          </p>
          <p className="text-xs text-white/25 font-mono mt-2">
            Phân tích bởi {result.model_used} · {result.processing_ms}ms
          </p>
        </div>
      </div>

      {/* Claims */}
      {result.claims.length > 0 && (
        <div>
          <h4 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-3">
            Phân tích luận điểm ({result.claims.length})
          </h4>
          <div className="space-y-3">
            {result.claims.map((claim, i) => (
              <ClaimCard key={i} claim={claim} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {result.sources.length > 0 && (
        <div>
          <h4 className="text-xs font-mono font-medium text-white/40 uppercase tracking-wider mb-3">
            Nguồn đã đối chiếu
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.sources.map((src, i) => (
              <span key={i} className="badge badge-unverified text-xs truncate max-w-xs">
                {src.replace(/^https?:\/\//, '').replace(/\/.+/, '')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendation */}
      {result.recommendation && (
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/15">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gold text-xs">◈</span>
            <span className="text-xs font-mono text-gold/70 uppercase tracking-wide">Lời khuyên</span>
          </div>
          <p className="text-sm text-white/60">{result.recommendation}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Verify Component ────────────────────────────────────────
function VerifyForm() {
  const { isAuth, token } = useAuth()
  const searchParams = useSearchParams()

  const [content, setContent]   = useState(searchParams.get('content') ?? '')
  const [mode, setMode]         = useState<'post' | 'claim'>('post')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState<FactCheckResult | null>(null)
  const [error, setError]       = useState('')

  async function handleVerify() {
    if (!content.trim() || !token) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const endpoint = mode === 'claim' ? api.verify.claim : api.verify.post
      const res = await (
        mode === 'claim'
          ? api.verify.claim(content, token)
          : api.verify.post({ content }, token)
      ) as { ok: boolean; result?: FactCheckResult; error?: string }

      if (!res.ok) { setError(res.error ?? 'Lỗi kiểm chứng'); return }
      if (res.result) setResult(res.result)
    } catch {
      setError('Không thể kết nối đến AI engine. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="tab-nav">
        <button onClick={() => setMode('post')} className={mode === 'post' ? 'active' : ''}>
          <span className="text-gold text-xs">◎</span> Bài viết / Nội dung dài
        </button>
        <button onClick={() => setMode('claim')} className={mode === 'claim' ? 'active' : ''}>
          <span className="text-gold text-xs">◈</span> Một luận điểm
        </button>
      </div>

      {/* Input */}
      <div className="card p-5">
        <label className="block text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
          {mode === 'post' ? 'Dán bài viết, tin tức, hoặc nội dung cần kiểm chứng' : 'Nhập một luận điểm cần kiểm tra'}
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={
            mode === 'post'
              ? 'VD: "Việt Nam đứng top 5 tốc độ phát triển AI trong ASEAN theo McKinsey 2025. Với ngân sách 2.1 tỷ USD..."'
              : 'VD: "AI sẽ thay thế hoàn toàn giáo viên trong 10 năm tới"'
          }
          className="min-h-[140px] resize-none"
          maxLength={5000}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-white/25 font-mono">{content.length}/5000</span>
          {!isAuth && (
            <p className="text-xs text-white/35">
              <Link href="/login" className="text-gold hover:text-gold-light">Đăng nhập</Link> để kiểm chứng
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleVerify}
        disabled={!content.trim() || !isAuth || loading}
        className="btn btn-gold btn-lg w-full justify-center text-base"
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <span className="spinner w-5 h-5" />
            <span>AI đang phân tích…</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span className="text-lg">◎</span>
            Kiểm Chứng với Claude AI
          </span>
        )}
      </button>

      {/* Loading Animation */}
      {loading && (
        <div className="card p-6 text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="verify-scanner w-16 h-16 border-2 border-gold/30 rounded-xl" />
            <div className="absolute inset-2 flex items-center justify-center">
              <span className="text-gold text-xl animate-pulse">◎</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/60 font-medium">IAI Verify Bot đang phân tích…</p>
            <p className="text-xs text-white/35 mt-1">Đối chiếu nguồn · Phân tích luận điểm · Tính điểm sự thật</p>
          </div>
          <div className="flex justify-center gap-2">
            {['McKinsey', 'Reuters', 'VnExpress', 'Wikipedia'].map(s => (
              <span key={s} className="badge badge-unverified text-xs animate-pulse">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && <ResultPanel result={result} />}
    </div>
  )
}

export function VerifyClient() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-gold font-mono text-[10px]">◎ AI TRUTH ENGINE</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl text-white mb-3">
          Kiểm Chứng AI
        </h1>
        <p className="text-sm text-white/45 leading-relaxed max-w-lg">
          Dán bất kỳ nội dung nào — bài báo, tin nhắn, luận điểm — Claude AI sẽ phân tích,
          đối chiếu nguồn, và gắn nhãn sự thật trong vài giây.
        </p>

        {/* How it works */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { step: '01', label: 'Nhập nội dung', icon: '↓' },
            { step: '02', label: 'AI phân tích',  icon: '◎' },
            { step: '03', label: 'Nhận kết quả',  icon: '✓' },
          ].map(s => (
            <div key={s.step} className="card p-3 text-center">
              <div className="text-gold text-lg mb-1">{s.icon}</div>
              <div className="text-xs font-mono text-white/25">{s.step}</div>
              <div className="text-xs text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <Suspense>
        <VerifyForm />
      </Suspense>

      {/* Examples */}
      <div className="mt-8 pt-6 border-t border-obsidian-border">
        <h3 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">Thử với ví dụ</h3>
        <div className="space-y-2">
          {[
            'Việt Nam đứng top 5 tốc độ phát triển AI trong ASEAN theo báo cáo McKinsey 2025',
            'AI sẽ thay thế hoàn toàn giáo viên trong vòng 10 năm tới',
            'Blockchain đã được chính phủ Việt Nam áp dụng cho chứng chỉ nghề',
          ].map(ex => (
            <button
              key={ex}
              onClick={() => {}}
              className="w-full text-left p-3 rounded-xl border border-obsidian-border hover:border-gold/30 hover:bg-gold/5 transition-all text-sm text-white/40 hover:text-white/70"
            >
              <span className="text-gold/50 mr-2">→</span>
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

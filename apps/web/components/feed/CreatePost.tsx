// ═══════════════════════════════════════════════════════════════
//  IAI CreatePost — New post composer
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/store/auth'
import { api } from '@/lib/api'

const POST_TYPES = [
  { value: 'discussion', label: '💬 Thảo luận' },
  { value: 'news',       label: '📰 Tin tức' },
  { value: 'knowledge',  label: '✦ Kiến thức' },
  { value: 'debate',     label: '⚡ Tranh luận' },
]

type Props = { onCreated?: () => void }

export function CreatePost({ onCreated }: Props) {
  const { isAuth, user, token } = useAuth()
  const [content, setContent]   = useState('')
  const [type, setType]         = useState('discussion')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [expanded, setExpanded] = useState(false)

  if (!isAuth || !user) {
    return (
      <div className="card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-obsidian-muted flex items-center justify-center text-white/20 text-lg">
          ?
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/40">
            <a href="/login" className="text-gold hover:text-gold-light">Đăng nhập</a>
            {' '}để chia sẻ và thảo luận
          </p>
        </div>
      </div>
    )
  }

  async function handleSubmit() {
    if (!content.trim() || !token) return
    setLoading(true)
    setError('')
    try {
      const res = await api.posts.create({ content, type: type as never }, token) as { ok: boolean; error?: string }
      if (!res.ok) { setError(res.error ?? 'Lỗi không xác định'); return }
      setContent('')
      setExpanded(false)
      onCreated?.()
    } catch {
      setError('Không thể đăng bài. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-obsidian font-bold text-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Textarea */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setExpanded(true)}
            placeholder="Chia sẻ kiến thức, tin tức, hay tranh luận... AI sẽ kiểm chứng."
            className={cn(
              'w-full bg-transparent border-none outline-none resize-none text-sm text-white/80 placeholder:text-white/25 leading-relaxed transition-all',
              expanded ? 'min-h-[120px]' : 'min-h-[44px]'
            )}
            maxLength={5000}
          />

          {/* Expanded Controls */}
          {expanded && (
            <div className="mt-3 space-y-3 animate-in">
              {/* Type selector */}
              <div className="flex flex-wrap gap-2">
                {POST_TYPES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      type === t.value
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'text-white/40 hover:text-white/70 border border-transparent hover:border-obsidian-border'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Info + Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/25 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span>AI sẽ kiểm chứng sau khi đăng</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/25 font-mono">{content.length}/5000</span>
                  <button
                    onClick={() => { setExpanded(false); setContent('') }}
                    className="btn btn-ghost btn-sm text-white/40"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim() || loading}
                    className="btn btn-gold btn-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="spinner w-3.5 h-3.5" />
                        Đang đăng…
                      </span>
                    ) : 'Đăng bài'}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 font-mono">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

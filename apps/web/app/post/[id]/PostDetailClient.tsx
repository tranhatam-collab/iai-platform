// ═══════════════════════════════════════════════════════════════
//  IAI PostDetailClient — Full post view with comments
// ═══════════════════════════════════════════════════════════════

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { PostCard } from '@/components/feed/PostCard'
import type { Post } from '@/types'

type Props = { postId: string }

export function PostDetailClient({ postId }: Props) {
  const [post, setPost]     = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.posts.get(postId) as { ok: boolean; post?: Post; error?: string }
        if (!res.ok || !res.post) { setError(res.error ?? 'Không tìm thấy bài viết'); return }
        setPost(res.post)
      } catch {
        setError('Không thể tải bài viết.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-white/30 font-mono mb-6">
        <Link href="/" className="hover:text-white/60">IAI</Link>
        <span>/</span>
        <span className="text-white/50">Bài viết</span>
      </div>

      {loading ? (
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-32 rounded" />
              <div className="skeleton h-2.5 w-24 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-3 w-full rounded" />)}
          </div>
        </div>
      ) : error || !post ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">✕</div>
          <h2 className="font-serif text-xl text-white/60 mb-4">{error || 'Bài viết không tồn tại'}</h2>
          <Link href="/" className="btn btn-outline">← Về trang chủ</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <PostCard post={post} showFull />

          {/* Verify CTA */}
          {post.fact_status === 'unverified' && (
            <div className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold text-lg shrink-0">
                ◎
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/70 mb-1">Bài viết chưa được kiểm chứng</p>
                <p className="text-xs text-white/35">Kiểm chứng ngay để biết thông tin này có đáng tin không.</p>
              </div>
              <Link
                href={`/verify?content=${encodeURIComponent(post.content.slice(0, 500))}`}
                className="btn btn-gold btn-sm shrink-0"
              >
                Kiểm chứng
              </Link>
            </div>
          )}

          {/* On-Chain Badge */}
          {(post.ipfs_cid || post.chain_tx_hash) && (
            <div className="card p-4 flex items-center gap-3">
              <span className="text-cyan-iai text-xl">⬡</span>
              <div>
                <p className="text-xs font-mono text-white/50 font-semibold">ĐÃ LƯU TRÊN BLOCKCHAIN</p>
                {post.content_hash && (
                  <p className="text-xs font-mono text-white/25 mt-0.5">
                    Hash: {post.content_hash.slice(0, 16)}…
                  </p>
                )}
              </div>
              {post.ipfs_cid && (
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${post.ipfs_cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-cyan-iai/60 hover:text-cyan-iai transition-colors"
                >
                  ↗ IPFS
                </a>
              )}
            </div>
          )}

          {/* Back */}
          <Link href="/" className="flex items-center gap-2 text-sm text-white/35 hover:text-white/60 transition-colors px-1">
            ← Về Feed
          </Link>
        </div>
      )}
    </div>
  )
}

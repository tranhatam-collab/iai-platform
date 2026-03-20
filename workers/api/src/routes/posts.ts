// ═══════════════════════════════════════════════════════════════
//  /v1/posts — Create, List, Get, React
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth, contentHash } from '../lib/auth'
import type { Bindings, PostType } from '../types'

export async function handlePosts(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)
  const url = new URL(request.url)

  // ── GET /v1/posts ─────────────────────────────────────────
  if (path === '/v1/posts' && request.method === 'GET') {
    const tab    = url.searchParams.get('tab') ?? 'hot'
    const limit  = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 50)
    const cursor = url.searchParams.get('cursor') ?? null

    let query: string
    switch (tab) {
      case 'verified': query = "WHERE p.fact_status = 'verified'"; break
      case 'lesson':   query = "WHERE p.type = 'lesson'"; break
      case 'debate':   query = "WHERE p.type = 'debate'"; break
      case 'chain':    query = "WHERE p.chain_tx_hash IS NOT NULL"; break
      default:         query = ''; break  // hot: all posts
    }

    const cursorClause = cursor ? `AND p.created_at < '${cursor}'` : ''
    const orderClause  = tab === 'hot'
      ? 'ORDER BY (p.like_count * 2 + p.comment_count) DESC, p.created_at DESC'
      : 'ORDER BY p.created_at DESC'

    const posts = await env.DB.prepare(`
      SELECT p.*, u.handle, u.name, u.avatar_url, u.trust_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ${query} ${cursorClause}
      ${orderClause}
      LIMIT ?
    `).bind(limit).all()

    return J({ ok: true, posts: posts.results, cursor: posts.results.at(-1)?.created_at ?? null })
  }

  // ── POST /v1/posts ────────────────────────────────────────
  if (path === '/v1/posts' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: { content?: string; type?: PostType; media_urls?: string[]; link_url?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.content?.trim()) return J({ ok: false, error: 'content is required' }, 400)
    if (body.content.length > 5000) return J({ ok: false, error: 'content too long (max 5000 chars)' }, 400)

    const id   = crypto.randomUUID()
    const hash = await contentHash(body.content)

    await env.DB.prepare(`
      INSERT INTO posts (id, user_id, content, type, media_urls, link_url, content_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      id, user.id, body.content,
      body.type ?? 'discussion',
      body.media_urls ? JSON.stringify(body.media_urls) : null,
      body.link_url ?? null,
      hash,
    ).run()

    return J({ ok: true, postId: id, contentHash: hash }, 201)
  }

  // ── GET /v1/posts/:id ─────────────────────────────────────
  const match = path.match(/^\/v1\/posts\/([a-z0-9-]+)$/)
  if (match && request.method === 'GET') {
    const post = await env.DB.prepare(`
      SELECT p.*, u.handle, u.name, u.avatar_url, u.trust_score
      FROM posts p JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `).bind(match[1]).first()

    if (!post) return J({ ok: false, error: 'Post not found' }, 404)
    // Increment view count
    await env.DB.prepare('UPDATE posts SET view_count = view_count + 1 WHERE id = ?').bind(match[1]).run()
    return J({ ok: true, post })
  }

  // ── POST /v1/posts/:id/like ───────────────────────────────
  const likeMatch = path.match(/^\/v1\/posts\/([a-z0-9-]+)\/like$/)
  if (likeMatch && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)
    await env.DB.prepare('UPDATE posts SET like_count = like_count + 1 WHERE id = ?').bind(likeMatch[1]).run()
    return J({ ok: true })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

// ═══════════════════════════════════════════════════════════════
//  POST /v1/verify/post  — AI fact-check a post
//  POST /v1/verify/claim — AI fact-check a single claim
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth, contentHash } from '../lib/auth'
import { factCheck } from '../lib/ai'
import type { Bindings } from '../types'

export async function handleVerify(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  // ── POST /v1/verify/post ──────────────────────────────────
  if (path === '/v1/verify/post' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: { postId?: string; content?: string; type?: string; autoIpfs?: boolean }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.content?.trim()) return J({ ok: false, error: 'content is required' }, 400)

    try {
      const hash   = await contentHash(body.content)
      const result = await factCheck(body.content, env.ANTHROPIC_API_KEY)

      // Save fact_check record to D1
      const fcId = crypto.randomUUID()
      await env.DB.prepare(`
        INSERT INTO fact_checks (id, post_id, status, truth_score, summary, claims, sources, recommendation, content_hash, model_used, processing_ms, checked_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).bind(
        fcId,
        body.postId ?? null,
        result.status,
        result.truth_score,
        result.summary,
        JSON.stringify(result.claims),
        JSON.stringify(result.sources),
        result.recommendation ?? null,
        hash,
        result.model_used,
        result.processing_ms,
      ).run()

      // If postId given, update the post's fact_status
      if (body.postId) {
        await env.DB.prepare(
          'UPDATE posts SET fact_status = ?, fact_score = ?, content_hash = ? WHERE id = ?'
        ).bind(result.status, result.truth_score, hash, body.postId).run()
      }

      return J({
        ok: true,
        factCheckId:  fcId,
        contentHash:  hash,
        result,
        autoActions:  { ipfsPinned: false, chainAnchored: false },
      })

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'AI engine error'
      console.error('[verify/post]', msg)
      return J({ ok: false, error: msg }, 500)
    }
  }

  // ── POST /v1/verify/claim ─────────────────────────────────
  if (path === '/v1/verify/claim' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: { claim?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }
    if (!body.claim?.trim()) return J({ ok: false, error: 'claim is required' }, 400)

    const result = await factCheck(body.claim, env.ANTHROPIC_API_KEY)
    return J({ ok: true, result })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

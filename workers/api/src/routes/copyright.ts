// ═══════════════════════════════════════════════════════════════
//  /v1/copyright — Registration, check, and violation reports
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth, contentHash } from '../lib/auth'
import type { Bindings } from '../types'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

async function checkSimilarity(text1: string, text2: string, apiKey: string): Promise<number> {
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 64,
        messages: [{
          role: 'user',
          content: `Rate the similarity of these two texts on a scale 0-100 (0=completely different, 100=identical). Reply ONLY with a number.\n\nText A: ${text1.slice(0, 800)}\n\nText B: ${text2.slice(0, 800)}`,
        }],
      }),
    })
    const data = await res.json() as { content?: Array<{ text: string }> }
    return parseInt(data.content?.[0]?.text?.trim() ?? '0', 10) || 0
  } catch { return 0 }
}

export async function handleCopyright(
  request: Request, env: Bindings, path: string,
): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  // ── POST /v1/copyright/register — register ownership ─────────
  if (path === '/v1/copyright/register' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: { content_type?: string; content_id?: string; content?: string; title?: string; note?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { content_type, content_id, content, title, note } = body
    if (!content_type || !content_id || !content)
      return J({ ok: false, error: 'content_type, content_id, content required' }, 400)

    const hash = await contentHash(content)

    // Check if same hash already registered by someone else
    const existing = await env.DB.prepare(
      'SELECT creator_id FROM copyright_records WHERE content_hash = ?'
    ).bind(hash).first<{ creator_id: string }>()

    if (existing && existing.creator_id !== user.id)
      return J({ ok: false, error: 'Nội dung này đã được đăng ký bởi người dùng khác', code: 'CONFLICT' }, 409)

    const id = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT OR REPLACE INTO copyright_records
        (id, creator_id, content_type, content_id, content_hash, title, registration_note, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(id, user.id, content_type, content_id, hash, title ?? null, note ?? null).run()

    // Mark the source content as copyright registered
    if (content_type === 'course')
      await env.DB.prepare('UPDATE courses SET copyright_registered=1 WHERE id=? AND creator_id=?').bind(content_id, user.id).run()
    if (content_type === 'document')
      await env.DB.prepare('UPDATE documents SET copyright_registered=1 WHERE id=? AND creator_id=?').bind(content_id, user.id).run()
    if (content_type === 'lesson')
      await env.DB.prepare('UPDATE lessons SET content_hash=? WHERE id=? AND author_id=?').bind(hash, content_id, user.id).run()

    return J({ ok: true, record: { id, content_hash: hash }, message: 'Bản quyền đã được đăng ký' }, 201)
  }

  // ── POST /v1/copyright/check — check if content is original ──
  if (path === '/v1/copyright/check' && request.method === 'POST') {
    let body: { content?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { content } = body
    if (!content) return J({ ok: false, error: 'content required' }, 400)

    const hash = await contentHash(content)

    // Exact hash match
    const exact = await env.DB.prepare(
      `SELECT cr.*, u.handle, u.name FROM copyright_records cr
       JOIN users u ON cr.creator_id = u.id WHERE cr.content_hash = ?`
    ).bind(hash).first()

    if (exact) return J({ ok: true, status: 'registered', match: 'exact', record: exact })

    return J({ ok: true, status: 'original', match: 'none', content_hash: hash })
  }

  // ── POST /v1/copyright/report — report a violation ───────────
  if (path === '/v1/copyright/report' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: {
      content_type?: string; content_id?: string; original_content_id?: string
      description?: string; evidence_url?: string; original_text?: string; reported_text?: string
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { content_type, content_id, original_content_id, description, evidence_url, original_text, reported_text } = body
    if (!content_type || !content_id || !description)
      return J({ ok: false, error: 'content_type, content_id, description required' }, 400)

    // AI similarity check if both texts provided
    let similarity = 0
    if (original_text && reported_text) {
      similarity = await checkSimilarity(original_text, reported_text, env.ANTHROPIC_API_KEY)
    }

    const id = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO copyright_reports
        (id, reporter_id, content_type, content_id, original_content_id, description, evidence_url, ai_similarity_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, user.id, content_type, content_id, original_content_id ?? null,
             description, evidence_url ?? null, similarity || null).run()

    return J({
      ok: true,
      report: { id, ai_similarity_score: similarity },
      message: 'Báo cáo đã gửi. IAI sẽ xử lý trong 7 ngày làm việc.',
    }, 201)
  }

  // ── GET /v1/copyright/my — my registrations ──────────────────
  if (path === '/v1/copyright/my' && request.method === 'GET') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const records = await env.DB.prepare(
      'SELECT * FROM copyright_records WHERE creator_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(user.id).all()

    return J({ ok: true, records: records.results })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

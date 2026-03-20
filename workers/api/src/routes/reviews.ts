// ═══════════════════════════════════════════════════════════════
//  /v1/reviews — Public star ratings for courses, docs, lessons
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth } from '../lib/auth'
import type { Bindings } from '../types'

async function updateRatingAvg(env: Bindings, table: string, idField: string, id: string) {
  await env.DB.prepare(`
    UPDATE ${table} SET
      rating_avg   = (SELECT ROUND(AVG(rating),2) FROM reviews WHERE ${idField} = ?),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE ${idField} = ?)
    WHERE id = ?
  `).bind(id, id, id).run()
}

export async function handleReviews(
  request: Request, env: Bindings, path: string,
): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)
  const url = new URL(request.url)

  // ── GET /v1/reviews — list reviews for a target ───────────────
  if (path === '/v1/reviews' && request.method === 'GET') {
    const courseId   = url.searchParams.get('course_id')
    const documentId = url.searchParams.get('document_id')
    const lessonId   = url.searchParams.get('lesson_id')
    const limit      = Math.min(Number(url.searchParams.get('limit') ?? 20), 100)
    const offset     = Number(url.searchParams.get('offset') ?? 0)

    if (!courseId && !documentId && !lessonId)
      return J({ ok: false, error: 'course_id, document_id, or lesson_id required' }, 400)

    let q = `SELECT r.*, u.handle, u.name, u.avatar_url
             FROM reviews r JOIN users u ON r.user_id = u.id WHERE`
    const binds: unknown[] = []

    if (courseId)   { q += ' r.course_id = ?';   binds.push(courseId) }
    if (documentId) { q += ' r.document_id = ?';  binds.push(documentId) }
    if (lessonId)   { q += ' r.lesson_id = ?';    binds.push(lessonId) }

    q += ' ORDER BY r.is_verified_purchase DESC, r.helpful_count DESC, r.created_at DESC LIMIT ? OFFSET ?'
    binds.push(limit, offset)

    const rows = await env.DB.prepare(q).bind(...binds).all()

    // Rating distribution
    const targetField = courseId ? 'course_id' : documentId ? 'document_id' : 'lesson_id'
    const targetId    = courseId ?? documentId ?? lessonId
    const dist = await env.DB.prepare(
      `SELECT rating, COUNT(*) as count FROM reviews WHERE ${targetField} = ? GROUP BY rating ORDER BY rating DESC`
    ).bind(targetId).all()

    return J({ ok: true, reviews: rows.results, distribution: dist.results })
  }

  // ── POST /v1/reviews — submit a review ───────────────────────
  if (path === '/v1/reviews' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: {
      course_id?: string; document_id?: string; lesson_id?: string
      rating?: number; title?: string; content?: string
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { course_id, document_id, lesson_id, rating, title, content } = body
    if (!rating || rating < 1 || rating > 5) return J({ ok: false, error: 'rating must be 1-5' }, 400)
    if (!course_id && !document_id && !lesson_id) return J({ ok: false, error: 'Target required' }, 400)

    // Check verified purchase
    let isVerified = 0
    if (course_id) {
      const p = await env.DB.prepare(
        "SELECT id FROM purchases WHERE user_id = ? AND course_id = ? AND status = 'completed'"
      ).bind(user.id, course_id).first()
      isVerified = p ? 1 : 0
    }
    if (document_id) {
      const p = await env.DB.prepare(
        "SELECT id FROM purchases WHERE user_id = ? AND document_id = ? AND status = 'completed'"
      ).bind(user.id, document_id).first()
      isVerified = p ? 1 : 0
    }

    const id = crypto.randomUUID()
    try {
      await env.DB.prepare(`
        INSERT INTO reviews (id, user_id, course_id, document_id, lesson_id, rating, title, content, is_verified_purchase)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, user.id, course_id ?? null, document_id ?? null, lesson_id ?? null,
               rating, title ?? null, content ?? null, isVerified).run()
    } catch {
      return J({ ok: false, error: 'Bạn đã đánh giá nội dung này rồi' }, 409)
    }

    // Update avg rating on parent
    if (course_id)   await updateRatingAvg(env, 'courses',   'course_id',   course_id)
    if (document_id) await updateRatingAvg(env, 'documents', 'document_id', document_id)
    if (lesson_id)   await updateRatingAvg(env, 'lessons',   'lesson_id',   lesson_id)

    return J({ ok: true, review: { id, rating } }, 201)
  }

  // ── POST /v1/reviews/:id/helpful ─────────────────────────────
  const helpfulMatch = path.match(/^\/v1\/reviews\/([a-f0-9-]+)\/helpful$/)
  if (helpfulMatch && request.method === 'POST') {
    await env.DB.prepare(
      'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?'
    ).bind(helpfulMatch[1]).run()
    return J({ ok: true })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

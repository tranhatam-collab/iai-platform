// ═══════════════════════════════════════════════════════════════
//  /v1/marketplace — Combined search: courses + documents
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth } from '../lib/auth'
import type { Bindings } from '../types'

export async function handleMarketplace(
  request: Request, env: Bindings, path: string,
): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)
  const url = new URL(request.url)

  // ── GET /v1/marketplace — combined search ─────────────────────
  if (path === '/v1/marketplace' && request.method === 'GET') {
    const limit    = Math.min(Number(url.searchParams.get('limit')  ?? 20), 100)
    const offset   = Number(url.searchParams.get('offset') ?? 0)
    const category = url.searchParams.get('category')
    const type     = url.searchParams.get('type')        // course|document|all
    const free     = url.searchParams.get('free')        // 1 = free, 0 = premium
    const sort     = url.searchParams.get('sort') ?? 'latest' // latest|newest|rating|top_rated|students|popular|price_asc
    const q        = url.searchParams.get('q')

    const items: unknown[] = []

    if (type !== 'document') {
      let courseQ = `SELECT c.id, 'course' as item_type, c.title, c.slug, c.description,
                       c.thumbnail_url, c.category, c.level, c.price, c.currency,
                       c.chapters_count, c.total_minutes, c.ai_quality_score,
                       c.fact_verified, c.copyright_registered,
                       c.student_count, c.rating_avg, c.rating_count, c.view_count,
                       c.created_at, u.handle, u.name, u.avatar_url
                     FROM courses c JOIN users u ON c.creator_id = u.id
                     WHERE c.status = 'published'`
      const cBinds: unknown[] = []
      if (category) { courseQ += ' AND c.category = ?'; cBinds.push(category) }
      if (free === '1') { courseQ += ' AND c.price = 0' }
      if (free === '0') { courseQ += ' AND c.price > 0' }
      if (q) { courseQ += ' AND (c.title LIKE ? OR c.description LIKE ?)'; cBinds.push(`%${q}%`, `%${q}%`) }

      const courses = await env.DB.prepare(courseQ).bind(...cBinds).all()
      items.push(...courses.results)
    }

    if (type !== 'course') {
      let docQ = `SELECT d.id, 'document' as item_type, d.title, d.id as slug, d.description,
                    d.thumbnail_url, d.category, NULL as level, d.price, d.currency,
                    NULL as chapters_count, NULL as total_minutes, d.ai_quality_score,
                    d.fact_verified, d.copyright_registered,
                    d.download_count as student_count, d.rating_avg, d.rating_count, NULL as view_count,
                    d.created_at, u.handle, u.name, u.avatar_url,
                    d.file_type, d.file_size_kb
                  FROM documents d JOIN users u ON d.creator_id = u.id
                  WHERE d.status = 'published'`
      const dBinds: unknown[] = []
      if (category) { docQ += ' AND d.category = ?'; dBinds.push(category) }
      if (free === '1') { docQ += ' AND d.price = 0' }
      if (free === '0') { docQ += ' AND d.price > 0' }
      if (q) { docQ += ' AND (d.title LIKE ? OR d.description LIKE ?)'; dBinds.push(`%${q}%`, `%${q}%`) }

      const docs = await env.DB.prepare(docQ).bind(...dBinds).all()
      items.push(...docs.results)
    }

    // Sort combined
    type Item = { rating_avg?: number; student_count?: number; price?: number; created_at?: string }
    const sorted = items.sort((a: Item, b: Item) => {
      if (sort === 'rating' || sort === 'top_rated') return (b.rating_avg ?? 0) - (a.rating_avg ?? 0)
      if (sort === 'students' || sort === 'popular') return (b.student_count ?? 0) - (a.student_count ?? 0)
      if (sort === 'price_asc') return (a.price ?? 0) - (b.price ?? 0)
      return new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    })

    const paginated = sorted.slice(offset, offset + limit)
    return J({ ok: true, items: paginated, total: sorted.length })
  }

  // ── POST /v1/marketplace/purchase — record a purchase ────────
  if (path === '/v1/marketplace/purchase' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: {
      course_id?: string; document_id?: string
      amount?: number; payment_method?: string; payment_ref?: string
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { course_id, document_id, amount = 0, payment_method = 'free', payment_ref } = body
    if (!course_id && !document_id) return J({ ok: false, error: 'course_id or document_id required' }, 400)

    // Free items auto-complete
    const status = amount === 0 ? 'completed' : 'pending'
    const id = crypto.randomUUID()

    await env.DB.prepare(`
      INSERT INTO purchases (id, user_id, course_id, document_id, amount, payment_method, payment_ref, status, created_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
    `).bind(id, user.id, course_id ?? null, document_id ?? null, amount,
             payment_method, payment_ref ?? null, status,
             status === 'completed' ? "datetime('now')" : null).run()

    // Update student_count or download_count
    if (status === 'completed') {
      if (course_id)
        await env.DB.prepare('UPDATE courses SET student_count = student_count + 1 WHERE id = ?').bind(course_id).run()
      if (document_id)
        await env.DB.prepare('UPDATE documents SET download_count = download_count + 1 WHERE id = ?').bind(document_id).run()
    }

    return J({ ok: true, purchase: { id, status }, message: status === 'completed' ? 'Đăng ký thành công!' : 'Chờ xác nhận thanh toán' }, 201)
  }

  // ── GET /v1/marketplace/my-purchases ─────────────────────────
  if (path === '/v1/marketplace/my-purchases' && request.method === 'GET') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const purchases = await env.DB.prepare(
      "SELECT * FROM purchases WHERE user_id = ? AND status = 'completed' ORDER BY created_at DESC"
    ).bind(user.id).all()

    return J({ ok: true, purchases: purchases.results })
  }

  // ── GET /v1/marketplace/check-purchase ───────────────────────
  if (path === '/v1/marketplace/check-purchase' && request.method === 'GET') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const url2 = new URL(request.url)
    const courseId   = url2.searchParams.get('course_id')
    const documentId = url2.searchParams.get('document_id')

    let q = "SELECT id FROM purchases WHERE user_id = ? AND status = 'completed'"
    const binds: unknown[] = [user.id]
    if (courseId)   { q += ' AND course_id = ?';   binds.push(courseId) }
    if (documentId) { q += ' AND document_id = ?';  binds.push(documentId) }

    const p = await env.DB.prepare(q).bind(...binds).first()
    return J({ ok: true, purchased: !!p })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

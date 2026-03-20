// ═══════════════════════════════════════════════════════════════
//  /v1/courses — Course CRUD + chapters + enrollment
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth, contentHash } from '../lib/auth'
import { scoreContent } from '../lib/ai'
import type { Bindings } from '../types'

function slug(title: string): string {
  return title.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-')
    + '-' + Date.now().toString(36)
}

export async function handleCourses(
  request: Request, env: Bindings, path: string,
): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)
  const url = new URL(request.url)

  // ── GET /v1/courses — list published courses ──────────────────
  if (path === '/v1/courses' && request.method === 'GET') {
    const limit    = Math.min(Number(url.searchParams.get('limit')    ?? 20), 100)
    const offset   = Number(url.searchParams.get('offset') ?? 0)
    const category = url.searchParams.get('category')
    const level    = url.searchParams.get('level')
    const free     = url.searchParams.get('free')
    const sort     = url.searchParams.get('sort') ?? 'created_at'

    const sortCol = ({ rating: 'c.rating_avg', students: 'c.student_count', price_asc: 'c.price' } as Record<string,string>)[sort] ?? 'c.created_at'

    let q = `SELECT c.*, u.handle, u.name, u.avatar_url
             FROM courses c JOIN users u ON c.creator_id = u.id
             WHERE c.status = 'published'`
    const binds: unknown[] = []

    if (category) { q += ' AND c.category = ?'; binds.push(category) }
    if (level)    { q += ' AND c.level = ?';    binds.push(level) }
    if (free === '1') { q += ' AND c.price = 0' }
    q += ` ORDER BY ${sortCol} DESC LIMIT ? OFFSET ?`
    binds.push(limit, offset)

    const rows = await env.DB.prepare(q).bind(...binds).all()
    return J({ ok: true, courses: rows.results, total: rows.results.length })
  }

  // ── GET /v1/courses/:slug ─────────────────────────────────────
  const slugMatch = path.match(/^\/v1\/courses\/([a-z0-9-]+)$/)
  if (slugMatch && request.method === 'GET') {
    const course = await env.DB.prepare(
      `SELECT c.*, u.handle, u.name, u.avatar_url, u.trust_score, u.bio
       FROM courses c JOIN users u ON c.creator_id = u.id
       WHERE c.slug = ? AND c.status = 'published'`
    ).bind(slugMatch[1]).first()
    if (!course) return J({ ok: false, error: 'Course not found' }, 404)

    const chapters = await env.DB.prepare(
      'SELECT * FROM course_chapters WHERE course_id = ? ORDER BY position ASC'
    ).bind((course as { id: string }).id).all()

    return J({ ok: true, course, chapters: chapters.results })
  }

  // ── POST /v1/courses — create course ─────────────────────────
  if (path === '/v1/courses' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: {
      title?: string; description?: string; thumbnail_url?: string
      trailer_url?: string; category?: string; level?: string
      language?: string; price?: number
    }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { title, description, thumbnail_url, trailer_url, category, level = 'beginner', language = 'vi', price = 0 } = body
    if (!title || !description) return J({ ok: false, error: 'title and description required' }, 400)

    const id         = crypto.randomUUID()
    const courseSlug = slug(title)
    const hash       = await contentHash(title + description)

    await env.DB.prepare(`
      INSERT INTO courses (id, creator_id, title, slug, description, thumbnail_url, trailer_url,
        category, level, language, price, content_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(id, user.id, title, courseSlug, description, thumbnail_url ?? null, trailer_url ?? null,
             category ?? null, level, language, price, hash).run()

    return J({ ok: true, course: { id, slug: courseSlug, title } }, 201)
  }

  // ── POST /v1/courses/:id/publish ─────────────────────────────
  const publishMatch = path.match(/^\/v1\/courses\/([a-f0-9-]+)\/publish$/)
  if (publishMatch && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const course = await env.DB.prepare(
      'SELECT * FROM courses WHERE id = ? AND creator_id = ?'
    ).bind(publishMatch[1], user.id).first<{ id: string; chapters_count: number }>()
    if (!course) return J({ ok: false, error: 'Course not found' }, 404)
    if (course.chapters_count === 0) return J({ ok: false, error: 'Add at least one chapter before publishing' }, 400)

    await env.DB.prepare(
      "UPDATE courses SET status = 'published', published_at = datetime('now'), updated_at = datetime('now') WHERE id = ?"
    ).bind(publishMatch[1]).run()

    return J({ ok: true, message: 'Course published' })
  }

  // ── POST /v1/courses/:id/chapters — add chapter ───────────────
  const chapterMatch = path.match(/^\/v1\/courses\/([a-f0-9-]+)\/chapters$/)
  if (chapterMatch && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const course = await env.DB.prepare(
      'SELECT id FROM courses WHERE id = ? AND creator_id = ?'
    ).bind(chapterMatch[1], user.id).first()
    if (!course) return J({ ok: false, error: 'Course not found' }, 404)

    let body: { title?: string; description?: string; video_url?: string; duration_minutes?: number; is_free_preview?: boolean; content_md?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { title, description, video_url, duration_minutes = 0, is_free_preview = false, content_md } = body
    if (!title) return J({ ok: false, error: 'title required' }, 400)

    const pos = await env.DB.prepare(
      'SELECT COUNT(*) as cnt FROM course_chapters WHERE course_id = ?'
    ).bind(chapterMatch[1]).first<{ cnt: number }>()
    const position = (pos?.cnt ?? 0) + 1

    const chapterId = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO course_chapters (id, course_id, title, description, video_url, duration_minutes, is_free_preview, position, content_md)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(chapterId, chapterMatch[1], title, description ?? null, video_url ?? null,
             duration_minutes, is_free_preview ? 1 : 0, position, content_md ?? null).run()

    // update chapters_count + total_minutes
    await env.DB.prepare(`
      UPDATE courses SET
        chapters_count = (SELECT COUNT(*) FROM course_chapters WHERE course_id = ?),
        total_minutes  = (SELECT COALESCE(SUM(duration_minutes),0) FROM course_chapters WHERE course_id = ?),
        updated_at     = datetime('now')
      WHERE id = ?
    `).bind(chapterMatch[1], chapterMatch[1], chapterMatch[1]).run()

    return J({ ok: true, chapter: { id: chapterId, position, title } }, 201)
  }

  // ── POST /v1/courses/:id/score — AI quality score ─────────────
  const scoreMatch = path.match(/^\/v1\/courses\/([a-f0-9-]+)\/score$/)
  if (scoreMatch && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const course = await env.DB.prepare(
      'SELECT id, title, description FROM courses WHERE id = ? AND creator_id = ?'
    ).bind(scoreMatch[1], user.id).first<{ id: string; title: string; description: string }>()
    if (!course) return J({ ok: false, error: 'Course not found' }, 404)

    const result = await scoreContent(course.title + '\n\n' + course.description, env)
    await env.DB.prepare(
      'UPDATE courses SET ai_quality_score = ?, ai_quality_summary = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(result.score, result.summary, scoreMatch[1]).run()

    return J({ ok: true, score: result.score, summary: result.summary })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

// ═══════════════════════════════════════════════════════════════
//  /v1/lessons — AI-generated & community lessons
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth, contentHash } from '../lib/auth'
import { generateLesson, factCheck } from '../lib/ai'
import type { Bindings, LessonLevel } from '../types'

export async function handleLessons(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)
  const url = new URL(request.url)

  // ── GET /v1/lessons ───────────────────────────────────────
  if (path === '/v1/lessons' && request.method === 'GET') {
    const subject = url.searchParams.get('subject')
    const level   = url.searchParams.get('level')
    const limit   = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 50)

    let q = "SELECT id, title, slug, summary, subject, level, ai_generated, fact_verified, fact_score, view_count, like_count, published_at FROM lessons WHERE status = 'published'"
    const binds: unknown[] = []
    if (subject) { q += ' AND subject = ?'; binds.push(subject) }
    if (level)   { q += ' AND level = ?';   binds.push(level) }
    q += ' ORDER BY published_at DESC LIMIT ?'
    binds.push(limit)

    const lessons = await env.DB.prepare(q).bind(...binds).all()
    return J({ ok: true, lessons: lessons.results })
  }

  // ── POST /v1/lessons/generate — AI creates lesson ─────────
  if (path === '/v1/lessons/generate' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    let body: { topic?: string; level?: LessonLevel; language?: string; subject?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.topic?.trim()) return J({ ok: false, error: 'topic is required' }, 400)

    try {
      // 1. Generate lesson content with Claude
      const generated = await generateLesson(
        body.topic,
        body.level ?? 'beginner',
        body.language ?? 'vi',
        env.ANTHROPIC_API_KEY
      )

      // 2. Auto fact-check the generated content
      const factResult = await factCheck(
        `${generated.title}\n\n${generated.summary}`,
        env.ANTHROPIC_API_KEY
      )

      // 3. Save to D1 (status = 'draft' until fact_verified=true and published)
      const id   = crypto.randomUUID()
      const hash = await contentHash(generated.content_md)
      const slug = generated.slug || body.topic.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      await env.DB.prepare(`
        INSERT INTO lessons
          (id, author_id, title, slug, content_md, summary, subject, level, language, ai_generated,
           fact_verified, fact_score, sources, key_concepts, content_hash, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, 'draft', datetime('now'))
      `).bind(
        id, user.id,
        generated.title, slug, generated.content_md,
        generated.summary, body.subject ?? null,
        body.level ?? 'beginner', body.language ?? 'vi',
        factResult.truth_score >= 70 ? 1 : 0,
        factResult.truth_score,
        JSON.stringify(generated.sources),
        JSON.stringify(generated.key_concepts),
        hash,
      ).run()

      return J({
        ok: true,
        lessonId:    id,
        slug,
        contentHash: hash,
        lesson:      generated,
        factCheck:   factResult,
        readyToPublish: factResult.truth_score >= 70,
      }, 201)

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'AI generation failed'
      return J({ ok: false, error: msg }, 500)
    }
  }

  // ── GET /v1/lessons/:slug ─────────────────────────────────
  const match = path.match(/^\/v1\/lessons\/([a-z0-9-]+)$/)
  if (match && request.method === 'GET') {
    const lesson = await env.DB.prepare(`
      SELECT l.*, u.handle, u.name
      FROM lessons l
      LEFT JOIN users u ON u.id = l.author_id
      WHERE l.slug = ? AND l.status = 'published'
    `).bind(match[1]).first()

    if (!lesson) return J({ ok: false, error: 'Lesson not found' }, 404)
    await env.DB.prepare('UPDATE lessons SET view_count = view_count + 1 WHERE slug = ?').bind(match[1]).run()
    return J({ ok: true, lesson })
  }

  // ── POST /v1/lessons/:id/publish ─────────────────────────
  const pubMatch = path.match(/^\/v1\/lessons\/([a-z0-9-]+)\/publish$/)
  if (pubMatch && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const lesson = await env.DB.prepare('SELECT * FROM lessons WHERE id = ? AND author_id = ?')
      .bind(pubMatch[1], user.id).first<{ fact_verified: number }>()
    if (!lesson) return J({ ok: false, error: 'Lesson not found or not yours' }, 404)
    if (!lesson.fact_verified) return J({ ok: false, error: 'BLOCKED: Cannot publish without fact verification' }, 403)

    await env.DB.prepare(
      "UPDATE lessons SET status = 'published', published_at = datetime('now') WHERE id = ?"
    ).bind(pubMatch[1]).run()

    return J({ ok: true, message: 'Lesson published!' })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

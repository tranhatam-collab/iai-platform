// ═══════════════════════════════════════════════════════════════
//  /v1/admin — Admin-only operations
//  Auth: X-IAI-Secret header must match IAI_ADMIN_SECRET env
//  Never expose these endpoints publicly
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { hashPassword, signJWT } from '../lib/auth'
import type { Bindings } from '../types'

const EXP_30D = 30 * 24 * 60 * 60

function guard(request: Request, env: Bindings): boolean {
  const secret = request.headers.get('X-IAI-Secret')
  return !!secret && !!env.IAI_ADMIN_SECRET && secret === env.IAI_ADMIN_SECRET
}

export async function handleAdmin(
  request: Request,
  env: Bindings,
  path: string,
): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  if (!guard(request, env))
    return J({ ok: false, error: 'Forbidden' }, 403)

  // ── POST /v1/admin/reset-password ────────────────────────────
  // Body: { identifier: string (email or handle), password: string }
  if (path === '/v1/admin/reset-password' && request.method === 'POST') {
    let body: { identifier?: string; password?: string }
    try { body = await request.json() } catch {
      return J({ ok: false, error: 'Invalid JSON' }, 400)
    }

    const { identifier, password } = body
    if (!identifier || !password)
      return J({ ok: false, error: 'identifier and password required' }, 400)
    if (password.length < 8)
      return J({ ok: false, error: 'Password must be at least 8 characters' }, 400)

    const user = await env.DB.prepare(
      'SELECT id, handle, name, email FROM users WHERE email = ? OR handle = ?'
    ).bind(identifier.toLowerCase(), identifier.toLowerCase()).first<{
      id: string; handle: string; name: string; email: string
    }>()

    if (!user) return J({ ok: false, error: 'User not found' }, 404)

    const hash = await hashPassword(password)
    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?'
    ).bind(hash, user.id).run()

    return J({ ok: true, message: `Password reset for @${user.handle} (${user.email})` })
  }

  // ── POST /v1/admin/create-user ───────────────────────────────
  // Body: { handle, name, email, password, edu_level?, verified? }
  if (path === '/v1/admin/create-user' && request.method === 'POST') {
    let body: {
      handle?: string; name?: string; email?: string; password?: string
      edu_level?: string; verified?: number
    }
    try { body = await request.json() } catch {
      return J({ ok: false, error: 'Invalid JSON' }, 400)
    }

    const { handle, name, email, password, edu_level = 'learner', verified = 0 } = body
    if (!handle || !name || !email || !password)
      return J({ ok: false, error: 'handle, name, email, password required' }, 400)

    const exists = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR handle = ?'
    ).bind(email.toLowerCase(), handle.toLowerCase()).first()
    if (exists) return J({ ok: false, error: 'Email or handle already taken' }, 409)

    const id   = crypto.randomUUID()
    const hash = await hashPassword(password)

    await env.DB.prepare(`
      INSERT INTO users (id, handle, name, email, password_hash, edu_level, verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(id, handle.toLowerCase(), name, email.toLowerCase(), hash, edu_level, verified).run()

    const token = await signJWT(
      { sub: id, hdl: handle, exp: Math.floor(Date.now() / 1000) + EXP_30D },
      env.JWT_SECRET
    )

    return J({
      ok: true,
      token,
      user: { id, handle, name, email, edu_level, verified },
    }, 201)
  }

  // ── POST /v1/admin/verify-user ───────────────────────────────
  // Body: { identifier: string, level?: 1|2|3 }
  if (path === '/v1/admin/verify-user' && request.method === 'POST') {
    let body: { identifier?: string; level?: number }
    try { body = await request.json() } catch {
      return J({ ok: false, error: 'Invalid JSON' }, 400)
    }

    const { identifier, level = 1 } = body
    if (!identifier) return J({ ok: false, error: 'identifier required' }, 400)

    const result = await env.DB.prepare(
      'UPDATE users SET verified = ?, updated_at = datetime(\'now\') WHERE email = ? OR handle = ?'
    ).bind(level, identifier.toLowerCase(), identifier.toLowerCase()).run()

    if (result.meta.changes === 0) return J({ ok: false, error: 'User not found' }, 404)
    return J({ ok: true, message: `User @${identifier} verified at level ${level}` })
  }

  // ── GET /v1/admin/users ──────────────────────────────────────
  if (path === '/v1/admin/users' && request.method === 'GET') {
    const url    = new URL(request.url)
    const limit  = Math.min(Number(url.searchParams.get('limit') ?? 50), 200)
    const offset = Number(url.searchParams.get('offset') ?? 0)

    const rows = await env.DB.prepare(
      `SELECT id, handle, name, email, verified, trust_score, edu_level, reputation, created_at
       FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).bind(limit, offset).all()

    return J({ ok: true, users: rows.results, total: rows.results.length })
  }

  // ── POST /v1/admin/login-as ──────────────────────────────────
  // Returns a JWT for any user — for admin impersonation / testing
  if (path === '/v1/admin/login-as' && request.method === 'POST') {
    let body: { identifier?: string }
    try { body = await request.json() } catch {
      return J({ ok: false, error: 'Invalid JSON' }, 400)
    }

    const { identifier } = body
    if (!identifier) return J({ ok: false, error: 'identifier required' }, 400)

    const user = await env.DB.prepare(
      'SELECT id, handle, name, email, trust_score, edu_level FROM users WHERE email = ? OR handle = ?'
    ).bind(identifier.toLowerCase(), identifier.toLowerCase()).first<{
      id: string; handle: string; name: string; email: string; trust_score: number; edu_level: string
    }>()

    if (!user) return J({ ok: false, error: 'User not found' }, 404)

    const token = await signJWT(
      { sub: user.id, hdl: user.handle, exp: Math.floor(Date.now() / 1000) + EXP_30D },
      env.JWT_SECRET
    )

    return J({ ok: true, token, user })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

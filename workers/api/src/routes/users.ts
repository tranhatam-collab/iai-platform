// ═══════════════════════════════════════════════════════════════
//  /v1/users — Register, Login, Profile
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { hashPassword, verifyPassword, signJWT, requireAuth } from '../lib/auth'
import type { Bindings } from '../types'

const EXP_7D = 7 * 24 * 60 * 60  // 7 days in seconds

export async function handleUsers(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  // ── POST /v1/users/register ───────────────────────────────
  if (path === '/v1/users/register' && request.method === 'POST') {
    let body: { handle?: string; name?: string; email?: string; password?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { handle, name, email, password } = body
    if (!handle || !name || !email || !password)
      return J({ ok: false, error: 'handle, name, email, password required' }, 400)

    if (password.length < 8)
      return J({ ok: false, error: 'Password must be at least 8 characters' }, 400)

    const exists = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR handle = ?'
    ).bind(email, handle).first()
    if (exists) return J({ ok: false, error: 'Email or handle already taken' }, 409)

    const id   = crypto.randomUUID()
    const hash = await hashPassword(password)

    await env.DB.prepare(`
      INSERT INTO users (id, handle, name, email, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(id, handle.toLowerCase(), name, email.toLowerCase(), hash).run()

    const token = await signJWT(
      { sub: id, hdl: handle, exp: Math.floor(Date.now() / 1000) + EXP_7D },
      env.JWT_SECRET
    )

    return J({ ok: true, token, user: { id, handle, name, email } }, 201)
  }

  // ── POST /v1/users/login ──────────────────────────────────
  if (path === '/v1/users/login' && request.method === 'POST') {
    let body: { email?: string; password?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { email, password } = body
    if (!email || !password) return J({ ok: false, error: 'email and password required' }, 400)

    const user = await env.DB.prepare(
      'SELECT id, handle, name, email, password_hash, trust_score FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first<{ id: string; handle: string; name: string; email: string; password_hash: string; trust_score: number }>()

    if (!user || !(await verifyPassword(password, user.password_hash)))
      return J({ ok: false, error: 'Invalid email or password' }, 401)

    const token = await signJWT(
      { sub: user.id, hdl: user.handle, exp: Math.floor(Date.now() / 1000) + EXP_7D },
      env.JWT_SECRET
    )

    return J({
      ok: true,
      token,
      user: { id: user.id, handle: user.handle, name: user.name, email: user.email, trust_score: user.trust_score },
    })
  }

  // ── GET /v1/users/me ──────────────────────────────────────
  if (path === '/v1/users/me' && request.method === 'GET') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)
    return J({ ok: true, user })
  }

  // ── GET /v1/users/:handle ─────────────────────────────────
  const profileMatch = path.match(/^\/v1\/users\/([a-z0-9_.-]+)$/)
  if (profileMatch && request.method === 'GET') {
    const handle = profileMatch[1]
    const user = await env.DB.prepare(
      'SELECT id, handle, name, bio, avatar_url, trust_score, edu_level, reputation, wallet_address, created_at FROM users WHERE handle = ?'
    ).bind(handle).first()
    if (!user) return J({ ok: false, error: 'User not found' }, 404)
    return J({ ok: true, user })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

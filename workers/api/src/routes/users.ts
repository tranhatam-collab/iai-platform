// ═══════════════════════════════════════════════════════════════
//  /v1/users — Register (email+handle), Login, Email Verify, Profile
//  Auth cookie: domain=.iai.one (shared across all subdomains)
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { hashPassword, verifyPassword, signJWT, requireAuth } from '../lib/auth'
import { sendEmail, emailEnv, verifyEmailHtml, welcomeEmailHtml } from '../lib/email'
import type { Bindings } from '../types'

const EXP_7D  = 7  * 24 * 60 * 60
const EXP_30D = 30 * 24 * 60 * 60

// ── Set cross-domain auth cookie ──────────────────────────────
function authCookie(token: string, maxAge = EXP_7D): string {
  return [
    `iai_token=${token}`,
    'Domain=.iai.one',
    'Path=/',
    'Secure',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAge}`,
  ].join('; ')
}

function clearCookie(): string {
  return 'iai_token=; Domain=.iai.one; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=0'
}

// ── JSON helper that also sets cookie ────────────────────────
function jsonWithCookie(
  data: unknown,
  token: string | null,
  status: number,
  origin: string | null,
  allowed: string,
): Response {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin ?? '*',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  }
  if (token) headers['Set-Cookie'] = authCookie(token)
  return new Response(JSON.stringify(data), { status, headers })
}

export async function handleUsers(
  request: Request, env: Bindings, path: string,
): Promise<Response> {
  const origin  = request.headers.get('Origin')
  const appUrl  = env.APP_URL ?? 'https://app.iai.one'
  const apiUrl  = env.SELF_URL ?? 'https://api.iai.one'
  const J       = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)
  const JC      = (d: unknown, token: string | null, s = 200) =>
    jsonWithCookie(d, token, s, origin, env.ALLOWED_ORIGINS ?? '*')

  // ── POST /v1/users/register ───────────────────────────────
  // Body: { handle, email, name? }
  // Creates unverified account, sends verification email
  if (path === '/v1/users/register' && request.method === 'POST') {
    let body: { handle?: string; name?: string; email?: string; password?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { handle, email } = body
    const name = body.name?.trim() || handle  // name falls back to handle if omitted

    if (!handle || !email)
      return J({ ok: false, error: 'handle và email là bắt buộc' }, 400)

    if (!/^[a-z0-9_.-]{3,30}$/.test(handle.toLowerCase()))
      return J({ ok: false, error: 'Handle chỉ được dùng a-z, 0-9, _, . (3-30 ký tự)' }, 400)

    const exists = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ? OR handle = ?'
    ).bind(email.toLowerCase(), handle.toLowerCase()).first()
    if (exists) return J({ ok: false, error: 'Email hoặc handle đã tồn tại' }, 409)

    const id   = crypto.randomUUID()
    const hash = body.password ? await hashPassword(body.password) : ''

    await env.DB.prepare(`
      INSERT INTO users (id, handle, name, email, password_hash, edu_level, verified, trust_score, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'learner', 0, 50, datetime('now'), datetime('now'))
    `).bind(id, handle.toLowerCase(), name, email.toLowerCase(), hash).run()

    // Send verification email if email service is configured
    const eEnv = emailEnv(env)
    if (eEnv.MAIL_API_URL || eEnv.RESEND_API_KEY) {
      const verifyToken = crypto.randomUUID()
      await env.CACHE.put(`verify_email:${verifyToken}`, id, { expirationTtl: 86400 }) // 24h

      const link = `${apiUrl}/v1/users/verify-email?token=${verifyToken}`
      try {
        await sendEmail({
          from:    'IAI <noreply@iai.one>',
          to:      email,
          subject: 'Xác nhận email — IAI',
          html:    verifyEmailHtml({ name: name!, handle: handle.toLowerCase(), link }),
        }, eEnv)
      } catch (e) {
        console.error('[Email]', e)
        // Don't block registration if email fails
      }

      return J({
        ok:      true,
        pending: true,
        message: 'Tài khoản tạo thành công. Vui lòng kiểm tra email để xác nhận.',
      }, 201)
    }

    // No email service → auto-verify and return JWT (dev mode)
    await env.DB.prepare("UPDATE users SET verified=1 WHERE id=?").bind(id).run()
    const jwtToken = await signJWT(
      { sub: id, hdl: handle.toLowerCase(), exp: Math.floor(Date.now() / 1000) + EXP_7D },
      env.JWT_SECRET,
    )
    return JC({
      ok: true, token: jwtToken,
      user: { id, handle: handle.toLowerCase(), name, email: email.toLowerCase(), trust_score: 50, edu_level: 'learner' },
    }, jwtToken, 201)
  }

  // ── GET /v1/users/verify-email?token=xxx ─────────────────
  if (path === '/v1/users/verify-email' && request.method === 'GET') {
    const url   = new URL(request.url)
    const token = url.searchParams.get('token')
    if (!token) return Response.redirect(`${appUrl}/login?error=missing_token`)

    const userId = await env.CACHE.get(`verify_email:${token}`)
    if (!userId) return Response.redirect(`${appUrl}/login?error=invalid_or_expired_token`)

    await env.CACHE.delete(`verify_email:${token}`)
    await env.DB.prepare("UPDATE users SET verified=1, updated_at=datetime('now') WHERE id=?").bind(userId).run()

    const user = await env.DB.prepare(
      'SELECT id, handle, name, email, trust_score, edu_level FROM users WHERE id=?'
    ).bind(userId).first<{ id: string; handle: string; name: string; email: string; trust_score: number; edu_level: string }>()

    if (!user) return Response.redirect(`${appUrl}/login?error=user_not_found`)

    // Send welcome email (fire-and-forget)
    sendEmail({
      from:    'IAI <noreply@iai.one>',
      to:      user.email,
      subject: 'Chào mừng tới IAI!',
      html:    welcomeEmailHtml({ name: user.name, handle: user.handle, appUrl }),
    }, emailEnv(env)).catch(e => console.error('[Email welcome]', e))

    const jwt = await signJWT(
      { sub: user.id, hdl: user.handle, exp: Math.floor(Date.now() / 1000) + EXP_7D },
      env.JWT_SECRET,
    )

    // Encode user for frontend
    const userB64 = btoa(encodeURIComponent(JSON.stringify(user)))

    // Redirect to app with token + set .iai.one cookie
    const res = Response.redirect(`${appUrl}/auth/callback?token=${jwt}&user=${userB64}&verified=1`)
    const r   = new Response(res.body, res)
    r.headers.set('Set-Cookie', authCookie(jwt))
    return r
  }

  // ── POST /v1/users/login ──────────────────────────────────
  if (path === '/v1/users/login' && request.method === 'POST') {
    let body: { email?: string; password?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { email, password } = body
    if (!email || !password) return J({ ok: false, error: 'email và password là bắt buộc' }, 400)

    const user = await env.DB.prepare(
      'SELECT id, handle, name, email, password_hash, trust_score, edu_level, verified FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first<{
      id: string; handle: string; name: string; email: string
      password_hash: string; trust_score: number; edu_level: string; verified: number
    }>()

    if (!user || !user.password_hash)
      return J({ ok: false, error: 'Email hoặc mật khẩu không đúng' }, 401)

    if (!(await verifyPassword(password, user.password_hash)))
      return J({ ok: false, error: 'Email hoặc mật khẩu không đúng' }, 401)

    if (!user.verified)
      return J({ ok: false, error: 'Vui lòng xác nhận email trước khi đăng nhập', code: 'email_not_verified' }, 403)

    const token = await signJWT(
      { sub: user.id, hdl: user.handle, exp: Math.floor(Date.now() / 1000) + EXP_7D },
      env.JWT_SECRET,
    )

    return JC({
      ok: true, token,
      user: { id: user.id, handle: user.handle, name: user.name, email: user.email, trust_score: user.trust_score, edu_level: user.edu_level },
    }, token)
  }

  // ── POST /v1/users/logout ─────────────────────────────────
  if (path === '/v1/users/logout' && request.method === 'POST') {
    return new Response(JSON.stringify({ ok: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': clearCookie(),
        'Access-Control-Allow-Origin': origin ?? '*',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  // ── POST /v1/users/resend-verification ───────────────────
  if (path === '/v1/users/resend-verification' && request.method === 'POST') {
    let body: { email?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const user = await env.DB.prepare(
      'SELECT id, handle, name, email, verified FROM users WHERE email=?'
    ).bind(body.email?.toLowerCase()).first<{ id: string; handle: string; name: string; email: string; verified: number }>()

    const eEnv2 = emailEnv(env)
    // Always return OK to prevent email enumeration
    if (!user || user.verified || (!eEnv2.MAIL_API_URL && !eEnv2.RESEND_API_KEY))
      return J({ ok: true, message: 'Nếu email tồn tại và chưa xác nhận, chúng tôi sẽ gửi lại.' })

    const token = crypto.randomUUID()
    await env.CACHE.put(`verify_email:${token}`, user.id, { expirationTtl: 86400 })
    const link = `${apiUrl}/v1/users/verify-email?token=${token}`

    sendEmail({
      from:    'IAI <noreply@iai.one>',
      to:      user.email,
      subject: 'Xác nhận email — IAI',
      html:    verifyEmailHtml({ name: user.name, handle: user.handle, link }),
    }, eEnv2).catch(e => console.error('[Email resend]', e))

    return J({ ok: true, message: 'Email xác nhận đã được gửi lại.' })
  }

  // ── GET /v1/users/me ──────────────────────────────────────
  if (path === '/v1/users/me' && request.method === 'GET') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)
    return J({ ok: true, user })
  }

  // ── GET /v1/users/:handle ─────────────────────────────────
  const profileMatch = path.match(/^\/v1\/users\/([a-z0-9_.‐]+)$/)
  if (profileMatch && request.method === 'GET') {
    const handle = profileMatch[1]
    const user = await env.DB.prepare(
      'SELECT id, handle, name, bio, avatar_url, trust_score, edu_level, reputation, wallet_address, created_at FROM users WHERE handle = ?'
    ).bind(handle).first()
    if (!user) return J({ ok: false, error: 'Không tìm thấy người dùng' }, 404)
    return J({ ok: true, user })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

// ═══════════════════════════════════════════════════════════════
//  /v1/auth — Social OAuth (Google, Facebook, X/Twitter, Apple)
//  Flow: GET /v1/auth/:provider → redirect → callback → JWT
// ═══════════════════════════════════════════════════════════════

import { signJWT } from '../lib/auth'
import type { Bindings } from '../types'

const EXP_7D = 7 * 24 * 60 * 60

// ── Provider configs ─────────────────────────────────────────────
function getConfig(provider: string, env: Bindings) {
  const base = env.APP_URL ?? 'https://app.iai.one'
  const api  = env.SELF_URL ?? 'https://api.iai.one'
  const cb   = `${api}/v1/auth/${provider}/callback`

  switch (provider) {
    case 'google':
      return {
        authUrl:     'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl:    'https://oauth2.googleapis.com/token',
        profileUrl:  'https://www.googleapis.com/oauth2/v2/userinfo',
        clientId:    env.GOOGLE_CLIENT_ID,
        secret:      env.GOOGLE_CLIENT_SECRET,
        scope:       'email profile',
        callback:    cb,
        appUrl:      base,
      }
    case 'facebook':
      return {
        authUrl:     'https://www.facebook.com/v19.0/dialog/oauth',
        tokenUrl:    'https://graph.facebook.com/v19.0/oauth/access_token',
        profileUrl:  'https://graph.facebook.com/me?fields=id,name,email,picture.width(200)',
        clientId:    env.FACEBOOK_APP_ID,
        secret:      env.FACEBOOK_APP_SECRET,
        scope:       'email,public_profile',
        callback:    cb,
        appUrl:      base,
      }
    case 'x':
      return {
        authUrl:     'https://twitter.com/i/oauth2/authorize',
        tokenUrl:    'https://api.twitter.com/2/oauth2/token',
        profileUrl:  'https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username',
        clientId:    env.X_CLIENT_ID,
        secret:      env.X_CLIENT_SECRET,
        scope:       'tweet.read users.read offline.access',
        callback:    cb,
        appUrl:      base,
      }
    default:
      return null
  }
}

// ── PKCE helpers (for X OAuth 2.0) ───────────────────────────────
async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  const verifier = btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  return { verifier, challenge }
}

// ── Build handle from name ────────────────────────────────────────
function toHandle(name: string, suffix: string): string {
  return name.toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 20)
    + '_' + suffix.slice(0, 6)
}

// ── Upsert social user → return JWT ──────────────────────────────
async function upsertUser(env: Bindings, opts: {
  provider: string
  providerUserId: string
  email: string
  name: string
  avatarUrl?: string
}): Promise<{ token: string; user: Record<string, unknown> }> {
  const { provider, providerUserId, email, name, avatarUrl } = opts

  // 1. Find by email first
  let user = await env.DB.prepare(
    'SELECT id, handle, name, email, trust_score, edu_level FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first<{ id: string; handle: string; name: string; email: string; trust_score: number; edu_level: string }>()

  if (!user) {
    // 2. Create new user
    const id     = crypto.randomUUID()
    const handle = toHandle(name, id)

    await env.DB.prepare(`
      INSERT INTO users (id, handle, name, email, password_hash, avatar_url, edu_level, verified, trust_score, created_at, updated_at)
      VALUES (?, ?, ?, ?, '', ?, 'learner', 1, 50, datetime('now'), datetime('now'))
    `).bind(id, handle, name, email.toLowerCase(), avatarUrl ?? null).run()

    user = { id, handle, name, email: email.toLowerCase(), trust_score: 50, edu_level: 'learner' }
  } else {
    // 3. Update avatar if provided
    if (avatarUrl) {
      await env.DB.prepare(
        "UPDATE users SET avatar_url=?, updated_at=datetime('now') WHERE id=?"
      ).bind(avatarUrl, user.id).run()
    }
  }

  const token = await signJWT(
    { sub: user.id, hdl: user.handle, exp: Math.floor(Date.now() / 1000) + EXP_7D },
    env.JWT_SECRET,
  )

  return { token, user }
}

// ── Main handler ─────────────────────────────────────────────────
export async function handleSocialAuth(
  request: Request, env: Bindings, path: string,
): Promise<Response> {

  // GET /v1/auth/:provider — initiate OAuth
  const initMatch = path.match(/^\/v1\/auth\/(google|facebook|x)$/)
  if (initMatch && request.method === 'GET') {
    const provider = initMatch[1]
    const cfg = getConfig(provider, env)

    if (!cfg || !cfg.clientId) {
      return Response.redirect(`${env.APP_URL ?? 'https://app.iai.one'}/login?error=provider_not_configured`)
    }

    // state = random token, store in KV for 10 min (CSRF protection)
    const state = crypto.randomUUID()
    await env.CACHE.put(`oauth_state:${state}`, '1', { expirationTtl: 600 })

    const params = new URLSearchParams({
      client_id:     cfg.clientId,
      redirect_uri:  cfg.callback,
      scope:         cfg.scope,
      response_type: 'code',
      state,
    })

    // X requires PKCE
    if (provider === 'x') {
      const { verifier, challenge } = await generatePKCE()
      await env.CACHE.put(`pkce:${state}`, verifier, { expirationTtl: 600 })
      params.set('code_challenge', challenge)
      params.set('code_challenge_method', 'S256')
    }

    return Response.redirect(`${cfg.authUrl}?${params}`)
  }

  // GET /v1/auth/:provider/callback — handle OAuth callback
  const cbMatch = path.match(/^\/v1\/auth\/(google|facebook|x)\/callback$/)
  if (cbMatch && request.method === 'GET') {
    const provider = cbMatch[1]
    const cfg = getConfig(provider, env)
    const url = new URL(request.url)
    const code  = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const appUrl = env.APP_URL ?? 'https://app.iai.one'

    if (!code || !state || !cfg) {
      return Response.redirect(`${appUrl}/login?error=oauth_failed`)
    }

    // Verify state (CSRF check)
    const validState = await env.CACHE.get(`oauth_state:${state}`)
    if (!validState) return Response.redirect(`${appUrl}/login?error=invalid_state`)
    await env.CACHE.delete(`oauth_state:${state}`)

    try {
      // Exchange code for access token
      const tokenBody: Record<string, string> = {
        grant_type:   'authorization_code',
        code,
        redirect_uri: cfg.callback,
        client_id:    cfg.clientId ?? '',
        client_secret: cfg.secret ?? '',
      }

      // X needs PKCE verifier
      if (provider === 'x') {
        const verifier = await env.CACHE.get(`pkce:${state}`)
        if (verifier) {
          tokenBody['code_verifier'] = verifier
          await env.CACHE.delete(`pkce:${state}`)
        }
      }

      const tokenRes = await fetch(cfg.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // X requires Basic auth
          ...(provider === 'x' ? {
            Authorization: `Basic ${btoa(`${cfg.clientId}:${cfg.secret}`)}`,
          } : {}),
        },
        body: new URLSearchParams(tokenBody),
      })

      const tokenData = await tokenRes.json() as { access_token?: string; error?: string }
      if (!tokenData.access_token) {
        return Response.redirect(`${appUrl}/login?error=token_failed`)
      }

      // Get user profile
      const profileRes = await fetch(cfg.profileUrl, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const profile = await profileRes.json() as Record<string, unknown>

      // Normalize profile per provider
      let email = '', name = '', avatarUrl = '', providerUserId = ''

      if (provider === 'google') {
        email          = String(profile['email'] ?? '')
        name           = String(profile['name'] ?? '')
        avatarUrl      = String(profile['picture'] ?? '')
        providerUserId = String(profile['id'] ?? '')
      }
      if (provider === 'facebook') {
        email          = String(profile['email'] ?? '')
        name           = String(profile['name'] ?? '')
        const pic      = profile['picture'] as { data?: { url?: string } } | undefined
        avatarUrl      = pic?.data?.url ?? ''
        providerUserId = String(profile['id'] ?? '')
      }
      if (provider === 'x') {
        const xData    = profile['data'] as Record<string, unknown> ?? profile
        email          = `x_${xData['username']}@iai.social`  // X doesn't give email on free tier
        name           = String(xData['name'] ?? '')
        avatarUrl      = String(xData['profile_image_url'] ?? '')
        providerUserId = String(xData['id'] ?? '')
      }

      if (!email || !name) {
        return Response.redirect(`${appUrl}/login?error=missing_profile`)
      }

      const { token, user } = await upsertUser(env, { provider, providerUserId, email, name, avatarUrl })

      // Encode user as base64 JSON and redirect to frontend callback
      const userB64 = btoa(encodeURIComponent(JSON.stringify(user)))

      // Set cross-domain cookie (.iai.one covers all subdomains)
      const redirect = Response.redirect(`${appUrl}/auth/callback?token=${token}&user=${userB64}`)
      const res = new Response(redirect.body, redirect)
      res.headers.set('Set-Cookie', [
        `iai_token=${token}`,
        'Domain=.iai.one',
        'Path=/',
        'Secure',
        'HttpOnly',
        'SameSite=Lax',
        `Max-Age=${EXP_7D}`,
      ].join('; '))
      return res

    } catch (e) {
      console.error('[SocialAuth]', provider, e)
      return Response.redirect(`${appUrl}/login?error=oauth_error`)
    }
  }

  return new Response('Not found', { status: 404 })
}

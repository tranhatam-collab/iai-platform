// ═══════════════════════════════════════════════════════════════
//  IAI Auth — JWT helpers (Web Crypto, no node deps)
// ═══════════════════════════════════════════════════════════════

import type { JWTPayload, AuthUser, Bindings } from '../types'

const ALG = { name: 'HMAC', hash: 'SHA-256' } as const

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  return crypto.subtle.importKey('raw', enc.encode(secret), ALG, false, ['sign', 'verify'])
}

function b64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + (4 - s.length % 4) % 4, '=')
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

export async function signJWT(payload: Omit<JWTPayload, 'iat'>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const enc = new TextEncoder()
  const h = b64url(enc.encode(JSON.stringify(header)).buffer)
  const p = b64url(enc.encode(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) })).buffer)
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${h}.${p}`))
  return `${h}.${p}.${b64url(sig)}`
}

export async function verifyJWT(token: string, secret: string): Promise<JWTPayload | null> {
  try {
    const [h, p, s] = token.split('.')
    if (!h || !p || !s) return null
    const enc = new TextEncoder()
    const key = await getKey(secret)
    const ok = await crypto.subtle.verify('HMAC', key, b64urlDecode(s), enc.encode(`${h}.${p}`))
    if (!ok) return null
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(p))) as JWTPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch { return null }
}

export async function hashPassword(pw: string): Promise<string> {
  const enc = new TextEncoder()
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(pw + 'iai-salt-2025'))
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return (await hashPassword(pw)) === hash
}

export function contentHash(text: string): Promise<string> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join(''))
}

export async function requireAuth(request: Request, env: Bindings): Promise<AuthUser | null> {
  const auth = request.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const payload = await verifyJWT(token, env.JWT_SECRET)
  if (!payload) return null
  // Fetch user from DB
  const row = await env.DB.prepare(
    'SELECT id, handle, name, email, trust_score, edu_level FROM users WHERE id = ?'
  ).bind(payload.sub).first<AuthUser>()
  return row ?? null
}

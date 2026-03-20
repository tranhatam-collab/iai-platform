// ═══════════════════════════════════════════════════════════════
//  IAI API Worker — api.iai.one
//  Intelligence · Artistry · International
//  Stack: Cloudflare Workers + D1 + KV + R2 + Claude AI
// ═══════════════════════════════════════════════════════════════

import { json, handleOptions } from './lib/cors'
import { handleAdmin }       from './routes/admin'
import { handleVerify }      from './routes/verify'
import { handleUsers }       from './routes/users'
import { handlePosts }       from './routes/posts'
import { handleLessons }     from './routes/lessons'
import { handleCourses }     from './routes/courses'
import { handleMarketplace } from './routes/marketplace'
import { handleReviews }     from './routes/reviews'
import { handleCopyright }   from './routes/copyright'
import { handleMedia }       from './routes/media'
import { handleIpfs }        from './routes/ipfs'
import type { Bindings } from './types'

export default {
  async fetch(request: Request, env: Bindings): Promise<Response> {
    const url    = new URL(request.url)
    const path   = url.pathname
    const method = request.method
    const origin = request.headers.get('Origin')

    // ── CORS preflight ────────────────────────────────────
    const preflight = handleOptions(request, env.ALLOWED_ORIGINS ?? '*')
    if (preflight) return preflight

    // ── Health check ──────────────────────────────────────
    if (path === '/' || path === '/health') {
      return json({
        name:    'IAI API — Intelligence · Artistry · International',
        version: '1.0.0',
        status:  'ok',
        env:     env.IAI_ENV ?? 'unknown',
        ts:      new Date().toISOString(),
        routes: [
          'POST /v1/users/register',
          'POST /v1/users/login',
          'GET  /v1/users/me',
          'GET  /v1/posts',
          'POST /v1/posts',
          'POST /v1/verify/post',
          'POST /v1/verify/claim',
          'GET  /v1/lessons',
          'POST /v1/lessons/generate',
          'POST /v1/media/upload',
          'POST /v1/ipfs/pin',
        ],
      }, 200, origin, env.ALLOWED_ORIGINS)
    }

    // ── Route dispatcher ──────────────────────────────────
    try {
      if (path.startsWith('/v1/admin'))       return handleAdmin(request, env, path)
      if (path.startsWith('/v1/verify'))      return handleVerify(request, env, path)
      if (path.startsWith('/v1/users'))       return handleUsers(request, env, path)
      if (path.startsWith('/v1/posts'))       return handlePosts(request, env, path)
      if (path.startsWith('/v1/lessons'))     return handleLessons(request, env, path)
      if (path.startsWith('/v1/courses'))     return handleCourses(request, env, path)
      if (path.startsWith('/v1/marketplace')) return handleMarketplace(request, env, path)
      if (path.startsWith('/v1/reviews'))     return handleReviews(request, env, path)
      if (path.startsWith('/v1/copyright'))   return handleCopyright(request, env, path)
      if (path.startsWith('/v1/media'))       return handleMedia(request, env, path)
      if (path.startsWith('/v1/ipfs'))        return handleIpfs(request, env, path)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Internal server error'
      console.error('[IAI API]', method, path, msg)
      return json({ ok: false, error: msg }, 500, origin, env.ALLOWED_ORIGINS)
    }

    return json({ ok: false, error: 'Not found', path }, 404, origin, env.ALLOWED_ORIGINS)
  },
}

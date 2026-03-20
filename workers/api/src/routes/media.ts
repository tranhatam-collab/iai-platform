// ═══════════════════════════════════════════════════════════════
//  /v1/media — Upload to R2, serve from cdn.iai.one
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth } from '../lib/auth'
import type { Bindings } from '../types'

const ALLOWED_TYPES = ['image/jpeg','image/png','image/webp','image/gif','video/mp4','application/pdf']
const MAX_SIZE = 50 * 1024 * 1024  // 50MB

export async function handleMedia(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  // ── POST /v1/media/upload ─────────────────────────────────
  if (path === '/v1/media/upload' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const formData = await request.formData().catch(() => null)
    if (!formData) return J({ ok: false, error: 'Invalid form data' }, 400)

    const file = formData.get('file') as File | null
    if (!file) return J({ ok: false, error: 'file is required' }, 400)

    if (!ALLOWED_TYPES.includes(file.type))
      return J({ ok: false, error: `File type not allowed: ${file.type}` }, 400)
    if (file.size > MAX_SIZE)
      return J({ ok: false, error: 'File too large (max 50MB)' }, 400)

    const ext  = file.name.split('.').pop() ?? 'bin'
    const key  = `${user.id}/${Date.now()}-${crypto.randomUUID().slice(0,8)}.${ext}`
    const buf  = await file.arrayBuffer()

    await env.MEDIA.put(key, buf, {
      httpMetadata: { contentType: file.type },
      customMetadata: { uploadedBy: user.id, originalName: file.name },
    })

    const cdnUrl = `https://cdn.iai.one/${key}`
    return J({ ok: true, key, url: cdnUrl, size: file.size, type: file.type }, 201)
  }

  // ── DELETE /v1/media/:key ─────────────────────────────────
  const delMatch = path.match(/^\/v1\/media\/(.+)$/)
  if (delMatch && request.method === 'DELETE') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const key = decodeURIComponent(delMatch[1])
    if (!key.startsWith(user.id + '/'))
      return J({ ok: false, error: 'Not your file' }, 403)

    await env.MEDIA.delete(key)
    return J({ ok: true })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

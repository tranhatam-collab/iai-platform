// ═══════════════════════════════════════════════════════════════
//  /v1/ipfs — Pin content to IPFS via Pinata (Phase 3)
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth } from '../lib/auth'
import type { Bindings } from '../types'

export async function handleIpfs(request: Request, env: Bindings, path: string): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  if (path === '/v1/ipfs/pin' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    if (!env.PINATA_JWT) return J({ ok: false, error: 'IPFS not configured (Phase 3 feature)' }, 501)

    let body: { postId?: string; lessonId?: string; content?: string; contentHash?: string; score?: number }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    if (!body.content) return J({ ok: false, error: 'content required' }, 400)

    const pinataPayload = {
      pinataContent: {
        platform: 'iai.one',
        version:  '1.0',
        postId:   body.postId ?? null,
        lessonId: body.lessonId ?? null,
        content:  body.content,
        hash:     body.contentHash,
        score:    body.score,
        pinnedBy: user.handle,
        pinnedAt: new Date().toISOString(),
      },
      pinataMetadata: { name: `iai-${body.postId ?? body.lessonId ?? 'content'}-${Date.now()}` },
    }

    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.PINATA_JWT}` },
      body: JSON.stringify(pinataPayload),
    })

    if (!res.ok) return J({ ok: false, error: `Pinata error: ${res.status}` }, 500)

    const { IpfsHash } = await res.json() as { IpfsHash: string }

    // Update DB with IPFS CID
    if (body.postId) {
      await env.DB.prepare('UPDATE posts SET ipfs_cid = ? WHERE id = ?').bind(IpfsHash, body.postId).run()
    } else if (body.lessonId) {
      await env.DB.prepare('UPDATE lessons SET ipfs_cid = ? WHERE id = ?').bind(IpfsHash, body.lessonId).run()
    }

    return J({
      ok: true,
      ipfsCid:    IpfsHash,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
      ipfsUrl:    `ipfs://${IpfsHash}`,
    })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

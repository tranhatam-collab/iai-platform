// ═══════════════════════════════════════════════════════════════
//  IAI Web — API Client
//  Connects to api.iai.one (Cloudflare Workers)
// ═══════════════════════════════════════════════════════════════

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.iai.one'

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok && res.status === 401) {
    throw new Error('UNAUTHORIZED')
  }

  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (body: { handle: string; name: string; email: string; password: string }) =>
      request('/v1/users/register', { method: 'POST', body: JSON.stringify(body) }),

    login: (body: { email: string; password: string }) =>
      request('/v1/users/login', { method: 'POST', body: JSON.stringify(body) }),

    me: (token: string) =>
      request('/v1/users/me', {}, token),

    profile: (handle: string) =>
      request(`/v1/users/${handle}`),
  },

  posts: {
    list: (params?: { tab?: string; limit?: number; cursor?: string }) => {
      const q = new URLSearchParams()
      if (params?.tab)    q.set('tab', params.tab)
      if (params?.limit)  q.set('limit', String(params.limit))
      if (params?.cursor) q.set('cursor', params.cursor)
      return request(`/v1/posts?${q}`)
    },

    get: (id: string) => request(`/v1/posts/${id}`),

    create: (body: { content: string; type?: string; media_urls?: string[]; link_url?: string }, token: string) =>
      request('/v1/posts', { method: 'POST', body: JSON.stringify(body) }, token),

    like: (id: string, token: string) =>
      request(`/v1/posts/${id}/like`, { method: 'POST' }, token),
  },

  verify: {
    post: (body: { postId?: string; content: string }, token: string) =>
      request('/v1/verify/post', { method: 'POST', body: JSON.stringify(body) }, token),

    claim: (claim: string, token: string) =>
      request('/v1/verify/claim', { method: 'POST', body: JSON.stringify({ claim }) }, token),
  },

  lessons: {
    list: (params?: { subject?: string; level?: string; limit?: number }) => {
      const q = new URLSearchParams()
      if (params?.subject) q.set('subject', params.subject)
      if (params?.level)   q.set('level', params.level)
      if (params?.limit)   q.set('limit', String(params.limit))
      return request(`/v1/lessons?${q}`)
    },

    get: (slug: string) => request(`/v1/lessons/${slug}`),

    generate: (body: { topic: string; level?: string; language?: string; subject?: string }, token: string) =>
      request('/v1/lessons/generate', { method: 'POST', body: JSON.stringify(body) }, token),

    publish: (id: string, token: string) =>
      request(`/v1/lessons/${id}/publish`, { method: 'POST' }, token),
  },

  media: {
    upload: (file: File, token: string) => {
      const form = new FormData()
      form.append('file', file)
      return fetch(`${API_BASE}/v1/media/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }).then(r => r.json())
    },
  },
}

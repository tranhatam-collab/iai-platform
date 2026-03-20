// IAI CORS helper

export function corsHeaders(origin: string | null, allowedOrigins: string): HeadersInit {
  const allowed = allowedOrigins.split(',').map(o => o.trim())
  const isAllowed = origin && (allowed.includes(origin) || allowed.includes('*'))
  return {
    'Access-Control-Allow-Origin':  isAllowed ? origin! : '',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-IAI-Secret',
    'Access-Control-Max-Age':       '86400',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export function handleOptions(request: Request, allowedOrigins: string): Response | null {
  if (request.method !== 'OPTIONS') return null
  const origin = request.headers.get('Origin')
  return new Response(null, { status: 204, headers: corsHeaders(origin, allowedOrigins) })
}

export function json(data: unknown, status = 200, origin: string | null = null, allowedOrigins = '*'): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      ...corsHeaders(origin, allowedOrigins),
    },
  })
}

// ═══════════════════════════════════════════════════════════════
//  /v1/payment — Stripe Checkout + Webhook auto-complete
//  Keys: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET (wrangler secrets)
// ═══════════════════════════════════════════════════════════════

import { json } from '../lib/cors'
import { requireAuth } from '../lib/auth'
import type { Bindings } from '../types'

const STRIPE = 'https://api.stripe.com/v1'

async function stripe(
  method: string,
  path: string,
  secretKey: string,
  body?: Record<string, string | number | undefined>,
): Promise<unknown> {
  const init: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  if (body && method !== 'GET') {
    init.body = Object.entries(body)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
  }
  const res = await fetch(`${STRIPE}${path}`, init)
  return res.json()
}

async function verifyStripeSignature(
  payload: string,
  header: string,
  secret: string,
): Promise<boolean> {
  try {
    const parts = Object.fromEntries(header.split(',').map(p => p.split('=')))
    const ts = parts['t']
    const sig = parts['v1']
    if (!ts || !sig) return false

    const signed = `${ts}.${payload}`
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signed))
    const expected = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('')
    return expected === sig
  } catch { return false }
}

export async function handlePayment(
  request: Request, env: Bindings, path: string,
): Promise<Response> {
  const origin = request.headers.get('Origin')
  const J = (d: unknown, s = 200) => json(d, s, origin, env.ALLOWED_ORIGINS)

  // ── POST /v1/payment/checkout — create Stripe Checkout session ─
  if (path === '/v1/payment/checkout' && request.method === 'POST') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)
    if (!env.STRIPE_SECRET_KEY) return J({ ok: false, error: 'Payment not configured' }, 503)

    let body: { course_id?: string; document_id?: string }
    try { body = await request.json() } catch { return J({ ok: false, error: 'Invalid JSON' }, 400) }

    const { course_id, document_id } = body
    if (!course_id && !document_id) return J({ ok: false, error: 'course_id or document_id required' }, 400)

    // Get item details
    let item: { title: string; price: number; thumbnail_url?: string } | null = null
    if (course_id) {
      item = await env.DB.prepare(
        "SELECT title, price, thumbnail_url FROM courses WHERE id = ? AND status = 'published'"
      ).bind(course_id).first()
    }
    if (document_id) {
      item = await env.DB.prepare(
        "SELECT title, price, thumbnail_url FROM documents WHERE id = ? AND status = 'published'"
      ).bind(document_id).first()
    }
    if (!item) return J({ ok: false, error: 'Item not found' }, 404)
    if (item.price === 0) return J({ ok: false, error: 'Nội dung này miễn phí — không cần thanh toán' }, 400)

    // Check already purchased
    const existing = await env.DB.prepare(
      "SELECT id FROM purchases WHERE user_id=? AND course_id=? AND document_id=? AND status='completed'"
    ).bind(user.id, course_id ?? null, document_id ?? null).first()
    if (existing) return J({ ok: false, error: 'Bạn đã mua nội dung này rồi' }, 409)

    // Create pending purchase record first
    const purchaseId = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO purchases (id, user_id, course_id, document_id, amount, payment_method, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'stripe', 'pending', datetime('now'))
    `).bind(purchaseId, user.id, course_id ?? null, document_id ?? null, item.price).run()

    // Create Stripe Checkout Session
    const appUrl = env.APP_URL ?? 'https://app.iai.one'
    const session = await stripe('POST', '/checkout/sessions', env.STRIPE_SECRET_KEY, {
      'payment_method_types[0]':              'card',
      'line_items[0][price_data][currency]':  'vnd',
      'line_items[0][price_data][unit_amount]': item.price,
      'line_items[0][price_data][product_data][name]': item.title,
      'line_items[0][price_data][product_data][images][0]': item.thumbnail_url,
      'line_items[0][quantity]':              '1',
      'mode':                                 'payment',
      'success_url':                          `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url':                           `${appUrl}/payment/cancel`,
      'metadata[purchase_id]':                purchaseId,
      'metadata[user_id]':                    user.id,
      'metadata[course_id]':                  course_id,
      'metadata[document_id]':                document_id,
      'customer_email':                       user.email,
    }) as { id?: string; url?: string; error?: { message: string } }

    if (!session.id || !session.url) {
      return J({ ok: false, error: session.error?.message ?? 'Stripe error' }, 500)
    }

    // Store session ID on purchase
    await env.DB.prepare(
      "UPDATE purchases SET payment_ref=? WHERE id=?"
    ).bind(session.id, purchaseId).run()

    return J({ ok: true, checkout_url: session.url, session_id: session.id })
  }

  // ── POST /v1/payment/webhook — Stripe auto-complete ──────────
  if (path === '/v1/payment/webhook' && request.method === 'POST') {
    const sig = request.headers.get('stripe-signature')
    if (!sig || !env.STRIPE_WEBHOOK_SECRET)
      return new Response('Missing signature', { status: 400 })

    const payload = await request.text()
    const valid = await verifyStripeSignature(payload, sig, env.STRIPE_WEBHOOK_SECRET)
    if (!valid) return new Response('Invalid signature', { status: 400 })

    const event = JSON.parse(payload) as {
      type: string
      data: { object: { metadata?: Record<string, string>; payment_status?: string } }
    }

    if (event.type === 'checkout.session.completed') {
      const meta = event.data.object.metadata ?? {}
      const purchaseId = meta['purchase_id']
      const courseId   = meta['course_id']
      const documentId = meta['document_id']

      if (purchaseId) {
        await env.DB.prepare(
          "UPDATE purchases SET status='completed', completed_at=datetime('now') WHERE id=?"
        ).bind(purchaseId).run()

        if (courseId)
          await env.DB.prepare('UPDATE courses SET student_count=student_count+1 WHERE id=?').bind(courseId).run()
        if (documentId)
          await env.DB.prepare('UPDATE documents SET download_count=download_count+1 WHERE id=?').bind(documentId).run()
      }
    }

    return new Response('ok', { status: 200 })
  }

  // ── GET /v1/payment/verify/:sessionId — check payment status ─
  const verifyMatch = path.match(/^\/v1\/payment\/verify\/(.+)$/)
  if (verifyMatch && request.method === 'GET') {
    const user = await requireAuth(request, env)
    if (!user) return J({ ok: false, error: 'Unauthorized' }, 401)

    const purchase = await env.DB.prepare(
      "SELECT id, status, course_id, document_id FROM purchases WHERE payment_ref=? AND user_id=?"
    ).bind(verifyMatch[1], user.id).first<{
      id: string; status: string; course_id: string | null; document_id: string | null
    }>()

    if (!purchase) return J({ ok: false, error: 'Purchase not found' }, 404)
    return J({ ok: true, status: purchase.status, purchase })
  }

  return J({ ok: false, error: 'Not found' }, 404)
}

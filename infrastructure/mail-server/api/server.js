// ═══════════════════════════════════════════════════════════════
//  IAI Mail API — Self-hosted email sending service
//  Compatible with Resend API interface
//  POST /emails  → send email via Mailcow SMTP
//  GET  /health  → status check
//
//  Auth: Authorization: Bearer {IAI_API_KEY}
// ═══════════════════════════════════════════════════════════════

require('dotenv').config()
const express    = require('express')
const nodemailer = require('nodemailer')

const app  = express()
app.use(express.json({ limit: '5mb' }))
const MAIL_DOCS_URL = process.env.MAIL_DOCS_URL ?? 'https://docs.iai.one/mail/'

// ── SMTP transport (connects to local Mailcow) ───────────────
let transporter = null

function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST ?? 'localhost',
      port:   Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false }, // allow self-signed for localhost
    })
  }
  return transporter
}

// ── Auth middleware ───────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers['authorization'] ?? ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token || token !== process.env.IAI_API_KEY) {
    return res.status(401).json({ name: 'Unauthorized', message: 'Invalid API key' })
  }
  next()
}

// ── Rate limiting (simple in-memory) ─────────────────────────
const rateMap = new Map()
function rateLimit(req, res, next) {
  const ip  = req.ip
  const now = Date.now()
  const key = `${ip}:${Math.floor(now / 60000)}`  // per-minute window
  const count = (rateMap.get(key) ?? 0) + 1
  rateMap.set(key, count)
  // Clean old keys every 100 requests
  if (rateMap.size > 1000) {
    const cutoff = Math.floor(now / 60000) - 2
    for (const k of rateMap.keys()) {
      if (Number(k.split(':')[1]) < cutoff) rateMap.delete(k)
    }
  }
  if (count > 60) {
    return res.status(429).json({ name: 'too_many_requests', message: 'Rate limit: 60 emails/minute per IP' })
  }
  next()
}

// ── POST /emails — Send email (Resend-compatible) ─────────────
// Body: { from, to, subject, html, text?, reply_to?, bcc?, cc? }
app.post('/emails', auth, rateLimit, async (req, res) => {
  const { from, to, subject, html, text, reply_to, bcc, cc, attachments } = req.body

  if (!from || !to || !subject || (!html && !text)) {
    return res.status(422).json({
      name: 'missing_required_field',
      message: 'from, to, subject, and html or text are required',
    })
  }

  // Validate from domain is allowed (security: prevent relay abuse)
  const allowedDomains = (process.env.ALLOWED_FROM_DOMAINS ?? 'iai.one').split(',').map(d => d.trim())
  const fromDomain = (from.match(/@([^>]+)/) ?? [])[1] ?? ''
  if (!allowedDomains.some(d => fromDomain === d || fromDomain.endsWith(`.${d}`))) {
    return res.status(422).json({
      name: 'from_domain_not_allowed',
      message: `Sending from ${fromDomain} not allowed. Allowed: ${allowedDomains.join(', ')}`,
    })
  }

  try {
    const info = await getTransport().sendMail({
      from,
      to:       Array.isArray(to)  ? to.join(', ') : to,
      cc:       Array.isArray(cc)  ? cc.join(', ') : cc,
      bcc:      Array.isArray(bcc) ? bcc.join(', '): bcc,
      replyTo:  reply_to,
      subject,
      html,
      text,
      attachments, // [{ filename, content, contentType }]
    })

    console.log(`[Mail] Sent ${info.messageId} to ${to} from ${from}`)
    res.status(200).json({ id: info.messageId })
  } catch (err) {
    console.error('[Mail] Error:', err.message)
    res.status(500).json({ name: 'smtp_error', message: err.message })
  }
})

// ── POST /emails/batch — Send multiple emails ─────────────────
app.post('/emails/batch', auth, rateLimit, async (req, res) => {
  const emails = req.body
  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(422).json({ name: 'invalid_body', message: 'Array of email objects required' })
  }
  if (emails.length > 100) {
    return res.status(422).json({ name: 'too_many', message: 'Max 100 emails per batch' })
  }

  const results = await Promise.allSettled(
    emails.map(email =>
      getTransport().sendMail({
        from:     email.from,
        to:       Array.isArray(email.to) ? email.to.join(', ') : email.to,
        subject:  email.subject,
        html:     email.html,
        text:     email.text,
        replyTo:  email.reply_to,
      })
    )
  )

  const data = results.map((r, i) => ({
    to:    emails[i].to,
    id:    r.status === 'fulfilled' ? r.value.messageId : null,
    error: r.status === 'rejected'  ? r.reason.message  : null,
  }))

  res.status(200).json({ data })
})

// ── GET /health ───────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    ok:      true,
    service: 'IAI Mail API',
    smtp:    `${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`,
    docs:    MAIL_DOCS_URL,
    ts:      new Date().toISOString(),
  })
})

// ── GET /help — Docs entry for API operators ──────────────────
app.get('/help', (req, res) => {
  const wantsHtml = (req.headers.accept ?? '').includes('text/html')
  if (wantsHtml) {
    return res.redirect(302, MAIL_DOCS_URL)
  }

  res.json({
    ok: true,
    docs: MAIL_DOCS_URL,
    endpoints: {
      send: '/emails',
      batch: '/emails/batch',
      domains: '/domains',
      health: '/health',
    },
  })
})

// ── GET /domains — List allowed from-domains ──────────────────
app.get('/domains', auth, (req, res) => {
  const domains = (process.env.ALLOWED_FROM_DOMAINS ?? 'iai.one').split(',').map(d => d.trim())
  res.json({ data: domains.map(name => ({ name, status: 'active' })) })
})

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000
app.listen(PORT, '127.0.0.1', () => {
  console.log(`IAI Mail API running on 127.0.0.1:${PORT}`)
  console.log(`SMTP: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT} (${process.env.SMTP_USER})`)
})

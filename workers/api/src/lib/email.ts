// ═══════════════════════════════════════════════════════════════
//  IAI Email — Unified sending service
//  Supports two backends (auto-detected by env vars):
//    1. Self-hosted IAI Mail API (MAIL_API_URL + MAIL_API_KEY)
//    2. Resend.com fallback          (RESEND_API_KEY)
//
//  API is Resend-compatible, so the same interface works for both.
// ═══════════════════════════════════════════════════════════════

export type EmailPayload = {
  from:     string
  to:       string | string[]
  subject:  string
  html:     string
  text?:    string
  reply_to?: string
  bcc?:     string | string[]
}

type EmailEnv = {
  MAIL_API_URL?:  string   // e.g. https://mail.iai.one/api
  MAIL_API_KEY?:  string   // IAI Mail API key
  RESEND_API_KEY?: string  // fallback
}

// ── Core send function ────────────────────────────────────────
export async function sendEmail(payload: EmailPayload, env: EmailEnv): Promise<void> {
  // Prefer self-hosted, fall back to Resend
  const apiUrl = env.MAIL_API_URL ?? (env.RESEND_API_KEY ? 'https://api.resend.com' : null)
  const apiKey = env.MAIL_API_URL ? env.MAIL_API_KEY : env.RESEND_API_KEY

  if (!apiUrl || !apiKey) {
    console.warn('[Email] No email provider configured — skipping send')
    return
  }

  const endpoint = `${apiUrl}/emails`

  const res = await fetch(endpoint, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Email API error ${res.status}: ${err}`)
  }
}

// ── Convenience helper: pick env from Bindings ────────────────
export function emailEnv(env: {
  MAIL_API_URL?: string
  MAIL_API_KEY?: string
  RESEND_API_KEY?: string
}): EmailEnv {
  return {
    MAIL_API_URL:  env.MAIL_API_URL,
    MAIL_API_KEY:  env.MAIL_API_KEY,
    RESEND_API_KEY: env.RESEND_API_KEY,
  }
}

// ── Email templates ───────────────────────────────────────────

const BASE_STYLE = `
  body{margin:0;padding:0;background:#0D0D0F;font-family:'DM Sans',Arial,sans-serif;}
  .wrap{max-width:520px;margin:0 auto;padding:40px 20px;}
  .card{background:#14141A;border:1px solid #2A2A35;border-radius:16px;overflow:hidden;}
  .header{background:linear-gradient(135deg,#C9A84C,#8B6914);padding:32px;text-align:center;}
  .logo{display:inline-block;width:56px;height:56px;background:#0D0D0F;border-radius:14px;
        font-size:28px;font-weight:bold;color:#C9A84C;line-height:56px;text-align:center;}
  .body{padding:36px 40px;}
  .btn{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#C9A84C,#8B6914);
       color:#0D0D0F;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;}
  .footer{padding:20px 40px;border-top:1px solid #2A2A35;text-align:center;}
`

export function verifyEmailHtml(opts: {
  name:   string
  handle: string
  link:   string
}): string {
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<title>Xác nhận email — IAI</title>
<style>${BASE_STYLE}</style></head>
<body><div class="wrap"><div class="card">
  <div class="header">
    <div class="logo">I</div>
    <h1 style="margin:12px 0 4px;color:#0D0D0F;font-size:22px;font-weight:700;">IAI</h1>
    <p style="margin:0;color:#0D0D0F80;font-size:12px;">Intelligence · Artistry · International</p>
  </div>
  <div class="body">
    <h2 style="margin:0 0 8px;color:#fff;font-size:20px;">Xin chào, ${opts.name}!</h2>
    <p style="margin:0 0 6px;color:#ffffff80;font-size:14px;">Handle: <strong style="color:#C9A84C">@${opts.handle}</strong></p>
    <p style="margin:0 0 28px;color:#ffffff60;font-size:14px;line-height:1.6;">
      Bạn đã đăng ký tài khoản IAI. Nhấn nút bên dưới để xác nhận email và bắt đầu hành trình học tập.
    </p>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${opts.link}" class="btn">Xác nhận email</a>
    </div>
    <p style="margin:0 0 4px;color:#ffffff30;font-size:12px;text-align:center;">Link hết hạn sau 24 giờ.</p>
    <p style="margin:0;color:#ffffff20;font-size:11px;text-align:center;word-break:break-all;">${opts.link}</p>
  </div>
  <div class="footer">
    <p style="margin:0;color:#ffffff20;font-size:11px;">© 2025 IAI.one · Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.</p>
  </div>
</div></div></body></html>`
}

export function welcomeEmailHtml(opts: {
  name:   string
  handle: string
  appUrl: string
}): string {
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<title>Chào mừng tới IAI</title>
<style>${BASE_STYLE}</style></head>
<body><div class="wrap"><div class="card">
  <div class="header">
    <div class="logo">I</div>
    <h1 style="margin:12px 0 4px;color:#0D0D0F;font-size:22px;font-weight:700;">Chào mừng tới IAI!</h1>
  </div>
  <div class="body">
    <h2 style="margin:0 0 16px;color:#fff;font-size:18px;">
      Xin chào <strong style="color:#C9A84C">@${opts.handle}</strong>!
    </h2>
    <p style="margin:0 0 20px;color:#ffffff60;font-size:14px;line-height:1.6;">
      Tài khoản của bạn đã được xác nhận. Bắt đầu khám phá IAI:
    </p>
    <ul style="margin:0 0 28px;padding:0 0 0 20px;color:#ffffff60;font-size:14px;line-height:2.2;">
      <li>📚 Học các khóa học được AI kiểm chứng</li>
      <li>🏅 Chia sẻ kiến thức, nhận badge danh giá</li>
      <li>💰 Mua & bán tài liệu học tập</li>
      <li>🔍 Kiểm chứng sự thật với IAI Verify</li>
    </ul>
    <div style="text-align:center;">
      <a href="${opts.appUrl}" class="btn">Vào IAI ngay</a>
    </div>
  </div>
  <div class="footer">
    <p style="margin:0;color:#ffffff20;font-size:11px;">© 2025 IAI.one</p>
  </div>
</div></div></body></html>`
}

export function passwordResetHtml(opts: {
  name: string
  link: string
}): string {
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<title>Đặt lại mật khẩu — IAI</title>
<style>${BASE_STYLE}</style></head>
<body><div class="wrap"><div class="card">
  <div class="header">
    <div class="logo">I</div>
    <h1 style="margin:12px 0 4px;color:#0D0D0F;font-size:22px;font-weight:700;">Đặt lại mật khẩu</h1>
  </div>
  <div class="body">
    <h2 style="margin:0 0 16px;color:#fff;font-size:18px;">Xin chào, ${opts.name}!</h2>
    <p style="margin:0 0 28px;color:#ffffff60;font-size:14px;line-height:1.6;">
      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn nút bên dưới để tiếp tục:
    </p>
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${opts.link}" class="btn">Đặt lại mật khẩu</a>
    </div>
    <p style="margin:0;color:#ffffff30;font-size:12px;text-align:center;">
      Link hết hạn sau 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này.
    </p>
  </div>
  <div class="footer">
    <p style="margin:0;color:#ffffff20;font-size:11px;">© 2025 IAI.one</p>
  </div>
</div></div></body></html>`
}

export function transactionalEmailHtml(opts: {
  title:   string
  body:    string
  ctaText?: string
  ctaUrl?:  string
}): string {
  const cta = opts.ctaText && opts.ctaUrl
    ? `<div style="text-align:center;margin:28px 0;">
         <a href="${opts.ctaUrl}" class="btn">${opts.ctaText}</a>
       </div>`
    : ''
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<title>${opts.title} — IAI</title>
<style>${BASE_STYLE}</style></head>
<body><div class="wrap"><div class="card">
  <div class="header">
    <div class="logo">I</div>
    <h1 style="margin:12px 0 4px;color:#0D0D0F;font-size:20px;font-weight:700;">${opts.title}</h1>
  </div>
  <div class="body">
    <div style="color:#ffffff70;font-size:14px;line-height:1.7;">${opts.body}</div>
    ${cta}
  </div>
  <div class="footer">
    <p style="margin:0;color:#ffffff20;font-size:11px;">© 2025 IAI.one</p>
  </div>
</div></div></body></html>`
}

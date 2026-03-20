// ═══════════════════════════════════════════════════════════════
//  IAI Email — Resend API (https://resend.com)
//  Free tier: 3 000 emails/month, no SMTP needed
// ═══════════════════════════════════════════════════════════════

const RESEND = 'https://api.resend.com/emails'
const FROM   = 'IAI <noreply@iai.one>'

export async function sendEmail(opts: {
  to:      string
  subject: string
  html:    string
  apiKey:  string
}): Promise<void> {
  const res = await fetch(RESEND, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${opts.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend error ${res.status}: ${err}`)
  }
}

// ── Email templates ───────────────────────────────────────────

export function verifyEmailHtml(opts: {
  name:    string
  handle:  string
  link:    string
}): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>Xác nhận email — IAI</title></head>
<body style="margin:0;padding:0;background:#0D0D0F;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0F;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#14141A;border:1px solid #2A2A35;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#C9A84C,#8B6914);padding:32px;text-align:center;">
          <div style="display:inline-flex;width:56px;height:56px;background:#0D0D0F;border-radius:14px;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:#C9A84C;line-height:56px;text-align:center;">I</div>
          <h1 style="margin:16px 0 4px;color:#0D0D0F;font-size:24px;font-weight:700;letter-spacing:-0.5px;">IAI</h1>
          <p style="margin:0;color:#0D0D0F80;font-size:13px;">Intelligence · Artistry · International</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:36px 40px;">
          <h2 style="margin:0 0 8px;color:#FFFFFF;font-size:20px;font-weight:600;">Xin chào, ${opts.name}!</h2>
          <p style="margin:0 0 8px;color:#FFFFFF80;font-size:14px;">Handle của bạn: <strong style="color:#C9A84C">@${opts.handle}</strong></p>
          <p style="margin:0 0 28px;color:#FFFFFF60;font-size:14px;line-height:1.6;">
            Bạn đã đăng ký tài khoản IAI. Nhấn nút bên dưới để xác nhận email và bắt đầu hành trình học tập.
          </p>

          <div style="text-align:center;margin-bottom:28px;">
            <a href="${opts.link}"
               style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#0D0D0F;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;letter-spacing:0.3px;">
              Xác nhận email
            </a>
          </div>

          <p style="margin:0 0 4px;color:#FFFFFF30;font-size:12px;text-align:center;">
            Link hết hạn sau 24 giờ.
          </p>
          <p style="margin:0;color:#FFFFFF20;font-size:11px;text-align:center;word-break:break-all;">
            ${opts.link}
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;border-top:1px solid #2A2A35;text-align:center;">
          <p style="margin:0;color:#FFFFFF20;font-size:11px;">
            © 2025 IAI.one — Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function welcomeEmailHtml(opts: {
  name:   string
  handle: string
  appUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="utf-8"><title>Chào mừng tới IAI</title></head>
<body style="margin:0;padding:0;background:#0D0D0F;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0F;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#14141A;border:1px solid #2A2A35;border-radius:16px;overflow:hidden;">

        <tr><td style="background:linear-gradient(135deg,#C9A84C,#8B6914);padding:32px;text-align:center;">
          <div style="display:inline-flex;width:56px;height:56px;background:#0D0D0F;border-radius:14px;align-items:center;justify-content:center;font-size:28px;font-weight:bold;color:#C9A84C;line-height:56px;text-align:center;">I</div>
          <h1 style="margin:16px 0 4px;color:#0D0D0F;font-size:24px;font-weight:700;">Chào mừng tới IAI!</h1>
        </td></tr>

        <tr><td style="padding:36px 40px;">
          <h2 style="margin:0 0 16px;color:#FFFFFF;font-size:18px;">Xin chào <strong style="color:#C9A84C">@${opts.handle}</strong>!</h2>
          <p style="margin:0 0 20px;color:#FFFFFF60;font-size:14px;line-height:1.6;">
            Tài khoản của bạn đã được xác nhận thành công. Bắt đầu khám phá IAI ngay hôm nay:
          </p>
          <ul style="margin:0 0 24px;padding:0 0 0 20px;color:#FFFFFF60;font-size:14px;line-height:2;">
            <li>Học các khóa học được AI kiểm chứng</li>
            <li>Chia sẻ kiến thức, nhận badge danh giá</li>
            <li>Mua & bán tài liệu học tập</li>
            <li>Kiểm chứng sự thật với IAI Verify</li>
          </ul>
          <div style="text-align:center;">
            <a href="${opts.appUrl}"
               style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#0D0D0F;text-decoration:none;border-radius:10px;font-weight:700;font-size:15px;">
              Vào IAI ngay
            </a>
          </div>
        </td></tr>

        <tr><td style="padding:20px 40px;border-top:1px solid #2A2A35;text-align:center;">
          <p style="margin:0;color:#FFFFFF20;font-size:11px;">© 2025 IAI.one</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

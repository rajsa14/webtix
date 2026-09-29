/**
 * Example serverless endpoint (Vercel style, Web Request/Response API) that
 * e-mails an inquiry to WebTix through Resend.
 *
 * Setup:
 *  1. Create a Resend account and verify your sending domain.
 *  2. Set RESEND_API_KEY and INQUIRY_FROM in the hosting environment
 *     (never in the frontend, never with the VITE_ prefix).
 *  3. Set VITE_INQUIRY_ENDPOINT=/api/inquiry for the frontend build.
 *
 * Not part of the Vite bundle. Adapt it for Netlify, Cloudflare or your own server as needed.
 */

const TO = 'webtixx1@gmail.com'

interface Body {
  _subject?: string
  _replyto?: string
  message?: string
  website?: string
}

export async function POST(request: Request): Promise<Response> {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: 'Neplatná data' }, { status: 400 })
  }

  const subject = String(body._subject ?? '').slice(0, 200)
  const replyTo = String(body._replyto ?? '')
  const text = String(body.message ?? '').slice(0, 20_000)

  // Basic server-side validation. Never trust the browser.
  if (!subject || !text || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(replyTo)) {
    return Response.json({ ok: false, error: 'Chybí povinné údaje' }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.INQUIRY_FROM
  if (!apiKey || !from) {
    return Response.json({ ok: false, error: 'E-mailová služba není nastavená' }, { status: 500 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [TO], reply_to: replyTo, subject, text }),
  })

  if (!res.ok) {
    return Response.json({ ok: false, error: 'Odeslání selhalo' }, { status: 502 })
  }
  return Response.json({ ok: true })
}

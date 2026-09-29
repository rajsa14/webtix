/**
 * Netlify Function that e-mails an inquiry to WebTix through Resend.
 * Served at /api/inquiry (see config below).
 *
 * Setup in Netlify: Site configuration > Environment variables
 *  - RESEND_API_KEY   (secret, never in the frontend)
 *  - INQUIRY_FROM     e.g. "WebTix <poptavky@vase-domena.cz>" (verified in Resend)
 *  - VITE_INQUIRY_ENDPOINT = /api/inquiry   (tells the frontend to use this)
 * Then trigger a new deploy.
 */

const TO = 'webtixx1@gmail.com'

interface Body {
  _subject?: string
  _replyto?: string
  message?: string
  website?: string
}

export const config = { path: '/api/inquiry' }

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405 })

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

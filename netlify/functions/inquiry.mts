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
import type { Config } from '@netlify/functions'
import { isSameOrigin, json, readJson } from '../lib/http.mts'

const TO = 'info@webtix.cz'

/** A person needs longer than this to fill the form in. Scripts do not. */
const MIN_FILL_MS = 4000

export const config: Config = {
  path: '/api/inquiry',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 5 },
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405 })
  if (!isSameOrigin(request)) return new Response(null, { status: 403 })

  const body = await readJson(request, 60_000)
  if (!body) return json({ ok: false, error: 'Neplatná data' }, { status: 400 })

  // Spam traps: a filled honeypot or an instant submit. Answer as if it worked,
  // so the bot has no reason to try another way.
  if (body.website || Number(body._elapsed) < MIN_FILL_MS) return json({ ok: true })

  // Never trust the browser. Line breaks are stripped so nothing can add e-mail headers.
  const subject = String(body._subject ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, 200)
  const replyTo = String(body._replyto ?? '').trim()
  const text = String(body.message ?? '').trim().slice(0, 20_000)

  if (!subject || text.length < 10 || replyTo.length > 254 || !/^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/.test(replyTo)) {
    return json({ ok: false, error: 'Chybí povinné údaje' }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.INQUIRY_FROM
  if (!apiKey || !from) {
    return json({ ok: false, error: 'E-mailová služba není nastavená' }, { status: 500 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [TO], reply_to: replyTo, subject, text }),
  })

  if (!res.ok) {
    return json({ ok: false, error: 'Odeslání selhalo' }, { status: 502 })
  }
  return json({ ok: true })
}

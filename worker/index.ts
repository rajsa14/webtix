/**
 * Cloudflare Worker for webtix.cz. Static files and pages are served from
 * dist/ by Workers Assets (wrangler.jsonc); only /api/* reaches this code.
 *
 * /api/inquiry e-mails an inquiry to WebTix through Resend.
 * Setup (Cloudflare > Workers > webtix > Settings > Variables and Secrets):
 *  - RESEND_API_KEY  secret, never in the frontend
 *  - INQUIRY_FROM    set in wrangler.jsonc, must be on a domain verified in Resend
 */

interface Env {
  RESEND_API_KEY?: string
  INQUIRY_FROM?: string
  INQUIRY_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> }
}

const TO = 'info@webtix.cz'

/** A person needs longer than this to fill the form in. Scripts do not. */
const MIN_FILL_MS = 4000

const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, { ...init, headers: { 'Cache-Control': 'no-store', ...init?.headers } })

/** Browsers send Origin on every POST. Anything from another site is refused. */
function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

/** Parses a small JSON body. Returns null for anything oversized or malformed. */
async function readJson(request: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text()
    if (raw.length > maxBytes) return null
    const body: unknown = JSON.parse(raw)
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

async function inquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return new Response(null, { status: 405 })
  if (!isSameOrigin(request)) return new Response(null, { status: 403 })

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown'
  if (env.INQUIRY_LIMITER && !(await env.INQUIRY_LIMITER.limit({ key: ip })).success) {
    return json({ ok: false, error: 'Příliš mnoho pokusů, zkuste to za chvíli' }, { status: 429 })
  }

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

  if (!env.RESEND_API_KEY || !env.INQUIRY_FROM) {
    return json({ ok: false, error: 'E-mailová služba není nastavená' }, { status: 500 })
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.INQUIRY_FROM, to: [TO], reply_to: replyTo, subject, text }),
  })

  if (!res.ok) {
    console.error('Resend', res.status, await res.text())
    return json({ ok: false, error: 'Odeslání selhalo' }, { status: 502 })
  }
  return json({ ok: true })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/inquiry') return inquiry(request, env)
    return json({ ok: false, error: 'Nenalezeno' }, { status: 404 })
  },
}

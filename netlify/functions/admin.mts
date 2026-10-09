/**
 * Netlify Function behind the /admin dashboard: login, logout and statistics.
 *
 * Setup in Netlify: Site configuration > Environment variables
 *  - ADMIN_PASSWORD   (secret, scope Functions; use a long random password)
 * Then trigger a new deploy. Without it, login stays switched off.
 */
import type { Config, Context } from '@netlify/functions'
import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { readStats } from '../lib/events.mts'
import { deployContextOf, isSameOrigin, json, readJson } from '../lib/http.mts'

export const config: Config = {
  path: ['/api/admin/login', '/api/admin/logout', '/api/admin/stats'],
  // Ten tries a minute per visitor makes guessing the password pointless.
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 10 },
}

const COOKIE = 'webtix_admin'
const SESSION_SECONDS = 7 * 24 * 60 * 60
const RANGES = [7, 30, 90]

const sha256 = (value: string) => createHash('sha256').update(value).digest()

/** Constant-time comparison, so response timing reveals nothing about the password. */
const safeEqual = (a: string, b: string) => timingSafeEqual(sha256(a), sha256(b))

// The signing key comes from the password: changing it logs every session out.
const sign = (expires: string, password: string) =>
  createHmac('sha256', sha256(`webtix-admin-session:${password}`)).update(expires).digest('hex')

function hasSession(request: Request, password: string) {
  const cookie = request.headers
    .get('cookie')
    ?.split(/;\s*/)
    .find((part) => part.startsWith(`${COOKIE}=`))
  const [expires, signature] = cookie?.slice(COOKIE.length + 1).split('.') ?? []
  if (!expires || !signature) return false
  return safeEqual(signature, sign(expires, password)) && Number(expires) > Date.now()
}

const sessionCookie = (value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/api/admin; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Strict`

export default async function handler(request: Request, context: Context): Promise<Response> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return json({ ok: false, error: 'Přihlášení není nastavené.' }, { status: 503 })

  const action = new URL(request.url).pathname.split('/').pop()

  if (action === 'stats' && request.method === 'GET') {
    if (!hasSession(request, password)) return json({ ok: false }, { status: 401 })
    const requested = Number(new URL(request.url).searchParams.get('days'))
    const days = RANGES.includes(requested) ? requested : 30
    return json({ ok: true, ...(await readStats(deployContextOf(context), days)) })
  }

  if (request.method !== 'POST') return new Response(null, { status: 405 })
  if (!isSameOrigin(request)) return new Response(null, { status: 403 })

  if (action === 'logout') {
    return json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie('', 0) } })
  }

  const body = await readJson(request, 1000)
  if (!body || typeof body.password !== 'string' || !safeEqual(body.password, password)) {
    return json({ ok: false, error: 'Nesprávné heslo.' }, { status: 401 })
  }
  const expires = String(Date.now() + SESSION_SECONDS * 1000)
  return json(
    { ok: true },
    { headers: { 'Set-Cookie': sessionCookie(`${expires}.${sign(expires, password)}`, SESSION_SECONDS) } },
  )
}

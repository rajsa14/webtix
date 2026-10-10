/**
 * Netlify Function that records one page view (or one sent inquiry) for the /admin dashboard.
 * Served at /api/track. Stores no IP address and sets no cookie.
 */
import type { Config, Context } from '@netlify/functions'
import { recordInquiry, recordPageView } from '../lib/events.mts'
import { deployContextOf, isSameOrigin, readJson } from '../lib/http.mts'

export const config: Config = {
  path: '/api/track',
  method: 'POST',
  rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 30 },
}

// Only real pages are counted, so nobody can fill the dashboard with junk paths.
const PAGES = new Set([
  '/',
  '/katalog',
  '/jak-to-funguje',
  '/reference',
  '/o-nas',
  '/kontakt',
  '/poptavka-odeslana',
  '/ochrana-osobnich-udaju',
  '/obchodni-podminky',
])
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor/i
const VISITOR_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

function referrerHost(value: unknown, ownHost: string) {
  try {
    const host = new URL(String(value)).host.replace(/^www\./, '')
    return host && host !== ownHost.replace(/^www\./, '') ? host.slice(0, 80) : ''
  } catch {
    return ''
  }
}

export default async function handler(request: Request, context: Context): Promise<Response> {
  const done = new Response(null, { status: 204 })
  if (!isSameOrigin(request)) return new Response(null, { status: 403 })
  if (BOT.test(request.headers.get('user-agent') ?? '')) return done

  const body = await readJson(request, 1000)
  if (!body) return new Response(null, { status: 400 })

  if (body.type === 'inquiry') {
    await recordInquiry(deployContextOf(context))
    return done
  }

  const width = Number(body.width) || 0
  await recordPageView(deployContextOf(context), {
    type: body.type === 'visitor' ? 'visitor' : 'view',
    path: PAGES.has(String(body.path)) ? String(body.path) : 'Stránka nenalezena',
    referrer: referrerHost(body.referrer, new URL(request.url).host),
    device: width < 640 ? 'Mobil' : width < 1024 ? 'Tablet' : 'Počítač',
    visitor: VISITOR_ID.test(String(body.visitor)) ? String(body.visitor) : '',
  })
  return done
}

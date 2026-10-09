import { getStore } from '@netlify/blobs'
import { randomBytes } from 'node:crypto'

/**
 * Append-only event log on Netlify Blobs.
 *
 * Every event is its own key and the data lives in the key itself, so a write
 * never reads first (no lost updates) and the dashboard only has to list keys.
 *   pv/2026-10-09/<base64url JSON>~<random>   page view
 *   inq/2026-10-09/<random>                   sent inquiry
 *
 * ponytail: stats are aggregated on every dashboard load by listing keys.
 * Fine up to tens of thousands of views a month; past that, move to Netlify DB.
 */
export interface PageView {
  /** 'view' counts a page view, 'visitor' only attaches a visitor id after consent. */
  type: 'view' | 'visitor'
  path: string
  referrer: string
  device: string
  visitor: string
}

interface KeyStore {
  add: (key: string) => Promise<void>
  keys: (prefix: string) => Promise<string[]>
}

// Local dev only (see vite.config.ts): nothing leaves the machine.
const memory = new Set<string>()

function keyStore(deployContext: string): KeyStore {
  if (process.env.WEBTIX_DEV_STORE === '1') {
    return {
      add: async (key) => void memory.add(key),
      keys: async (prefix) => [...memory].filter((key) => key.startsWith(prefix)),
    }
  }
  // Site-wide stores are shared by every deploy, so previews get their own.
  const store = getStore(deployContext === 'production' ? 'analytics' : `analytics-${deployContext}`)
  return {
    add: async (key) => void (await store.set(key, '1')),
    keys: async (prefix) => (await store.list({ prefix })).blobs.map((blob) => blob.key),
  }
}

const dayFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Prague' })

/** Calendar day in Czech time, e.g. 2026-10-09. */
export const dayOf = (date: Date) => dayFormat.format(date)

export function lastDays(count: number) {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => dayOf(new Date(now - (count - 1 - i) * 86_400_000)))
}

const random = () => randomBytes(6).toString('base64url')

export async function recordPageView(deployContext: string, view: PageView) {
  const data = Buffer.from(JSON.stringify([view.type, view.path, view.referrer, view.device, view.visitor]))
  await keyStore(deployContext).add(`pv/${dayOf(new Date())}/${data.toString('base64url')}~${random()}`)
}

export async function recordInquiry(deployContext: string) {
  await keyStore(deployContext).add(`inq/${dayOf(new Date())}/${random()}`)
}

const top = (counts: Map<string, number>, limit = 8) =>
  [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit)

const bump = (counts: Map<string, number>, key: string) => counts.set(key, (counts.get(key) ?? 0) + 1)

export async function readStats(deployContext: string, dayCount: number) {
  const store = keyStore(deployContext)
  const pages = new Map<string, number>()
  const referrers = new Map<string, number>()
  const devices = new Map<string, number>()
  const allVisitors = new Set<string>()
  let views = 0
  let inquiries = 0

  const days = await Promise.all(
    lastDays(dayCount).map(async (date) => {
      const [viewKeys, inquiryKeys] = await Promise.all([store.keys(`pv/${date}/`), store.keys(`inq/${date}/`)])
      const visitors = new Set<string>()
      let dayViews = 0
      for (const key of viewKeys) {
        let event: string[]
        try {
          event = JSON.parse(Buffer.from(key.slice(key.lastIndexOf('/') + 1).split('~')[0], 'base64url').toString())
        } catch {
          continue
        }
        const [type, path, referrer, device, visitor] = event
        if (visitor) {
          visitors.add(visitor)
          allVisitors.add(visitor)
        }
        if (type !== 'view') continue
        dayViews++
        bump(pages, path)
        bump(devices, device)
        if (referrer) bump(referrers, referrer)
      }
      views += dayViews
      inquiries += inquiryKeys.length
      return { date, views: dayViews, visitors: visitors.size, inquiries: inquiryKeys.length }
    }),
  )

  return {
    days,
    totals: { views, visitors: allVisitors.size, inquiries },
    pages: top(pages),
    referrers: top(referrers),
    devices: top(devices),
  }
}

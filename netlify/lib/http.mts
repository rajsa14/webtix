import type { Context } from '@netlify/functions'

/** Browsers send Origin on every POST. Anything from another site is refused. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

/** Parses a small JSON body. Returns null for anything oversized or malformed. */
export async function readJson(request: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  try {
    const raw = await request.text()
    if (raw.length > maxBytes) return null
    const body: unknown = JSON.parse(raw)
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  } catch {
    return null
  }
}

export const deployContextOf = (context: Context) => context?.deploy?.context ?? 'dev'

export const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, { ...init, headers: { 'Cache-Control': 'no-store', ...init?.headers } })

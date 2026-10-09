import type { Consent } from '../store/consent'

/**
 * WebTix's own visit counter (netlify/functions/track.mts). No third party,
 * no cookie. Without consent a view is counted with no identifier at all;
 * the random visitor id below exists only after the visitor allows statistics.
 */
const VISITOR_KEY = 'webtix-navstevnik'

function visitorId() {
  try {
    let id = localStorage.getItem(VISITOR_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_KEY, id)
    }
    return id
  } catch {
    return ''
  }
}

function send(type: 'view' | 'visitor' | 'inquiry', visitor: string) {
  // The dashboard itself is not a visit, and a copy opened from disk has no server.
  if (window.location.pathname.startsWith('/admin') || !/^https?:$/.test(window.location.protocol)) return
  fetch('/api/track', {
    method: 'POST',
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      path: window.location.pathname.replace(/(.)\/$/, '$1'),
      referrer: document.referrer,
      width: window.innerWidth,
      visitor,
    }),
  }).catch(() => {
    // Statistics must never break the page.
  })
}

export function trackPageView(consent: Consent | null) {
  send('view', consent === 'all' ? visitorId() : '')
}

/** Counts a sent inquiry. Only the count is kept; the content goes to the mailbox. */
export function trackInquiry() {
  send('inquiry', '')
}

export function onConsentChange(consent: Consent) {
  if (consent === 'all') {
    send('visitor', visitorId())
    return
  }
  try {
    localStorage.removeItem(VISITOR_KEY)
  } catch {
    // Nothing was stored.
  }
}

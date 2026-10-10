import { SITE } from '../data/site'
import type { InquiryPayload } from './inquiry'

/**
 * E-mail integration layer.
 *
 * The site never holds API keys. By default the form posts to /api/inquiry,
 * the Cloudflare Worker in worker/index.ts, which e-mails the inquiry through
 * Resend (key lives on the server as RESEND_API_KEY).
 *
 * Or point VITE_INQUIRY_ENDPOINT at another service:
 *  - Formspree: VITE_INQUIRY_ENDPOINT=https://formspree.io/f/<form-id>
 *    (the form id is public by design, it is not a secret key)
 *  - Local test: VITE_INQUIRY_ENDPOINT=/api/dev-inquiry prints it in the dev server terminal
 *
 * When nothing can take the inquiry (opened from disk, no endpoint in local dev),
 * sendInquiry returns 'not-configured' and the UI offers to send the prepared
 * text through the visitor's own e-mail app, so no inquiry is lost.
 */
const ENDPOINT = (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined) || '/api/inquiry'

export type SendResult = { status: 'sent' } | { status: 'not-configured' }

/** `spam` carries the honeypot value and the time since the page opened; the server uses them to drop bots. */
export async function sendInquiry(
  payload: InquiryPayload,
  spam: { website: string; elapsed: number },
): Promise<SendResult> {
  // A copy opened from disk has no server to send to.
  if (ENDPOINT.startsWith('/') && !/^https?:$/.test(window.location.protocol)) return { status: 'not-configured' }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      // Flat fields keep Formspree / Getform style services readable.
      _subject: payload.subject,
      _replyto: payload.replyTo,
      email: payload.replyTo,
      name: payload.form.name,
      message: payload.text,
      website: spam.website,
      _elapsed: spam.elapsed,
      // Structured copy for a custom backend.
      inquiry: payload,
    }),
  })

  // 404: no endpoint behind this address (e.g. local dev), fall back to the e-mail app.
  if (response.status === 404) return { status: 'not-configured' }
  if (!response.ok) {
    throw new Error(`Odeslání selhalo (${response.status})`)
  }
  return { status: 'sent' }
}

/** mailto link with the prepared inquiry, used when no service is connected. */
export function mailtoHref(payload: InquiryPayload) {
  const params = new URLSearchParams({ subject: payload.subject, body: payload.text })
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${SITE.email}?${params.toString().replace(/\+/g, '%20')}`
}

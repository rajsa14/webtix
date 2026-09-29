import { SITE } from '../data/site'
import type { InquiryPayload } from './inquiry'

/**
 * E-mail integration layer.
 *
 * The site is frontend only, so it cannot send e-mail by itself and it never
 * holds API keys. Point VITE_INQUIRY_ENDPOINT at a service that does:
 *
 *  - Own backend / serverless function: see netlify/functions/inquiry.mts (Resend, key lives
 *    on the server as RESEND_API_KEY). Set VITE_INQUIRY_ENDPOINT=/api/inquiry
 *  - Formspree: VITE_INQUIRY_ENDPOINT=https://formspree.io/f/<form-id>
 *    (the form id is public by design, it is not a secret key)
 *
 * With no endpoint configured, sendInquiry returns 'not-configured' and the UI
 * offers to send the prepared text through the visitor's own e-mail app.
 */
const ENDPOINT = import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined

export type SendResult = { status: 'sent' } | { status: 'not-configured' }

export const isEmailConfigured = Boolean(ENDPOINT)

export async function sendInquiry(payload: InquiryPayload): Promise<SendResult> {
  if (!ENDPOINT) return { status: 'not-configured' }

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
      // Structured copy for a custom backend.
      inquiry: payload,
    }),
  })

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

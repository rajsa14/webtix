import { SITE } from '../data/site'
import type { InquiryPayload } from './inquiry'

/**
 * E-mail integration layer.
 *
 * The site is frontend only, so it cannot send e-mail by itself and it never
 * holds API keys.
 *
 * Default: Netlify Forms. The form blueprint in index.html registers the
 * "poptavka" form at deploy time; Netlify stores every submission and e-mails
 * it (Netlify > Forms > Form notifications). Nothing to configure in code.
 *
 * Or point VITE_INQUIRY_ENDPOINT at another service:
 *
 *  - Own backend / serverless function: see netlify/functions/inquiry.mts (Resend, key lives
 *    on the server as RESEND_API_KEY). Set VITE_INQUIRY_ENDPOINT=/api/inquiry
 *  - Formspree: VITE_INQUIRY_ENDPOINT=https://formspree.io/f/<form-id>
 *    (the form id is public by design, it is not a secret key)
 *
 * When nothing can take the inquiry (opened from disk, Forms not enabled yet),
 * sendInquiry returns 'not-configured' and the UI offers to send the prepared
 * text through the visitor's own e-mail app, so no inquiry is lost.
 */
const ENDPOINT = import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined

export type SendResult = { status: 'sent' } | { status: 'not-configured' }


export const NETLIFY_FORM_NAME = 'poptavka'

async function sendToNetlifyForms(payload: InquiryPayload): Promise<SendResult> {
  // Netlify Forms only exist on the deployed site, not on file:// copies.
  if (!/^https?:$/.test(window.location.protocol)) return { status: 'not-configured' }

  const { form } = payload
  const body = new URLSearchParams({
    'form-name': NETLIFY_FORM_NAME,
    subject: payload.subject,
    name: form.name.trim(),
    company: form.company.trim(),
    email: payload.replyTo,
    phone: form.phone.trim(),
    webType: form.webType,
    budget: form.budget,
    deadline: form.deadline,
    design: payload.design.map((d) => `${d.category}: ${d.items.length ? d.items.join(', ') : 'nevybráno'}`).join('\n'),
    message: form.message.trim(),
    inspiration: form.inspiration.trim(),
  })

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  // 404 means Forms are not enabled for the site (or local dev): fall back to e-mail app.
  if (response.status === 404) return { status: 'not-configured' }
  if (!response.ok) throw new Error(`Odeslání selhalo (${response.status})`)
  return { status: 'sent' }
}

export async function sendInquiry(payload: InquiryPayload): Promise<SendResult> {
  if (!ENDPOINT) return sendToNetlifyForms(payload)

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

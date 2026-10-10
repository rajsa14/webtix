import { SITE } from '../data/site'

/**
 * The four fields of the enquiry form. The address field is `currentSite`,
 * never `website`: that name is the honeypot, and the Worker drops anything
 * that fills it.
 */
export interface InquiryForm {
  name: string
  email: string
  /** The visitor's current web or Instagram address. */
  currentSite: string
  message: string
}

export interface InquiryPayload {
  to: string
  subject: string
  replyTo: string
  /** Plain-text e-mail body, ready to send as is. */
  text: string
  form: InquiryForm
}

const orDash = (value: string) => value.trim() || 'neuvedeno'

export function buildInquiry(form: InquiryForm): InquiryPayload {
  const who = form.currentSite.trim() || form.name.trim()
  const subject = `Nová poptávka – ${SITE.name}${who ? ` (${who})` : ''}`

  const text = [
    `Nová poptávka – ${SITE.name}`,
    '',
    `Jméno: ${orDash(form.name)}`,
    `E-mail: ${form.email.trim()}`,
    `Web nebo Instagram: ${orDash(form.currentSite)}`,
    '',
    'Zpráva',
    orDash(form.message),
  ].join('\n')

  return { to: SITE.email, subject, replyTo: form.email.trim(), text, form }
}

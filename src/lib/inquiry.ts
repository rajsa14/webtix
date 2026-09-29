import { catalog } from '../data/catalog'
import { SITE } from '../data/site'
import type { Selection } from '../store/selection'

export interface InquiryForm {
  name: string
  company: string
  email: string
  phone: string
  webType: string
  message: string
  inspiration: string
  budget: string
  deadline: string
}

export interface InquiryPayload {
  to: string
  subject: string
  replyTo: string
  /** Plain-text e-mail body, ready to send as is. */
  text: string
  form: InquiryForm
  design: { category: string; items: string[] }[]
}

/** Human readable selection, e.g. [{ category: 'Písmo', items: ['Inter'] }]. */
export function describeSelection(selected: Selection) {
  return catalog.map((cat) => ({
    category: cat.label,
    items: selected[cat.id]
      .map((id) => cat.items.find((item) => item.id === id)?.name)
      .filter((name): name is string => Boolean(name)),
  }))
}

const orDash = (value: string) => value.trim() || 'neuvedeno'

export function buildInquiry(form: InquiryForm, selected: Selection): InquiryPayload {
  const design = describeSelection(selected)
  const subject = `Nová poptávka – ${SITE.name}${form.company ? ` (${form.company.trim()})` : ''}`

  const text = [
    `Nová poptávka – ${SITE.name}`,
    '',
    `Klient: ${form.name.trim()}`,
    `Firma: ${orDash(form.company)}`,
    `E-mail: ${form.email.trim()}`,
    `Telefon: ${orDash(form.phone)}`,
    `Typ webu: ${form.webType}`,
    `Rozpočet: ${orDash(form.budget)}`,
    `Termín: ${orDash(form.deadline)}`,
    '',
    'Design',
    ...design.map((d) => `${d.category}: ${d.items.length ? d.items.join(', ') : 'nevybráno'}`),
    '',
    'Zpráva',
    form.message.trim(),
    ...(form.inspiration.trim() ? ['', 'Inspirace', form.inspiration.trim()] : []),
  ].join('\n')

  return { to: SITE.email, subject, replyTo: form.email.trim(), text, form, design }
}

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { INQUIRY_ANCHOR, PAGES, SITE } from '../data/site'
import { buildInquiry, type InquiryForm } from '../lib/inquiry'
import { navigate } from '../lib/router'
import { cx, nb } from '../lib/text'
import { sendInquiry } from '../lib/sendInquiry'
import { useUi } from '../store/ui'
import { ResultDialog, type InquiryResult } from './ResultDialog'

/*
 * "Poptávka": the terracotta section with the enquiry form. Built from
 * docs/design/source/Rest.dc.html (1440) and RestMobile.dc.html (390).
 *
 * Four fields: name, email, currentSite, message (optional). The address field
 * is `currentSite`, never `website`: that name is the honeypot. The Worker
 * also drops submits faster than a person can type, and rate-limits by IP.
 */

const EMPTY: InquiryForm = { name: '', email: '', currentSite: '', message: '' }

type Errors = Partial<Record<keyof InquiryForm, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(form: InquiryForm): Errors {
  const e: Errors = {}
  if (form.name.trim().length < 2) e.name = 'Chyba: vyplňte prosím své jméno.'
  if (!form.email.trim()) e.email = 'Chyba: vyplňte e-mail, ať se vám můžeme ozvat.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Chyba: zadejte e-mail ve tvaru jmeno@domena.cz.'
  if (!form.currentSite.trim()) e.currentSite = 'Chyba: vyplňte web, Instagram, nebo aspoň název podniku.'
  return e
}

/** Bots submit within moments of loading the page; the server drops those. */
const msSincePageOpened = () => Math.round(performance.now())

const FIELD_ORDER: (keyof InquiryForm)[] = ['name', 'email', 'currentSite', 'message']

export function ContactForm() {
  const [form, setForm] = useState<InquiryForm>(() => ({ ...EMPTY, currentSite: useUi.getState().heroSite }))
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const setLastInquiry = useUi((s) => s.setLastInquiry)
  const [result, setResult] = useState<InquiryResult | null>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // The hero box sends its address here, so the visitor doesn't type it twice.
  useEffect(
    () =>
      useUi.subscribe((state, prev) => {
        if (state.heroSite && state.heroSite !== prev.heroSite) setForm((f) => ({ ...f, currentSite: state.heroSite }))
      }),
    [],
  )

  const set = (key: keyof InquiryForm) => (value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    // After the first submit attempt, errors update live as the user fixes them.
    if (submitted) setErrors(validate(next))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(form)
    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    // Bots fill hidden fields. Pretend nothing happened.
    if (honeypot.current?.value) return

    const payload = buildInquiry(form)
    setStatus('sending')
    try {
      const res = await sendInquiry(payload, { website: '', elapsed: msSincePageOpened() })
      if (res.status === 'sent') {
        setLastInquiry({ name: form.name.trim(), email: form.email.trim(), currentSite: form.currentSite.trim() })
        // A moment for the check mark to draw, then the thank-you page.
        setStatus('sent')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.setTimeout(() => navigate(PAGES.inquirySent), reduced ? 300 : 1500)
        return
      }
      setStatus('idle')
      setResult({ type: 'not-configured', payload })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id={INQUIRY_ANCHOR}
      aria-labelledby="poptavka-title"
      className="bg-terracotta text-cream"
      style={{ ['--focus' as string]: 'var(--color-cream)' }}
    >
      <div className="container-x flex flex-col gap-8 py-24 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6 lg:py-40">
        <div data-reveal className="flex flex-col lg:col-span-6">
          <h2
            id="poptavka-title"
            className="m-0 mb-4 text-[48px] leading-[0.92] tracking-[-0.045em] lg:mb-8 lg:text-[clamp(56px,calc((100vw-128px)*0.06707),96px)] lg:leading-[0.9]"
          >
            Pošlete odkaz. Zbytek je na <em className="scribble italic">nás.</em>
          </h2>
          <p className="m-0 max-w-[420px] text-[16px] leading-6 lg:text-[20px] lg:leading-[30px]">
            Ozveme se do dvou pracovních dnů. Nebo napište <span className="hidden lg:inline">rovnou </span>na{' '}
            <a href={`mailto:${SITE.email}`} className="text-cream underline underline-offset-4">
              {SITE.email}
            </a>
            .
          </p>
        </div>

        <form
          ref={formRef}
          data-reveal
          noValidate
          onSubmit={onSubmit}
          aria-describedby="form-note"
          data-status={status}
          className="contact-form relative flex flex-col gap-4 rounded-form bg-paper p-5 text-ink lg:col-span-5 lg:col-start-8 lg:gap-5 lg:p-10"
          style={{ ['--focus' as string]: 'var(--color-ink)', ['--reveal-delay' as string]: '150ms' }}
        >
          <Field label="Jméno" name="name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
          <Field
            label="E-mail"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
          />
          <Field
            label="Váš web nebo Instagram"
            name="currentSite"
            inputMode="url"
            autoComplete="url"
            value={form.currentSite}
            onChange={set('currentSite')}
            error={errors.currentSite}
          />
          <Field label="Zpráva" optional name="message" multiline value={form.message} onChange={set('message')} />

          {/* Honeypot: hidden from people, bots tend to fill it in. */}
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label>
              Web
              <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-input border-0 bg-ink p-4 font-sans text-[16px] font-medium text-paper transition-colors hover:bg-terracotta disabled:cursor-wait disabled:hover:bg-ink lg:mt-2 lg:p-[18px] lg:text-[17px]"
          >
            {status === 'sending' ? (
              <>
                Odesílám
                <span aria-hidden="true" className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="typing-dot size-1.5 rounded-full bg-paper" style={{ animationDelay: `${d * 160}ms` }} />
                  ))}
                </span>
              </>
            ) : (
              'Chci návrh'
            )}
          </button>

          {/* Not in the design: kept from the earlier form, as the privacy notice at the point of collection. */}
          <p id="form-note" className="m-0 text-[14px] leading-5 text-ink-soft">
            {nb('Údaje použijeme jen k odpovědi na vaši poptávku.')}{' '}
            <a href={PAGES.privacy} className="text-ink underline underline-offset-2">
              Ochrana osobních údajů
            </a>
          </p>

          {/* Sent: the card turns into a drawn check mark for a moment before the thank-you page. */}
          {status === 'sent' && (
            <div role="status" className="sent-card absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-form bg-paper text-center">
              <svg aria-hidden="true" viewBox="0 0 80 80" className="sent-check size-24 text-terracotta" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <path pathLength={1} d="M40 6 C 60 6, 74 20, 74 40 C 74 60, 60 74, 40 74 C 20 74, 6 60, 6 40 C 6 20, 20 6, 42 7" />
                <path pathLength={1} d="M24 41 L 35 52 L 57 29" />
              </svg>
              <p className="m-0 text-[28px] font-bold tracking-[-0.03em]">Odesláno</p>
            </div>
          )}

          {status === 'error' && (
            <p role="alert" className="m-0 rounded-input border-2 border-solid border-pen p-3 text-[14px] leading-5 text-pen">
              Chyba: zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na{' '}
              <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>
                {SITE.email}
              </a>
              .
            </p>
          )}
        </form>
      </div>

      <ResultDialog result={result} onClose={() => setResult(null)} />
    </section>
  )
}

interface FieldProps {
  label: string
  name: keyof InquiryForm
  value: string
  onChange: (value: string) => void
  error?: string
  optional?: boolean
  multiline?: boolean
  type?: string
  inputMode?: 'email' | 'url' | 'text'
  autoComplete?: string
}

function Field({ label, name, value, onChange, error, optional, multiline, type = 'text', ...rest }: FieldProps) {
  const id = useId()
  const control = cx(
    'w-full rounded-input bg-white p-[13px] font-sans text-[16px] text-ink lg:p-[14px] lg:text-[17px]',
    error ? 'border-2 border-solid border-pen' : 'border border-solid border-ink',
  )
  const shared = {
    id,
    name,
    value,
    'aria-invalid': error ? true : undefined,
    'aria-required': optional ? undefined : true,
    'aria-describedby': error ? `${id}-error` : undefined,
  }
  return (
    <div className="flex flex-col gap-1.5 lg:gap-2">
      <label htmlFor={id} className="text-[14px] font-semibold">
        {label}
        {optional && <span className="font-normal text-muted"> (nepovinné)</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={3} maxLength={5000} onChange={(e) => onChange(e.target.value)} className={cx(control, 'resize-y')} />
      ) : (
        <input {...shared} type={type} maxLength={200} onChange={(e) => onChange(e.target.value)} className={control} {...rest} />
      )}
      {error && (
        <p id={`${id}-error`} className="m-0 text-[14px] leading-5 text-pen">
          {error}
        </p>
      )}
    </div>
  )
}

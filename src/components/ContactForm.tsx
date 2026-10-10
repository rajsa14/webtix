import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { INQUIRY_ANCHOR, PAGES, SITE } from '../data/site'
import { buildInquiry, type InquiryForm } from '../lib/inquiry'
import { navigate } from '../lib/router'
import { cx, nb } from '../lib/text'
import { sendInquiry } from '../lib/sendInquiry'
import { useUi } from '../store/ui'
import { ResultDialog, type InquiryResult } from './ResultDialog'

const EMPTY: InquiryForm = { name: '', email: '', currentSite: '', message: '' }

type Errors = Partial<Record<keyof InquiryForm, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(form: InquiryForm): Errors {
  const e: Errors = {}
  if (form.name.trim().length < 2) e.name = 'Chyba: vyplňte prosím své jméno.'
  if (!form.email.trim()) e.email = 'Chyba: vyplňte e-mail, ať se vám můžeme ozvat.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Chyba: zadejte e-mail ve tvaru jmeno@domena.cz.'
  if (form.message.trim().length < 10) e.message = 'Chyba: napište nám pár vět o projektu (alespoň 10 znaků).'
  return e
}

/** Bots submit within moments of loading the page; the server drops those. */
const msSincePageOpened = () => Math.round(performance.now())

const FIELD_ORDER: (keyof InquiryForm)[] = ['name', 'email', 'currentSite', 'message']

/**
 * Step 1 version: the four approved fields, plainly styled with the brand
 * tokens. The designed form comes in its own step.
 */
export function ContactForm() {
  const [form, setForm] = useState<InquiryForm>(() => ({ ...EMPTY, currentSite: useUi.getState().heroSite }))
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [result, setResult] = useState<InquiryResult | null>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const setLastInquiry = useUi((s) => s.setLastInquiry)

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
      setStatus('idle')
      if (res.status === 'sent') {
        setLastInquiry({ name: form.name, email: form.email.trim() })
        setForm(EMPTY)
        setSubmitted(false)
        setErrors({})
        navigate(PAGES.inquirySent)
        return
      }
      setResult({ type: 'not-configured', payload })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id={INQUIRY_ANCHOR} className="container-x py-16 sm:py-24">
      <h2 className="text-h2">Poptávka</h2>

      <form ref={formRef} noValidate onSubmit={onSubmit} className="relative mt-8 grid max-w-2xl gap-6" aria-describedby="form-note">
        <Field label="Jméno" name="name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
        <Field label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
        <Field label="Váš web nebo Instagram" optional name="currentSite" inputMode="url" autoComplete="url" value={form.currentSite} onChange={set('currentSite')} />
        <Field label="Něco o vašem projektu" name="message" multiline value={form.message} onChange={set('message')} error={errors.message} />

        {/* Honeypot: hidden from people, bots tend to fill it in. */}
        <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label>
            Web
            <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p id="form-note" className="text-small text-muted sm:max-w-[50%]">
            {nb('Údaje použijeme jen k odpovědi na vaši poptávku.')}{' '}
            <a href={PAGES.privacy} className="text-brand-text underline underline-offset-2">
              Ochrana osobních údajů
            </a>
          </p>
          <button
            type="submit"
            disabled={status === 'sending'}
            className="h-12 shrink-0 rounded-card bg-brand px-6 font-semibold text-on-brand hover:bg-ink hover:text-surface disabled:cursor-wait"
          >
            {status === 'sending' ? 'Odesílám…' : 'Poslat poptávku'}
          </button>
        </div>

        {status === 'error' && (
          <p role="alert" className="rounded-input border-2 border-error p-3 text-small text-error">
            Chyba: zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na{' '}
            <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </p>
        )}
      </form>

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
    'w-full rounded-input border bg-surface-raised px-3 text-body text-ink',
    error ? 'border-2 border-error' : 'border-control-border',
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
    <div>
      <label htmlFor={id} className="mb-2 flex items-baseline gap-2 text-small font-semibold">
        {label}
        {optional && <span className="font-normal text-muted">nepovinné</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={5} maxLength={5000} onChange={(e) => onChange(e.target.value)} className={cx(control, 'min-h-32 py-3')} />
      ) : (
        <input {...shared} type={type} maxLength={200} onChange={(e) => onChange(e.target.value)} className={cx(control, 'h-12')} {...rest} />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}

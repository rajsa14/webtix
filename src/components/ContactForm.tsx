import { CaretDownIcon, PaperPlaneTiltIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { BUDGETS, DEADLINES, WEB_TYPES } from '../data/content'
import { SITE } from '../data/site'
import { buildInquiry, type InquiryForm } from '../lib/inquiry'
import { sendInquiry } from '../lib/sendInquiry'
import { cx, nb, scrollToId } from '../lib/text'
import { countSelected, useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { LivePreview } from './LivePreview'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'
import { ResultDialog, type InquiryResult } from './ResultDialog'
import { SelectionSummary } from './SelectionSummary'

const EMPTY: InquiryForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  webType: '',
  message: '',
  inspiration: '',
  budget: '',
  deadline: '',
}

type Errors = Partial<Record<keyof InquiryForm | 'selection', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s()-]{9,}$/

function validate(form: InquiryForm, selectionCount: number): Errors {
  const e: Errors = {}
  if (form.name.trim().length < 2) e.name = 'Vyplňte prosím své jméno.'
  if (!form.company.trim()) e.company = 'Vyplňte název firmy. Pokud web není pro firmu, napište své jméno.'
  if (!form.email.trim()) e.email = 'Vyplňte e-mail, ať se vám můžeme ozvat.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Zadejte e-mail ve tvaru jmeno@domena.cz.'
  if (form.phone.trim() && !PHONE_RE.test(form.phone.trim())) e.phone = 'Zkontrolujte telefonní číslo, např. +420 777 123 456.'
  if (!form.webType) e.webType = 'Vyberte typ webu.'
  if (form.message.trim().length < 10) e.message = 'Napište nám pár vět o projektu (alespoň 10 znaků).'
  if (selectionCount === 0) e.selection = 'Vyberte v katalogu alespoň jednu položku, ať víme, co se vám líbí.'
  return e
}

const FIELD_ORDER: (keyof Errors)[] = ['name', 'company', 'email', 'phone', 'webType', 'message', 'selection']

export function ContactForm() {
  const [form, setForm] = useState<InquiryForm>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [result, setResult] = useState<InquiryResult | null>(null)
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const selected = useSelection((s) => s.selected)
  const selectionCount = countSelected(selected)
  const toast = useUi((s) => s.toast)

  const set = (key: keyof InquiryForm) => (value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    // After the first submit attempt, errors update live as the user fixes them.
    if (submitted) setErrors(validate(next, selectionCount))
  }

  const liveErrors: Errors = submitted ? { ...errors, selection: selectionCount ? undefined : errors.selection } : {}

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(form, selectionCount)
    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) {
      toast('Zkontrolujte prosím zvýrazněná pole.', 'error')
      const el =
        first === 'selection'
          ? formRef.current?.querySelector<HTMLElement>('#summary-title')
          : formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      if (first !== 'selection') el?.focus({ preventScroll: true })
      return
    }
    // Bots fill hidden fields. Pretend nothing happened.
    if (honeypot.current?.value) return

    const payload = buildInquiry(form, selected)
    setStatus('sending')
    try {
      const res = await sendInquiry(payload)
      setStatus('idle')
      setResult(res.status === 'sent' ? { type: 'sent' } : { type: 'not-configured', payload })
    } catch {
      setStatus('error')
      toast('Odeslání se nepovedlo. Zkuste to prosím znovu.', 'error')
    }
  }

  const closeResult = () => {
    const wasSent = result?.type === 'sent'
    setResult(null)
    if (wasSent) {
      setForm(EMPTY)
      setSubmitted(false)
      setErrors({})
      window.setTimeout(() => scrollToId('domu'), 80)
    }
  }

  return (
    <section id="poptavka" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-4xl">
          <SectionLabel number="03">Poptávka</SectionLabel>
          <h2 className="display-xl">
            Líbí se vám váš výběr?
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {nb(
              'Pošlete nám svou představu. Podle vašeho výběru připravíme ukázku a následně se společně domluvíme na realizaci a ceně.',
            )}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <aside className="lg:order-last">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <LivePreview />
              </Reveal>
            </div>
          </aside>

          <Reveal>
            <form
              ref={formRef}
              noValidate
              onSubmit={onSubmit}
              className="relative rounded-card border border-line bg-ink-900 p-5 sm:p-8"
              aria-describedby="form-note"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Jméno" name="name" autoComplete="name" value={form.name} onChange={set('name')} error={liveErrors.name} placeholder="Jan Novák" />
                <TextField label="Název firmy" name="company" autoComplete="organization" value={form.company} onChange={set('company')} error={liveErrors.company} placeholder="Firma nebo vaše jméno" />
                <TextField label="E-mail" name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={set('email')} error={liveErrors.email} placeholder="jan@firma.cz" />
                <TextField label="Telefon" optional name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={liveErrors.phone} placeholder="+420 777 123 456" />
              </div>

              <ChipGroup
                className="mt-7"
                label="Typ webu"
                name="webType"
                options={WEB_TYPES}
                value={form.webType}
                onChange={set('webType')}
                error={liveErrors.webType}
              />

              <div className="mt-7">
                <TextArea label="Něco o vašem projektu" name="message" value={form.message} onChange={set('message')} error={liveErrors.message} placeholder="Co děláte, pro koho je web a co od něj čekáte?" />
              </div>

              <div className="mt-5">
                <TextField label="Inspirace" optional name="inspiration" value={form.inspiration} onChange={set('inspiration')} placeholder="Odkaz na web, který se vám líbí" hint="Můžete vložit odkaz nebo popsat další představy." />
              </div>

              <ChipGroup
                className="mt-7"
                label="Rozpočet"
                optional
                name="budget"
                options={BUDGETS}
                value={form.budget}
                onChange={set('budget')}
              />

              <div className="mt-7 max-w-xs">
                <SelectField label="Termín" optional name="deadline" options={DEADLINES} value={form.deadline} onChange={set('deadline')} />
              </div>

              {/* Honeypot: hidden from people, bots tend to fill it in. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label>
                  Web
                  <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="mt-9">
                <SelectionSummary invalid={Boolean(liveErrors.selection)} />
                <ErrorText id="selection-error">
                  {liveErrors.selection && (
                    <>
                      {liveErrors.selection}{' '}
                      <button type="button" className="underline underline-offset-2" onClick={() => scrollToId('katalog')}>
                        Otevřít katalog
                      </button>
                    </>
                  )}
                </ErrorText>
              </div>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p id="form-note" className="text-[13px] leading-relaxed text-muted sm:max-w-[48%]">
                  {nb(`Odesláním souhlasíte se zpracováním údajů za účelem odpovědi na poptávku. Napsat můžete i na ${SITE.email}.`)}
                </p>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group/cta relative inline-flex h-13 shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent-strong px-7 font-medium text-white  transition-[background-color,transform] duration-300 hover:-translate-y-px hover:bg-accent active:scale-[0.98] disabled:cursor-wait"
                >
                  {status === 'sending' && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-fg/25 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '320%' }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <span className="relative">{status === 'sending' ? 'Odesílám…' : 'Odeslat můj výběr'}</span>
                  <PaperPlaneTiltIcon
                    size={18}
                    weight="bold"
                    className="relative transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                  />
                </button>
              </div>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 flex items-start gap-2 rounded-[12px] border border-danger/40 bg-danger/10 p-3 text-[14px] text-danger"
                  >
                    <WarningCircleIcon size={18} weight="fill" className="mt-0.5 shrink-0" />
                    <span>
                      Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na{' '}
                      <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                      </a>
                      .
                    </span>
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>

      <ResultDialog result={result} onClose={closeResult} />
    </section>
  )
}

/* ---------- Field primitives ---------- */

const inputBase =
  'w-full rounded-[12px] border bg-ink-850 px-4 text-[15.5px] text-fg placeholder:text-[#8a8a82] transition-[border-color,box-shadow,background-color] duration-200 outline-none focus:bg-ink-800 focus:border-accent focus:ring-4 focus:ring-accent/20'

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-baseline gap-2 text-[14px] font-medium text-fg">
      {children}
      {optional && <span className="text-[12.5px] font-normal text-muted">nepovinné</span>}
    </label>
  )
}

function ErrorText({ id, children }: { id: string; children?: ReactNode }) {
  return (
    <p id={id} className="min-h-0 text-[13px] text-danger" aria-live="polite">
      {children && (
        <span className="mt-2 flex items-start gap-1.5">
          <WarningCircleIcon size={15} weight="fill" className="mt-px shrink-0" />
          <span>{children}</span>
        </span>
      )}
    </p>
  )
}

interface TextFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  optional?: boolean
  placeholder?: string
  type?: string
  inputMode?: 'email' | 'tel' | 'text'
  autoComplete?: string
}

function TextField({ label, name, value, onChange, error, hint, optional, type = 'text', ...rest }: TextFieldProps) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-required={optional ? undefined : true}
        aria-describedby={describedBy}
        className={cx(inputBase, 'h-12', error ? 'border-danger/70' : 'border-line-strong')}
        {...rest}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-[13px] text-muted">
          {hint}
        </p>
      )}
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </div>
  )
}

function TextArea({ label, name, value, onChange, error, placeholder }: TextFieldProps) {
  const id = useId()
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        name={name}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-required
        aria-describedby={error ? `${id}-error` : undefined}
        className={cx(inputBase, 'min-h-36 resize-y py-3 leading-relaxed', error ? 'border-danger/70' : 'border-line-strong')}
      />
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </div>
  )
}

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  optional,
}: {
  label: string
  name: string
  options: readonly string[]
  value: string
  onChange: (v: string) => void
  optional?: boolean
}) {
  const id = useId()
  return (
    <div>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cx(inputBase, 'h-12 appearance-none border-line-strong pr-10', !value && 'text-[#8a8a82]')}
        >
          <option value="">Vyberte termín</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-ink-850 text-fg">
              {o}
            </option>
          ))}
        </select>
        <CaretDownIcon size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </div>
  )
}

function ChipGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  optional,
  className,
}: {
  label: string
  name: string
  options: readonly string[]
  value: string
  onChange: (v: string) => void
  error?: string
  optional?: boolean
  className?: string
}) {
  const id = useId()
  return (
    <fieldset
      className={className}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-required={optional ? undefined : true}
    >
      <legend className="mb-3 flex items-baseline gap-2 text-[14px] font-medium text-fg">
        {label}
        {optional && <span className="text-[12.5px] font-normal text-muted">nepovinné</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative">
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="peer sr-only"
            />
            <span
              className={cx(
                'inline-flex h-10 cursor-pointer select-none items-center rounded-full border px-4 text-[14px] transition-[background-color,border-color,color] duration-200',
                'peer-checked:border-accent peer-checked:bg-accent-strong peer-checked:text-white',
                'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent-soft',
                error ? 'border-danger/60 text-fg' : 'border-line-strong text-muted hover:border-fg/25 hover:text-fg',
              )}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </fieldset>
  )
}

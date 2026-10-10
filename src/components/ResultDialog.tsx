import { useEffect, useRef, useState } from 'react'
import { SITE } from '../data/site'
import { useEscape, useFocusTrap, useScrollLock } from '../lib/hooks'
import type { InquiryPayload } from '../lib/inquiry'
import { mailtoHref } from '../lib/sendInquiry'
import { nb } from '../lib/text'
import { CtaButton } from './Cta'

/** Sent inquiries go to their own page; this dialog only covers sending that is not set up. */
export type InquiryResult = { type: 'not-configured'; payload: InquiryPayload }

export function ResultDialog({ result, onClose }: { result: InquiryResult | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const open = result !== null
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, ref)

  useEffect(() => {
    if (open) ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [open])

  if (!result) return null

  return (
    <div className="fixed inset-0 z-[58] grid place-items-center overflow-y-auto bg-ink/60 p-4">
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
        className="relative w-full max-w-lg rounded-card border border-line bg-surface-raised p-6 sm:p-8"
      >
        <NotConfigured payload={result.payload} onClose={onClose} />
      </div>
    </div>
  )
}

function NotConfigured({ payload, onClose }: { payload: InquiryPayload; onClose: () => void }) {
  const [copy, setCopy] = useState<'idle' | 'done' | 'failed'>('idle')

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(`${payload.subject}\n\n${payload.text}`)
      setCopy('done')
    } catch {
      setCopy('failed')
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Zavřít"
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-card text-muted hover:text-ink"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
      <h2 id="result-title" className="text-h3">
        Poptávka je připravená
      </h2>
      <p className="mt-3 text-muted">
        {nb(
          `Odesílání přímo z webu zatím není zapojené, proto vaše zpráva ještě neodešla. Otevřete připravený e-mail ve své poště, nebo text zkopírujte a pošlete na ${SITE.email}.`,
        )}
      </p>
      <pre className="mt-6 max-h-44 overflow-auto whitespace-pre-wrap rounded-input border border-line bg-surface p-4 text-small text-muted">
        {payload.text}
      </pre>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          data-autofocus
          href={mailtoHref(payload)}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-card bg-brand px-5 font-semibold text-on-brand hover:bg-ink hover:text-surface"
        >
          Otevřít v e-mailu
        </a>
        <CtaButton variant="secondary" size="lg" onClick={copyText} className="flex-1">
          Zkopírovat text
        </CtaButton>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-small text-muted">
        {copy === 'done' && 'Text poptávky je zkopírovaný.'}
        {copy === 'failed' && <span className="text-error">Chyba: kopírování se nepovedlo. Označte text ručně.</span>}
      </p>
    </div>
  )
}

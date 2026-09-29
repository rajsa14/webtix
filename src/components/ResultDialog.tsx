import { CopyIcon, EnvelopeSimpleIcon, SealCheckIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { SITE } from '../data/site'
import { useEscape, useFocusTrap, useScrollLock } from '../lib/hooks'
import type { InquiryPayload } from '../lib/inquiry'
import { mailtoHref } from '../lib/sendInquiry'
import { nb } from '../lib/text'
import { useUi } from '../store/ui'
import { CtaButton } from './Cta'
import { EASE } from './Reveal'

export type InquiryResult = { type: 'sent' } | { type: 'not-configured'; payload: InquiryPayload }

export function ResultDialog({ result, onClose }: { result: InquiryResult | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const open = result !== null
  useScrollLock(open)
  useEscape(open, onClose)
  useFocusTrap(open, ref)

  useEffect(() => {
    if (open) ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
  }, [open])

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[58] grid place-items-center overflow-y-auto bg-ink-950/80 p-4 backdrop-blur-md"
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="result-title"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative w-full max-w-lg overflow-hidden rounded-card border border-line-strong bg-ink-900 p-7 text-center shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9)] sm:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 left-1/2 size-80 -translate-x-1/2 rounded-full bg-accent/25 blur-[90px]"
            />
            {result.type === 'sent' ? <Sent onClose={onClose} /> : <NotConfigured payload={result.payload} onClose={onClose} />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <motion.span
      initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
      className="relative mx-auto grid size-16 place-items-center rounded-full bg-accent-strong text-white shadow-[0_16px_40px_-12px_rgb(79_107_255/0.9)]"
    >
      {children}
    </motion.span>
  )
}

function Sent({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative">
      <Badge>
        <SealCheckIcon size={32} weight="fill" />
      </Badge>
      <h2 id="result-title" className="mt-7 text-[2rem] font-semibold leading-tight tracking-[-0.03em]">
        Děkujeme za vaši představu!
      </h2>
      <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted">
        {nb('Vaši zprávu jsme přijali. Projdeme si váš výběr a ozveme se vám.')}
      </p>
      <CtaButton data-autofocus size="lg" className="mt-8" onClick={onClose} arrow>
        Zpět na WebTix
      </CtaButton>
    </div>
  )
}

function NotConfigured({ payload, onClose }: { payload: InquiryPayload; onClose: () => void }) {
  const toast = useUi((s) => s.toast)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${payload.subject}\n\n${payload.text}`)
      toast('Text poptávky je zkopírovaný')
    } catch {
      toast('Kopírování se nepovedlo. Označte text ručně.', 'error')
    }
  }

  return (
    <div className="relative text-left">
      <button
        type="button"
        onClick={onClose}
        aria-label="Zavřít"
        className="absolute -right-2 -top-2 grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
      >
        <XIcon size={18} />
      </button>
      <Badge>
        <EnvelopeSimpleIcon size={30} weight="fill" />
      </Badge>
      <h2 id="result-title" className="mt-7 text-center text-[1.8rem] font-semibold leading-tight tracking-[-0.03em]">
        Poptávka je připravená
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center leading-relaxed text-muted">
        {nb(
          `Odesílání přímo z webu zatím není zapojené, proto vaše zpráva ještě neodešla. Otevřete připravený e-mail ve své poště, nebo text zkopírujte a pošlete na ${SITE.email}.`,
        )}
      </p>
      <pre className="mt-6 max-h-44 overflow-auto whitespace-pre-wrap rounded-[12px] border border-line bg-ink-950 p-4 font-mono text-[12px] leading-relaxed text-muted">
        {payload.text}
      </pre>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
        <a
          data-autofocus
          href={mailtoHref(payload)}
          className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-accent-strong px-5 font-medium text-white transition-colors hover:bg-accent"
        >
          <EnvelopeSimpleIcon size={18} />
          Otevřít v e-mailu
        </a>
        <CtaButton variant="secondary" size="lg" onClick={copy} icon={<CopyIcon size={18} />} className="flex-1">
          Zkopírovat text
        </CtaButton>
      </div>
    </div>
  )
}

import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { SITE } from '../data/site'
import { nb } from '../lib/text'
import { useUi } from '../store/ui'
import { CtaLink } from './Cta'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

export function Contact() {
  return (
    <section id="kontakt" className="relative py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-line-strong bg-ink-900 px-5 py-20 text-center sm:px-12 sm:py-28">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_0%,rgb(79_107_255/0.28),transparent_70%)]"
            />
            <LogoMark className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-auto opacity-[0.07] sm:h-96" />
            <div className="relative">
              <h2 className="mx-auto max-w-4xl text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-[0.95] tracking-[-0.045em] [font-stretch:92%]">
                Máte projekt? <span className="text-accent-soft">Pojďme ho vytvořit.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {nb('Pošlete nám svou představu a společně zjistíme, co pro vás můžeme vytvořit.')}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink href="#katalog" size="lg" arrow>
                  Začít s výběrem
                </CtaLink>
                <EmailPill />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function EmailPill() {
  const toast = useUi((s) => s.toast)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      toast('E-mail je zkopírovaný')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Kopírování se nepovedlo', 'error')
    }
  }

  return (
    <div className="inline-flex h-13 items-center gap-1 rounded-full border border-line-strong bg-white/[0.03] pl-5 pr-1.5">
      <a href={`mailto:${SITE.email}`} className="rounded-full font-medium text-fg transition-colors hover:text-accent-soft">
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Zkopírovat e-mail"
        className="ml-1 grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/[0.08] hover:text-fg"
      >
        {copied ? <CheckIcon size={17} weight="bold" className="text-success" /> : <CopyIcon size={17} />}
      </button>
    </div>
  )
}

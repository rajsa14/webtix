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
          <div className="relative overflow-hidden rounded-card bg-accent px-5 py-20 text-center text-white sm:px-12 sm:py-28">
            <LogoMark mono className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-auto opacity-20 sm:h-96" />
            <div className="relative">
              <h2 className="mx-auto max-w-5xl text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.93] tracking-[-0.06em]">
                Máte projekt? Pojďme ho postavit.
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/80">
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
    <div className="inline-flex h-13 items-center gap-1 rounded-full border border-white/60 pl-5 pr-1.5">
      <a href={`mailto:${SITE.email}`} className="rounded-full font-medium text-white underline-offset-4 hover:underline">
        {SITE.email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label="Zkopírovat e-mail"
        className="ml-1 grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
      >
        {copied ? <CheckIcon size={17} weight="bold" className="text-white" /> : <CopyIcon size={17} />}
      </button>
    </div>
  )
}

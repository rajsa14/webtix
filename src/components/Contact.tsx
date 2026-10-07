import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { SITE } from '../data/site'
import { useT } from '../i18n'
import { nb } from '../lib/text'
import { useUi } from '../store/ui'
import { CtaLink } from './Cta'
import { LogoMark } from './Logo'
import { Reveal } from './Reveal'

export function Contact() {
  const t = useT()
  return (
    <section id="kontakt" className="relative py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-card bg-accent px-5 py-20 text-center text-white sm:px-12 sm:py-28">
            <LogoMark mono className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-auto opacity-20 sm:h-96" />
            <div className="relative">
              <h2 className="mx-auto max-w-5xl text-[clamp(3rem,9vw,8.5rem)] font-extrabold leading-[0.93] tracking-[-0.06em]">
                {t.contact.title}
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-white/80">
                {nb(t.contact.lead)}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CtaLink href="#katalog" size="lg" arrow>
                  {t.contact.start}
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
  const t = useT()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
      setCopied(true)
      toast(t.contact.copied)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast(t.contact.copyFailed, 'error')
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
        aria-label={t.contact.copyAria}
        className="ml-1 grid size-10 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
      >
        {copied ? <CheckIcon size={17} weight="bold" className="text-white" /> : <CopyIcon size={17} />}
      </button>
    </div>
  )
}

import { EnvelopeSimpleIcon, SealCheckIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { PAGES, SITE } from '../../data/site'
import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'
import { useUi } from '../../store/ui'
import { CtaLink } from '../Cta'
import { SectionLabel } from '../Decor'
import { Reveal } from '../Reveal'

const NEXT_STEPS = [
  {
    number: '01',
    title: 'Projdeme váš výběr',
    text: 'Podíváme se na písmo, barvy, styl i vše, co jste nám o projektu napsali.',
  },
  {
    number: '02',
    title: 'Ozveme se vám',
    text: 'Napíšeme vám na zadaný e-mail. Když nám něco nebude jasné, doptáme se.',
  },
  {
    number: '03',
    title: 'Připravíme ukázku',
    text: 'Podle vaší představy vytvoříme návrh a pak se společně domluvíme na ceně a realizaci.',
  },
]

/** Where the contact form sends people after their inquiry went out. */
export function InquirySent() {
  usePageMeta({ title: 'Poptávka odeslána', noindex: true })
  const inquiry = useUi((s) => s.lastInquiry)
  const firstName = inquiry?.name.trim().split(/\s+/)[0]

  return (
    <section className="container-x relative overflow-hidden pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_20%,rgb(36_51_255/0.1),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.15 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-accent-strong text-white"
        >
          <SealCheckIcon size={40} weight="fill" />
        </motion.span>
        <SectionLabel className="mt-8 justify-center">Poptávka odeslána</SectionLabel>
        <h1 className="display-xl">
          Děkujeme{firstName ? `, ${firstName}` : ''}
          <span className="text-accent">!</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {nb('Vaši poptávku jsme přijali a už je u nás. Projdeme si váš výběr a ozveme se vám')}
          {inquiry?.email ? (
            <>
              {' na '}
              <strong className="font-medium text-fg">{inquiry.email}</strong>.
            </>
          ) : (
            '.'
          )}
        </p>
      </div>

      <div className="relative mt-16 sm:mt-24">
        <Reveal>
          <h2 className="text-[1.6rem] font-extrabold tracking-[-0.04em]">Co bude dál</h2>
        </Reveal>
        <ol className="mt-6 grid gap-4 md:grid-cols-3 lg:gap-5">
          {NEXT_STEPS.map((step, i) => (
            <li key={step.number}>
              <Reveal delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col border-t border-fg pt-5">
                  <span className="font-display text-[3.5rem] font-extrabold leading-none tracking-[-0.06em] text-accent" aria-hidden="true">
                    {step.number}
                  </span>
                  <h3 className="mt-4 text-[1.4rem] font-extrabold leading-[1.05] tracking-[-0.04em]">
                    <span className="sr-only">Krok {step.number}: </span>
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{nb(step.text)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <Reveal className="relative mt-16 sm:mt-20">
        <div className="flex flex-col gap-6 rounded-card border border-line bg-ink-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-accent">
              <EnvelopeSimpleIcon size={20} weight="bold" />
            </span>
            <div>
              <p className="font-medium">Napadlo vás ještě něco?</p>
              <p className="mt-1 leading-relaxed text-muted">
                {nb('Doplňky, odkazy nebo podklady nám pošlete na ')}
                <a href={`mailto:${SITE.email}`} className="text-fg underline underline-offset-2 hover:text-accent-soft">
                  {SITE.email}
                </a>
                .
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <CtaLink href={PAGES.references} variant="secondary">
              Naše reference
            </CtaLink>
            <CtaLink href={PAGES.home} arrow>
              Zpět na úvod
            </CtaLink>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

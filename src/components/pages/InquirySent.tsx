import { PAGES, SITE } from '../../data/site'
import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'
import { useUi } from '../../store/ui'
import { CtaLink } from '../Cta'

// Copy below is unchanged from before the redesign; it gets rewritten with the form in step 3.
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
    <section className="container-x py-16 sm:py-24">
      <p className="label text-muted">Poptávka odeslána</p>
      <h1 className="mt-4 text-h1 sm:text-display">
        Děkujeme{firstName ? `, ${firstName}` : ''}
        <span className="text-brand-text">!</span>
      </h1>
      <p className="measure mt-6 text-muted">
        {nb('Vaši poptávku jsme přijali a už je u nás. Projdeme si váš výběr a ozveme se vám')}
        {inquiry?.email ? (
          <>
            {' na '}
            <strong className="font-semibold text-ink">{inquiry.email}</strong>.
          </>
        ) : (
          '.'
        )}
      </p>

      <h2 className="mt-16 text-h2">Co bude dál</h2>
      <ol className="mt-6 grid gap-8 md:grid-cols-3">
        {NEXT_STEPS.map((step) => (
          <li key={step.number} className="border-t-2 border-ink pt-4">
            <span className="text-h2 text-brand-text" aria-hidden="true">
              {step.number}
            </span>
            <h3 className="mt-2 text-h3">
              <span className="sr-only">Krok {step.number}: </span>
              {step.title}
            </h3>
            <p className="mt-2 text-muted">{nb(step.text)}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16 flex flex-col gap-6 rounded-card border border-line bg-surface-raised p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="font-semibold">Napadlo vás ještě něco?</p>
          <p className="mt-1 text-muted">
            {nb('Doplňky, odkazy nebo podklady nám pošlete na ')}
            <a href={`mailto:${SITE.email}`} className="text-brand-text underline underline-offset-2">
              {SITE.email}
            </a>
            .
          </p>
        </div>
        <CtaLink href={PAGES.home} arrow>
          Zpět na úvod
        </CtaLink>
      </div>
    </section>
  )
}

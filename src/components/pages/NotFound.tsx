import { PAGES } from '../../data/site'
import { usePageMeta } from '../../lib/meta'
import { CtaLink } from '../Cta'

export function NotFound() {
  usePageMeta({ title: 'Stránka nenalezena', noindex: true })

  return (
    <section className="container-x py-24 lg:py-40">
      <p className="mono m-0 mb-4 text-[11px] text-muted lg:mb-6 lg:text-[12px]">404</p>
      <h1 className="m-0 text-[40px] leading-[0.96] tracking-[-0.035em] lg:text-h2">Tady nic není.</h1>
      <p className="m-0 mt-5 max-w-[65ch] text-[16px] leading-6 text-ink-soft lg:mt-8 lg:text-[18px] lg:leading-7">
        Stránku, kterou hledáte, jsme nenašli. Zkuste to od začátku.
      </p>
      <CtaLink href={PAGES.home} size="lg" className="mt-10">
        Zpět na úvod
      </CtaLink>
    </section>
  )
}

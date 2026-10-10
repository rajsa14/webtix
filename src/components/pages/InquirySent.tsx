import { PAGES } from '../../data/site'
import { usePageMeta } from '../../lib/meta'
import { CtaLink } from '../Cta'

/** Where the enquiry form sends people after their enquiry went out. */
export function InquirySent() {
  usePageMeta({ title: 'Poptávka odeslána', noindex: true })

  return (
    <section className="container-x py-24 lg:py-40">
      <h1 className="m-0 max-w-[14ch] text-[40px] leading-[0.96] tracking-[-0.035em] lg:text-h2">Děkujeme, zprávu jsme dostali.</h1>
      <p className="m-0 mt-5 text-[16px] leading-6 text-ink-soft lg:mt-8 lg:text-[18px] lg:leading-7">Ozveme se vám do dvou pracovních dnů.</p>
      <CtaLink href={PAGES.home} size="lg" className="mt-10">
        Zpět na úvod
      </CtaLink>
    </section>
  )
}

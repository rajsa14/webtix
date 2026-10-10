import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'
import { CtaLink } from '../Cta'

export function NotFound() {
  usePageMeta({ title: 'Stránka nenalezena', noindex: true })

  return (
    <section className="container-x py-24 sm:py-32">
      <p className="text-[72px] leading-none font-bold tracking-[-0.045em] text-terracotta lg:text-[96px]">404</p>
      <h1 className="mt-6 text-[40px] leading-[0.96] tracking-[-0.035em] lg:text-h2">Tahle stránka tu není</h1>
      {/* Copy unchanged from before the redesign; it mentions the old catalog and gets rewritten later. */}
      <p className="max-w-[65ch] mt-4 text-muted">
        {nb('Odkaz je nejspíš starý nebo s překlepem. Na úvodní stránce najdete katalog i kontakt.')}
      </p>
      <div className="mt-10">
        <CtaLink href="/" size="lg" arrow>
          Zpět na úvod
        </CtaLink>
      </div>
    </section>
  )
}

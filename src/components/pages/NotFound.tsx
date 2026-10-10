import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'
import { CtaLink } from '../Cta'

export function NotFound() {
  usePageMeta({ title: 'Stránka nenalezena', noindex: true })

  return (
    <section className="container-x py-24 sm:py-32">
      <p className="text-display text-brand-text">404</p>
      <h1 className="mt-6 text-h1">Tahle stránka tu není</h1>
      {/* Copy unchanged from before the redesign; it mentions the old catalog and gets rewritten later. */}
      <p className="measure mt-4 text-muted">
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

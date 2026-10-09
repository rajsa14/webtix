import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'
import { CtaLink } from '../Cta'

export function NotFound() {
  usePageMeta({ title: 'Stránka nenalezena', noindex: true })

  return (
    <>
      <section className="container-x relative overflow-hidden pb-24 pt-36 text-center sm:pb-36 sm:pt-48">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_30%,rgb(36_51_255/0.1),transparent_70%)]"
        />
        <div className="relative">
          <p className="font-display text-[clamp(7rem,26vw,16rem)] font-extrabold leading-[0.8] tracking-[-0.07em] text-accent">
            404
          </p>
          <h1 className="mt-8 text-[clamp(1.9rem,4.5vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
            Tahle stránka tu není
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
            {nb('Odkaz je nejspíš starý nebo s překlepem. Na úvodní stránce najdete katalog i kontakt.')}
          </p>
          <div className="mt-10">
            <CtaLink href="/" size="lg" arrow>
              Zpět na úvod
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  )
}

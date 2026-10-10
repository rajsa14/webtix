import { PAGES } from '../data/site'
import { nb } from '../lib/text'
import { useConsent } from '../store/consent'

/**
 * Small, bottom corner, never over the hero's content. Both answers are one
 * click and the same size, so declining is as easy as agreeing.
 * Hidden until CONSENT_NEEDED in site.ts is switched on (Google Ads).
 */
export function CookieBanner() {
  const open = useConsent((s) => s.bannerOpen)
  const decide = useConsent((s) => s.decide)
  if (!open) return null

  const choice = 'h-10 flex-1 rounded-card px-4 text-small font-semibold'

  return (
    <section
      aria-labelledby="cookies-title"
      className="fixed bottom-4 right-4 z-50 w-[min(340px,calc(100%-2rem))] rounded-card border border-line bg-surface-raised p-4"
    >
      <h2 id="cookies-title" className="text-body font-semibold">
        Souhlas s cookies
      </h2>
      <p className="mt-1 text-small text-muted">
        {nb('Bez vašeho souhlasu ukládáme jen to, co web nutně potřebuje.')}{' '}
        <a href={PAGES.privacy} className="text-brand-text underline underline-offset-2">
          Více informací
        </a>
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => decide('necessary')} className={`${choice} border-2 border-ink text-ink`}>
          Jen nezbytné
        </button>
        <button type="button" onClick={() => decide('all')} className={`${choice} bg-brand text-on-brand`}>
          Povolit
        </button>
      </div>
    </section>
  )
}

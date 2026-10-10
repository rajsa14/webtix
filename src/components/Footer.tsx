import { CONSENT_NEEDED, PAGES, SITE } from '../data/site'
import { team } from '../data/team'
import { useConsent } from '../store/consent'
import { Wordmark } from './Wordmark'

export function Footer() {
  const openCookies = useConsent((s) => s.openBanner)

  return (
    <footer className="border-t border-line pb-12 pt-16">
      <div className="container-x">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href={PAGES.home} className="inline-block" aria-label={`${SITE.name}, úvodní stránka`}>
              <Wordmark height={48} />
            </a>
            <p className="mt-4 text-muted">{team.map((m) => m.name).join(' a ')}</p>
          </div>
          <a href={`mailto:${SITE.email}`} className="text-h3 font-semibold text-brand-text underline underline-offset-4">
            {SITE.email}
          </a>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-line pt-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>
              © {SITE.year} {SITE.name}
            </p>
            {SITE.legal.length > 0 && <p className="mt-1">{SITE.legal.join(' · ')}</p>}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={PAGES.privacy} className="underline-offset-4 hover:text-ink hover:underline">
              Ochrana osobních údajů
            </a>
            <a href={PAGES.terms} className="underline-offset-4 hover:text-ink hover:underline">
              Obchodní podmínky
            </a>
            {CONSENT_NEEDED && (
              <button type="button" onClick={openCookies} className="underline-offset-4 hover:text-ink hover:underline">
                Nastavení cookies
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

import { CONSENT_NEEDED, ICO, PAGES, SITE } from '../data/site'
import { useConsent } from '../store/consent'
import { Wordmark } from './Wordmark'

/**
 * Footer from the design (Rest.dc.html / RestMobile.dc.html): wordmark,
 * e-mail and IČO, legal links. Desktop: one row on the 12-column grid.
 * Phone: stacked. The IČO line shows once ICO is set in src/data/site.ts.
 */
export function Footer() {
  const openCookies = useConsent((s) => s.openBanner)
  const link = 'text-ink-soft underline underline-offset-2 hover:text-ink'

  return (
    <footer className="container-x flex flex-col gap-6 py-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6 lg:py-16">
      <a href={PAGES.home} aria-label={`${SITE.name}, úvodní stránka`} className="self-start lg:col-span-3">
        {/* 140px wide on phones, 200px on desktop (both use the master cut, 32px tall or more). */}
        <Wordmark height={34} className="lg:hidden" />
        <Wordmark height={48} className="hidden lg:block" />
      </a>
      <p className="m-0 text-[15px] leading-[22px] text-ink-soft lg:col-span-3 lg:col-start-5">
        <a href={`mailto:${SITE.email}`} className="text-ink-soft no-underline hover:underline">
          {SITE.email}
        </a>
        {ICO && (
          <>
            <br />
            IČO {ICO}
          </>
        )}
      </p>
      <p className="m-0 flex flex-col items-start text-[14px] leading-6 text-ink-soft lg:col-span-4 lg:leading-[22px] lg:col-start-9 lg:block lg:text-right lg:text-[15px]">
        <a href={PAGES.privacy} className={link}>
          Ochrana osobních údajů
        </a>
        <span aria-hidden="true" className="hidden lg:inline">
          {' · '}
        </span>
        <a href={PAGES.terms} className={link}>
          Obchodní podmínky
        </a>
        {CONSENT_NEEDED && (
          <>
            <span aria-hidden="true" className="hidden lg:inline">
              {' · '}
            </span>
            <button type="button" onClick={openCookies} className={`${link} cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[inherit]`}>
              Nastavení cookies
            </button>
          </>
        )}
      </p>
    </footer>
  )
}

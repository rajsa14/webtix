import { NAV_LINKS, PAGES, SITE } from '../data/site'
import { team } from '../data/team'
import { useConsent } from '../store/consent'
import { PlayfulWord } from './Decor'
import { Logo } from './Logo'

export function Footer() {
  const openCookies = useConsent((s) => s.openBanner)
  const heading = 'mb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted'

  return (
    <footer className="relative overflow-hidden border-t border-fg pb-28 pt-16">
      <div className="container-x">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href={PAGES.home} className="inline-block rounded-full" aria-label={`${SITE.name}, úvodní stránka`}>
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-lg leading-snug text-fg/90">{SITE.tagline}</p>
          </div>

          <nav aria-label="Navigace v patičce">
            <h2 className={heading}>Navigace</h2>
            <ul className="grid gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-fg/85 transition-colors hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={heading}>Kontakt</h2>
            <a href={`mailto:${SITE.email}`} className="text-fg/85 transition-colors hover:text-accent">
              {SITE.email}
            </a>
          </div>

          <div>
            <h2 className={heading}>Tým</h2>
            <p className="leading-relaxed text-fg/85">{team.map((m) => m.name).join(' & ')}</p>
          </div>
        </div>

        {/* Sized to the container, not the viewport, so the word always fits on one line. */}
        <div className="@container mt-16">
          <PlayfulWord
            text="WebTix."
            className="whitespace-nowrap font-display text-[27cqw] font-extrabold leading-[0.78] tracking-[-0.075em] text-fg"
          />
        </div>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-6 text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>
              © {SITE.year} {SITE.name}
            </p>
            {SITE.legal.length > 0 && <p className="mt-1 text-[13px] text-faint">{SITE.legal.join(' · ')}</p>}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={PAGES.privacy} className="transition-colors hover:text-fg">
              Ochrana osobních údajů
            </a>
            <a href={PAGES.terms} className="transition-colors hover:text-fg">
              Obchodní podmínky
            </a>
            <button type="button" onClick={openCookies} className="transition-colors hover:text-fg">
              Nastavení cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { useState } from 'react'
import { NAV_LINKS, SITE } from '../data/site'
import { team } from '../data/team'
import { useT } from '../i18n'
import { LegalDialog, type LegalDoc } from './LegalDialog'
import { PlayfulWord } from './Decor'
import { LangSwitch } from './LangSwitch'
import { Logo } from './Logo'

export function Footer() {
  const [doc, setDoc] = useState<LegalDoc | null>(null)
  const t = useT()
  const heading = 'mb-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted'

  return (
    <footer className="relative overflow-hidden border-t border-fg pb-28 pt-16">
      <div className="container-x">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="#domu" className="inline-block rounded-full" aria-label={t.nav.home(SITE.name)}>
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-lg leading-snug text-fg/90">{t.footer.tagline}</p>
            <LangSwitch id="lang-footer" className="mt-6 w-fit" />
          </div>

          <nav aria-label={t.footer.navAria}>
            <h2 className={heading}>{t.footer.nav}</h2>
            <ul className="grid gap-2.5">
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-fg/85 transition-colors hover:text-accent">
                    {t.nav.links[id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={heading}>{t.footer.contact}</h2>
            <a href={`mailto:${SITE.email}`} className="text-fg/85 transition-colors hover:text-accent">
              {SITE.email}
            </a>
          </div>

          <div>
            <h2 className={heading}>{t.footer.team}</h2>
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
            <button type="button" onClick={() => setDoc('privacy')} className="transition-colors hover:text-fg">
              {t.footer.privacy}
            </button>
            <button type="button" onClick={() => setDoc('terms')} className="transition-colors hover:text-fg">
              {t.footer.terms}
            </button>
          </div>
        </div>
      </div>
      <LegalDialog doc={doc} onClose={() => setDoc(null)} />
    </footer>
  )
}

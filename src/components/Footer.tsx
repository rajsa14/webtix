import { useState } from 'react'
import { NAV_LINKS, SITE } from '../data/site'
import { team } from '../data/team'
import { LegalDialog, type LegalDoc } from './LegalDialog'
import { Logo } from './Logo'

export function Footer() {
  const [doc, setDoc] = useState<LegalDoc | null>(null)
  const heading = 'mb-4 font-sans text-[13px] font-medium text-muted'

  return (
    <footer className="relative overflow-hidden border-t border-line pb-28 pt-16">
      <div className="container-x">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="#domu" className="inline-block rounded-full" aria-label={`${SITE.name}, zpět nahoru`}>
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-lg leading-snug text-fg/90">{SITE.tagline}</p>
          </div>

          <nav aria-label="Navigace v patičce">
            <h2 className={heading}>Navigace</h2>
            <ul className="grid gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="text-fg/85 transition-colors hover:text-accent-soft">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={heading}>Kontakt</h2>
            <a href={`mailto:${SITE.email}`} className="text-fg/85 transition-colors hover:text-accent-soft">
              {SITE.email}
            </a>
          </div>

          <div>
            <h2 className={heading}>Tým</h2>
            <p className="leading-relaxed text-fg/85">{team.map((m) => m.name).join(' & ')}</p>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none mt-16 select-none text-center font-display text-[clamp(5rem,23vw,21rem)] font-bold leading-[0.78] tracking-[-0.06em] text-white/[0.035]"
        >
          WebTix
        </p>

        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-6 text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {SITE.year} {SITE.name}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button type="button" onClick={() => setDoc('privacy')} className="transition-colors hover:text-fg">
              Ochrana osobních údajů
            </button>
            <button type="button" onClick={() => setDoc('terms')} className="transition-colors hover:text-fg">
              Obchodní podmínky
            </button>
          </div>
        </div>
      </div>
      <LegalDialog doc={doc} onClose={() => setDoc(null)} />
    </footer>
  )
}

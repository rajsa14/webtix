import { CONSENT_NEEDED, ICO, INQUIRY_ANCHOR, PAGES, SITE } from '../data/site'
import { useConsent } from '../store/consent'
import { PlayfulWordmark } from './PlayfulWordmark'

/**
 * Closing footer: a full-width ink block with the hero's line, one last
 * "Chci návrh", the huge cream wordmark (letters from public/brand, never redrawn;
 * they jump on hover),
 * then e-mail, IČO (only once ICO is set in src/data/site.ts) and legal links.
 */
export function Footer() {
  const openCookies = useConsent((s) => s.openBanner)
  const link = 'text-paper/70 underline underline-offset-4 hover:text-paper'

  return (
    <footer className="bg-ink text-paper" style={{ ['--focus' as string]: 'var(--color-cream)' }}>
      <div className="container-x pb-8 pt-20 lg:pb-10 lg:pt-28">
        <div data-reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <p className="m-0 max-w-[15ch] text-[38px] font-bold leading-[0.96] tracking-[-0.035em] lg:text-[clamp(46px,4.6vw,72px)] lg:leading-[0.95]">
            Podíváme se na váš web. Pak vám ukážeme <em className="scribble italic text-pink">lepší.</em>
          </p>
          <a
            href={`/#${INQUIRY_ANCHOR}`}
            className="group inline-flex items-center gap-3 self-start rounded-full bg-cream px-7 py-4 text-[17px] font-medium text-ink no-underline transition-colors hover:bg-pink lg:self-end lg:px-9 lg:py-5 lg:text-[19px]"
          >
            Chci návrh
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 8h11M9 4l4 4-4 4" />
            </svg>
          </a>
        </div>

        {/* Hover a letter and it jumps; click it and it turns pink. */}
        <PlayfulWordmark className="mt-16 text-cream lg:mt-24" />

        <div className="mt-8 flex flex-col gap-3 border-0 border-t border-solid border-paper/15 pt-6 text-[14px] leading-6 text-paper/70 lg:mt-10 lg:flex-row lg:items-center lg:justify-between lg:text-[15px]">
          <p className="m-0">
            <a href={`mailto:${SITE.email}`} className="text-paper/70 no-underline hover:text-paper hover:underline">
              {SITE.email}
            </a>
            {ICO && <span> · IČO {ICO}</span>}
          </p>
          <p className="m-0 flex flex-col items-start gap-1 lg:flex-row lg:items-center lg:gap-6">
            <a href={PAGES.privacy} className={link}>
              Ochrana osobních údajů
            </a>
            <a href={PAGES.terms} className={link}>
              Obchodní podmínky
            </a>
            {CONSENT_NEEDED && (
              <button type="button" onClick={openCookies} className={`${link} cursor-pointer border-0 bg-transparent p-0 font-sans text-[inherit]`}>
                Nastavení cookies
              </button>
            )}
          </p>
          <p className="m-0">
            © {SITE.year} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  )
}

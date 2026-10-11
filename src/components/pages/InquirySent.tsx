import { PAGES, PREVIEW_DAYS, SITE } from '../../data/site'
import { usePageMeta } from '../../lib/meta'
import { revealDelay } from '../../lib/motion'
import { cx, nb } from '../../lib/text'
import { useUi } from '../../store/ui'
import { CtaLink } from '../Cta'
import { ShopAfter, ShopBefore, ShopScreen } from '../home/Shop'

/*
 * Where the enquiry form sends people after their enquiry went out. Built for
 * the customer: a clear confirmation; where we will reply (so a mistyped
 * e-mail is caught now, with the fix right there); what happens next, using
 * only promises the site already makes; and something to do while waiting.
 * All copy approved by Dan (2026-10-11).
 */

const STEPS = [
  { when: 'Teď', title: 'Zprávu máme', text: 'Právě nám přišla do schránky.', done: true },
  { when: 'Do 2 pracovních dnů', title: 'Ozveme se vám', text: 'Napíšeme na váš e-mail a domluvíme se, z čeho návrh postavíme.' },
  { when: `Do ${PREVIEW_DAYS} pracovních dnů od podkladů`, title: 'Uvidíte návrh', text: 'Hotovou úvodní stránku vašeho nového webu. Zdarma a nezávazně.' },
  { when: 'Pak', title: 'Rozhodnete se', text: 'Líbí se vám? Dokončíme zbytek. Nelíbí? Nic neplatíte.' },
]

export function InquirySent() {
  usePageMeta({ title: 'Poptávka odeslána', noindex: true })
  const inquiry = useUi((s) => s.lastInquiry)

  return (
    <>
      <section className="container-x flex flex-col gap-14 pb-20 pt-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:pb-28 lg:pt-16">
        <div data-reveal className="flex flex-col lg:col-span-6">
          <p className="mono m-0 mb-5 flex items-center gap-2 text-[11px] text-terracotta lg:mb-6 lg:text-[12px]">
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="8" cy="8" r="7" />
              <path d="M4.8 8.2 7 10.4 11.2 5.8" />
            </svg>
            Poptávka odeslána
          </p>
          <h1 className="m-0 text-[44px] leading-[0.94] tracking-[-0.04em] text-balance lg:text-[clamp(56px,5.6vw,88px)] lg:leading-[0.92]">
            Děkujeme, zprávu jsme <em className="scribble italic text-terracotta">dostali.</em>
          </h1>
          <p className="m-0 mt-6 text-[18px] leading-7 text-ink-soft lg:mt-8 lg:text-[21px] lg:leading-[32px]">Ozveme se vám do dvou pracovních dnů.</p>

          {inquiry && (
            <div className="mt-8 rounded-[14px] border border-solid border-ink/15 bg-white p-5 lg:mt-10 lg:p-6">
              <p className="mono m-0 text-[11px] text-muted lg:text-[12px]">Co jsme od vás dostali</p>
              <dl className="m-0 mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[16px] leading-6 lg:text-[17px]">
                <dt className="text-ink-soft">Odpovíme na</dt>
                <dd className="m-0 break-all font-bold">{inquiry.email}</dd>
                {inquiry.currentSite && (
                  <>
                    <dt className="text-ink-soft">Váš web</dt>
                    <dd className="m-0 break-all">{inquiry.currentSite}</dd>
                  </>
                )}
              </dl>
              <p className="m-0 mt-4 text-[14px] leading-5 text-ink-soft">
                {nb('Spletli jste se v e-mailu? Napište nám na ')}
                <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-2">
                  {SITE.email}
                </a>
                .
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10">
            <CtaLink href={`/#navrhy`} size="lg">
              Mezitím se podívejte na ukázky
            </CtaLink>
            <CtaLink href={PAGES.home} size="lg" variant="secondary">
              Zpět na úvod
            </CtaLink>
          </div>
        </div>

        {/* The promise, shown: an old site turning into a new one, like the one we will make for them. */}
        <div data-reveal style={revealDelay(1, 200)} aria-hidden="true" className="relative flex flex-col items-center gap-4 rounded-[20px] bg-pink px-6 py-10 lg:col-span-5 lg:col-start-8 lg:flex-row lg:items-center lg:justify-end lg:py-16 lg:pr-14">
          <div className="order-first flex items-end gap-2 lg:mr-auto lg:flex-col lg:items-start lg:self-start">
            <p className="hand m-0 w-[180px] -rotate-3 text-[24px] lg:w-[130px] lg:text-[27px]">Takhle to chystáme i pro váš web.</p>
            <svg viewBox="0 0 60 50" className="h-10 w-12 rotate-[60deg] text-pen lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4 C 10 22, 26 36, 52 40" />
              <path d="M41 32 L 53 40 L 41 47" />
            </svg>
          </div>
          <div className="thanks-phone relative h-[460px] w-[220px] overflow-hidden rounded-[30px] border-[7px] border-solid border-ink bg-ink shadow-[0_30px_50px_-28px_rgba(22,17,16,0.55)]">
            <div className="absolute inset-0 bg-[#EFEFEF]">
              <ShopScreen scale={0.606}>
                <ShopBefore />
              </ShopScreen>
            </div>
            <div className="thanks-after absolute inset-0 bg-[#FFD23F]">
              <ShopScreen scale={0.606}>
                <ShopAfter />
              </ShopScreen>
            </div>
            <div className="thanks-band absolute inset-x-0 top-0 -mt-[5px] flex h-[10px] items-center bg-cream">
              <span className="block w-full border-0 border-t-2 border-dashed border-terracotta" />
            </div>
          </div>
          
        </div>
      </section>

      <section aria-labelledby="dal-title" className="bg-cream text-ink">
        <div className="container-x py-20 lg:py-28">
          <h2 id="dal-title" data-reveal className="m-0 text-[36px] leading-[0.96] tracking-[-0.035em] lg:text-[clamp(44px,4.4vw,64px)]">
            Co bude <em className="scribble italic text-terracotta">dál</em>
          </h2>
          <ol className="relative m-0 mt-12 grid list-none gap-10 p-0 lg:mt-16 lg:grid-cols-4 lg:gap-6">
            {/* The dashed path that joins the steps (desktop). */}
            <span aria-hidden="true" className="absolute left-0 right-0 top-[19px] hidden border-0 border-t-2 border-dashed border-ink/25 lg:block" />
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal style={revealDelay(i, 140)} className="relative flex gap-4 lg:flex-col lg:gap-5">
                <span
                  className={cx(
                    'relative grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-bold',
                    s.done ? 'bg-pink text-ink' : 'border-2 border-solid border-ink/40 bg-cream text-ink',
                    i === 1 && 'thanks-next',
                  )}
                >
                  {s.done ? (
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                  {s.done && <span className="sr-only">Hotovo: </span>}
                </span>
                <div className="flex flex-col gap-1.5">
                  <span className="mono text-[11px] text-muted lg:text-[12px]">{s.when}</span>
                  <h3 className="m-0 text-[22px] leading-7 lg:text-[24px] lg:leading-[30px]">{s.title}</h3>
                  <p className="m-0 max-w-[340px] text-[16px] leading-6 text-ink-soft lg:text-[17px] lg:leading-[26px]">{nb(s.text)}</p>
                </div>
              </li>
            ))}
          </ol>
          <p data-reveal className="m-0 mt-14 text-[16px] leading-6 text-ink-soft lg:text-[18px]">
            {nb('Chcete nám rovnou poslat fotky, menu nebo ceník? Pošlete je na ')}
            <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-4">
              {SITE.email}
            </a>
            {nb(', návrh pak bude o to přesnější.')}
          </p>
        </div>
      </section>
    </>
  )
}

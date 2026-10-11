import { PREVIEW_DAYS, SITE } from '../../data/site'
import { usePageMeta } from '../../lib/meta'
import { revealDelay } from '../../lib/motion'
import { cx, nb } from '../../lib/text'
import { useUi } from '../../store/ui'
import { ShopAfter, ShopBefore, ShopScreen } from '../home/Shop'

/*
 * Where the enquiry form sends people after their enquiry went out. Built for
 * the customer: a clear confirmation; where we will reply (so a mistyped
 * e-mail is caught now, with the fix right there); what happens next, using
 * only promises the site already makes; and something to do while waiting.
 * All copy approved by Dan (2026-10-11).
 */

const STEPS = [
  { when: 'Teď', title: 'Máme vaši zprávu', text: 'Nemusíte dělat nic dalšího. Podíváme se na váš web a na to, co jste nám poslali.', current: true },
  { when: 'Do 2 pracovních dnů', title: 'Ozveme se vám', text: 'Napíšeme vám a případně si vyžádáme podklady, které nám pomůžou připravit návrh.' },
  { when: `Do ${PREVIEW_DAYS} pracovních dnů od podkladů`, title: 'Uvidíte svůj návrh', text: 'Ukážeme vám hotovou úvodní stránku vašeho nového webu. Zdarma a nezávazně.' },
  { when: 'Pak', title: 'Rozhodnete se vy', text: 'Pokud se vám návrh líbí, domluvíme se na dokončení. Pokud ne, nemusíte pokračovat a nic neplatíte.' },
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
              <dl className="m-0 mt-3 grid grid-cols-1 gap-y-1 lg:grid-cols-[auto_1fr] lg:gap-x-5 lg:gap-y-2 text-[16px] leading-6 lg:text-[17px]">
                <dt className="text-ink-soft">Odpovíme na</dt>
                <dd className="m-0 mb-3 min-w-0 [overflow-wrap:anywhere] font-bold lg:mb-0">{inquiry.email}</dd>
                {inquiry.currentSite && (
                  <>
                    <dt className="text-ink-soft">Váš web nebo Instagram</dt>
                    <dd className="m-0 min-w-0 [overflow-wrap:anywhere]">{inquiry.currentSite}</dd>
                  </>
                )}
              </dl>
              <p className="m-0 mt-4 text-[14px] leading-5 text-ink-soft">
                {nb('Něco nesedí? Napište nám na ')}
                <a href={`mailto:${SITE.email}`} className="text-ink underline underline-offset-2">
                  {SITE.email}
                </a>
                .
              </p>
            </div>
          )}

          <a href="/#navrhy" className="mt-6 inline-flex min-h-11 items-center gap-2 self-start text-[16px] text-ink-soft underline underline-offset-4 hover:text-terracotta lg:mt-8">
            Prohlédnout ukázky <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* The promise, shown: an old site turning into a new one, like the one we will make for them. */}
        <div data-reveal style={revealDelay(1, 200)} className="relative flex flex-col items-center gap-4 rounded-[20px] bg-pink px-6 py-10 lg:col-span-5 lg:col-start-8 lg:flex-row lg:items-center lg:justify-end lg:py-16 lg:pr-14">
          <div className="order-first flex items-end gap-2 lg:mr-auto lg:flex-col lg:items-start lg:self-start">
            <p className="hand m-0 w-[180px] -rotate-3 text-[24px] lg:w-[130px] lg:text-[27px]">Takhle to chystáme i pro váš web.</p>
            <svg aria-hidden="true" viewBox="0 0 60 50" className="h-10 w-12 rotate-[60deg] text-pen lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 4 C 10 22, 26 36, 52 40" />
              <path d="M41 32 L 53 40 L 41 47" />
            </svg>
          </div>
          <div aria-hidden="true" className="thanks-phone relative h-[460px] w-[220px] overflow-hidden rounded-[30px] border-[7px] border-solid border-ink bg-ink shadow-[0_30px_50px_-28px_rgba(22,17,16,0.55)]">
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
        {/* Editorial timeline and copy approved by Dan (2026-10-11). Always readable without motion. */}
        <div className="container-x pb-[72px] pt-[72px] lg:grid lg:grid-cols-[35%_65%] lg:py-28">
          <div>
            <h2 id="dal-title" className="m-0 text-[40px] leading-[0.96] tracking-[-0.035em] lg:text-[64px]">
              Co bude <em className="scribble italic text-terracotta">dál</em>
            </h2>
            <p className="m-0 mt-[18px] max-w-[28ch] text-[16px] leading-6 text-ink-soft lg:mt-6 lg:text-[18px] lg:leading-7">
              Teď už víte, co bude následovat.
            </p>
          </div>
          <ol className="m-0 ml-[7px] mt-11 list-none p-0 lg:ml-7 lg:mt-0">
            {STEPS.map((s, i) => (
              <li key={s.title} aria-current={s.current ? 'step' : undefined} className={cx('relative border-0 border-l border-solid pb-9 pl-[27px] lg:pb-12 lg:pl-10', i === STEPS.length - 1 ? 'border-transparent !pb-0' : 'border-ink/22')}>
                <span aria-hidden="true" className={cx('absolute -left-[7px] top-0 size-[13px] rounded-full border-[1.5px] border-solid', s.current ? 'border-terracotta bg-terracotta' : 'border-ink/45 bg-cream')} />
                <span className={cx('mono block max-w-[29ch] text-[11px] leading-[17px] lg:max-w-none lg:text-[12px] lg:leading-4', s.current ? 'text-terracotta' : 'text-muted')}>{s.when}</span>
                <h3 className="m-0 my-2.5 text-[27px] leading-[31px] tracking-[-0.025em] lg:my-3 lg:text-[36px] lg:leading-10">{s.title}</h3>
                <p className="m-0 max-w-[49ch] text-[16px] leading-6 text-ink-soft lg:text-[18px] lg:leading-7">{nb(s.text)}</p>
                {i === 1 && (
                  <p className="m-0 mt-4 max-w-[60ch] text-[14px] leading-[21px] text-muted lg:text-[15px] lg:leading-[23px]">
                    {nb('Máte po ruce fotky, menu nebo ceník? Můžete nám je poslat rovnou na ')}
                    <a href={`mailto:${SITE.email}`} className="text-ink-soft underline underline-offset-4">{SITE.email}</a>.
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

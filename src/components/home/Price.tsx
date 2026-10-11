import { FAQ } from '../../data/faq'
import { BUSINESS_PRICE_MIN, BUSINESS_PRICE_MAX, CARE_MONTHLY, CARE_PLUS_MONTHLY, INQUIRY_ANCHOR, PRICE_FROM, kc } from '../../data/site'
import { nb } from '../../lib/text'

/*
 * Pricing structure and visible copy approved by Dan (2026-10-11).
 * Creation, the first month and optional care are three separate moments.
 * The FAQ also feeds structured data and llms.txt; prices live in site.ts.
 */
export function Price() {
  return (
    <section id="cena" aria-labelledby="cena-title" className="bg-cream [--focus:var(--color-terracotta)]">
      <div className="container-x py-24 lg:py-36">
        <div data-reveal>
          <h2 id="cena-title" className="m-0 text-[40px] leading-[1.05] tracking-[-0.035em] lg:text-[64px]">Kolik stojí web?</h2>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-6">
          <div data-reveal className="lg:col-span-8">
            <h3 className="m-0 mb-3 text-[20px] font-medium lg:text-[24px]">Běžný firemní web</h3>
            <p className="m-0 font-bold leading-[0.95] tracking-[-0.055em]">
              <span className="whitespace-nowrap text-[clamp(36px,10.8vw,56px)] lg:text-[clamp(60px,6.1vw,96px)]">{BUSINESS_PRICE_MIN.toLocaleString('cs-CZ')}–{BUSINESS_PRICE_MAX.toLocaleString('cs-CZ')}</span>{' '}
              <span className="text-[24px] tracking-[-0.02em] lg:text-[36px]">Kč</span>
            </p>
            <p className="m-0 mt-4 text-[16px] leading-6 text-ink-soft lg:mt-5 lg:text-[20px] lg:leading-[30px]">Nejčastější cena podle rozsahu, obsahu a funkcí.</p>
          </div>
          <div data-reveal className="lg:col-span-3 lg:col-start-10">
            <h3 className="m-0 mb-3 max-w-[280px] text-[18px] font-medium leading-6 lg:text-[20px] lg:leading-7">Jednoduchý jednostránkový web</h3>
            <p className="m-0 text-[34px] font-bold leading-none tracking-[-0.04em] text-terracotta lg:text-[clamp(28px,2.7vw,42px)]"><span className="text-[20px] font-medium tracking-normal">od </span>{kc(PRICE_FROM)}</p>
            <p className="m-0 mt-4 max-w-[360px] text-[16px] leading-6 text-ink-soft">Pro menší web, kde vše důležité funguje na jedné stránce.</p>
          </div>
        </div>

        <div data-reveal className="mt-9 lg:mt-12 lg:grid lg:grid-cols-12 lg:gap-6">
          <p className="m-0 text-[16px] leading-6 text-ink-soft lg:col-span-5">Složitější weby a funkce naceníme individuálně.</p>
          <p className="m-0 mt-5 max-w-[580px] text-[18px] font-medium leading-7 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:text-[20px] lg:leading-[30px]">Přesnou cenu znáte předem. Návrh úvodní stránky je zdarma a k ničemu vás nezavazuje.</p>
        </div>

        <div data-reveal className="my-20 border-0 border-y border-solid border-terracotta/25 py-12 lg:my-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-16">
          <h3 className="m-0 max-w-[800px] text-[38px] leading-[1.05] tracking-[-0.035em] lg:col-span-8 lg:text-[clamp(48px,4.5vw,68px)]">První měsíc se o web staráme my.</h3>
          <p className="hand mt-4! inline-block -rotate-6 text-[76px] lg:col-span-4 lg:col-start-9 lg:mt-0! lg:text-[clamp(64px,7.7vw,112px)]">Zdarma.</p>
          <p className="m-0 mt-7 max-w-[590px] text-[18px] leading-7 text-ink-soft lg:col-span-6 lg:mt-8 lg:text-[20px] lg:leading-[30px]">Hosting, technická péče, podpora a drobné úpravy jsou první měsíc na nás.</p>
        </div>

        <div data-reveal>
          <h3 className="m-0 mb-10 text-[32px] leading-[1.08] tracking-[-0.03em] lg:mb-12 lg:text-[48px]">A potom? Je to na vás.</h3>
          <div className="grid gap-x-6 gap-y-4 border-0 border-t border-solid border-ink/25 py-7 lg:grid-cols-12 lg:items-baseline lg:py-8">
            <h4 className="m-0 text-[24px] font-bold tracking-[-0.02em] lg:col-span-3 lg:text-[28px]">Webtix Care</h4>
            <p className="m-0 text-[28px] font-bold tracking-[-0.035em] lg:col-span-3 lg:text-[32px]">{kc(CARE_MONTHLY)} <span className="text-[15px] font-normal tracking-normal text-ink-soft">/ měsíc</span></p>
            <div className="text-[18px] leading-7 text-ink lg:col-span-6 lg:text-[20px] lg:leading-[30px]">
              <p className="m-0">Hosting, technická péče, opravy chyb a podpora.</p>
              <p className="m-0 mt-2 font-semibold">Pokud má web CMS, texty a fotky si můžete upravovat sami.</p>
            </div>
          </div>
          <div className="grid gap-x-6 gap-y-4 border-0 border-y border-solid border-ink/25 py-7 lg:grid-cols-12 lg:items-baseline lg:py-8">
            <h4 className="m-0 text-[24px] font-bold tracking-[-0.02em] lg:col-span-3 lg:text-[28px]">Webtix Care<span className="text-terracotta">+</span></h4>
            <p className="m-0 text-[28px] font-bold tracking-[-0.035em] lg:col-span-3 lg:text-[32px]">{kc(CARE_PLUS_MONTHLY)} <span className="text-[15px] font-normal tracking-normal text-ink-soft">/ měsíc</span></p>
            <p className="m-0 text-[18px] leading-7 text-ink lg:col-span-6 lg:text-[20px] lg:leading-[30px]">Všechno z Care + až <strong className="font-semibold text-terracotta">30 minut</strong> drobných úprav obsahu každý měsíc.</p>
          </div>
        </div>

        <div data-reveal className="mt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7">
            <h3 className="m-0 max-w-[760px] text-[30px] leading-[1.15] tracking-[-0.025em] lg:text-[42px]">Nechcete měsíční správu? Nemusíte. <span className="hand mt-3! block -rotate-2 text-[46px] lg:text-[64px]">Web je váš.</span></h3>
            {/* Trust line and CTA wording approved by Dan (2026-10-11). */}
            <p className="m-0 mt-5 text-[18px] leading-7 text-ink-soft lg:text-[20px]">Nezamykáme vás u nás.</p>
            <a href={`/#${INQUIRY_ANCHOR}`} className="mt-6 inline-flex min-h-14 max-w-full items-center justify-center gap-3 rounded-input bg-ink px-5 py-4 text-[16px] font-medium text-cream no-underline transition-colors hover:bg-terracotta focus-visible:outline-offset-4 motion-reduce:transition-none lg:gap-4 lg:px-7 lg:text-[18px]">
              <span>Chci vidět návrh svého webu</span><span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="mt-7 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <p className="m-0 text-[16px] leading-6 text-ink-soft lg:text-[18px] lg:leading-7">Předáme vám web i doménu pro provoz jinde. Náš hosting, technická péče a podpora tím končí.</p>
            <p className="m-0 mt-5 text-[14px] leading-5 text-muted lg:text-[15px] lg:leading-6">Registrace a obnova domény se platí zvlášť.</p>
          </div>
        </div>

        <div className="mt-20 lg:mt-28 lg:grid lg:grid-cols-12 lg:gap-6">
          <h3 data-reveal className="m-0 mb-7 text-[22px] font-medium leading-7 lg:col-span-4 lg:mb-0 lg:text-[26px]">Ještě vás možná zajímá</h3>
          <div className="lg:col-span-8">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group border-0 border-t border-solid border-ink/20 py-5 last:border-b">
                <summary className="flex cursor-pointer list-none justify-between gap-4 rounded-[4px] focus-visible:outline-offset-4 text-[17px] font-medium leading-6 lg:text-[20px] lg:leading-7 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span aria-hidden="true" className="shrink-0 text-terracotta"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">−</span></span>
                </summary>
                <p className="m-0 mt-3 max-w-[680px] text-[16px] leading-6 text-ink-soft lg:text-[18px] lg:leading-7">{nb(a)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

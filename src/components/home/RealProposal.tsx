import { ADASTRA_URL } from '../../data/site'
import { cx } from '../../lib/text'

/*
 * "Skutečný návrh": Café AdAstra, today's site next to our proposal. Built from
 * docs/design/source/Rest.dc.html (1440) and RestMobile.dc.html (390).
 *
 * AdAstra is a real client. This section must not go live until the owner's
 * written permission is in: `npm run build` fails while ADASTRA_WRITTEN_OK is
 * false (src/data/site.ts). Merkur is never shown here.
 *
 * The two phones are media: on desktop they shrink with the column (the 260px
 * frames, 40px gap and 64px offset are fractions of the design's 560px row).
 */

const IMAGES = {
  // Natural sizes, so the browser reserves the space before the files load.
  old: { src: 'images/adastra-old-mobile.jpg', width: 750, height: 1564 },
  new: { src: 'images/adastra-new-mobile.jpg', width: 375, height: 782 },
}

export function RealProposal() {
  return (
    <section
      id="navrhy"
      aria-labelledby="navrhy-title"
      className="bg-ink text-paper"
      // Focus ring is cream on dark grounds.
      style={{ ['--focus' as string]: 'var(--color-cream)' }}
    >
      <div className="container-x flex flex-col gap-10 py-24 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:gap-y-0 lg:py-40">
        <div className="flex flex-col lg:col-span-5">
          <p className="mono m-0 mb-4 text-[11px] text-[#A79C94] lg:mb-6 lg:text-[12px]">Skutečný návrh</p>
          <h2
            id="navrhy-title"
            className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-8 lg:text-[clamp(44px,4.4444vw,64px)] lg:leading-[0.95]"
          >
            Café AdAstra, <em className="italic text-pink">Praha&nbsp;2.</em>
          </h2>
          {/* The phone and desktop copy differ in the design. */}
          <p className="m-0 text-[16px] leading-6 text-[#C9C0B9] lg:hidden">
            Návrh z&nbsp;jejich vlastních fotek a&nbsp;menu. Majitelka ho viděla dřív, než cokoli zaplatila.
          </p>
          <p className="m-0 mb-10 hidden max-w-[440px] text-[18px] leading-7 text-[#C9C0B9] lg:block">
            Kavárna a&nbsp;bistro v&nbsp;Podskalí. Návrh jsme postavili z&nbsp;jejich vlastních fotek a&nbsp;menu a&nbsp;majitelka ho viděla
            dřív, než cokoli zaplatila.
          </p>
          <ProposalLink className="hidden lg:inline-flex" />
        </div>

        <div className="flex items-start justify-center gap-4 lg:col-span-6 lg:col-start-7 lg:gap-[min(40px,7.1429%)]">
          <figure className="m-0 mt-10 flex w-[160px] flex-col items-center gap-3 lg:mt-[min(64px,11.4286%)] lg:w-[min(260px,46.4286%)] lg:gap-4">
            <div className="h-[332px] w-full overflow-hidden rounded-[24px] border-[6px] border-solid border-[#3A3230] bg-[#3A3230] lg:aspect-[260/540] lg:h-auto lg:rounded-[36px] lg:border-8">
              <img
                {...IMAGES.old}
                src={import.meta.env.BASE_URL + IMAGES.old.src}
                alt="Současný web Café AdAstra"
                loading="lazy"
                decoding="async"
                className="block h-auto w-full [filter:saturate(0.7)]"
              />
            </div>
            <figcaption className="mono text-[11px] text-[#A79C94] lg:text-[12px]">Dnes</figcaption>
          </figure>
          <figure className="m-0 flex w-[160px] flex-col items-center gap-3 lg:w-[min(260px,46.4286%)] lg:gap-4">
            <div className="h-[332px] w-full overflow-hidden rounded-[24px] border-[6px] border-solid border-paper bg-paper lg:aspect-[260/540] lg:h-auto lg:rounded-[36px] lg:border-8">
              <img
                {...IMAGES.new}
                src={import.meta.env.BASE_URL + IMAGES.new.src}
                alt="Náš návrh webu Café AdAstra"
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
            <figcaption className="mono text-[11px] text-paper lg:text-[12px]">Náš návrh</figcaption>
          </figure>
        </div>

        <ProposalLink className="inline-flex self-start py-3 lg:hidden" />
      </div>
    </section>
  )
}

/** "Otevřít návrh ↗". The arrow is drawn: Instrument Sans has no ↗ glyph. */
function ProposalLink({ className }: { className: string }) {
  return (
    <a
      href={ADASTRA_URL}
      target="_blank"
      rel="noopener"
      className={cx(
        'items-center gap-1 self-start text-[16px] font-medium text-paper underline underline-offset-[6px] lg:text-[17px]',
        className,
      )}
    >
      Otevřít návrh
      <svg aria-hidden="true" width="0.7em" height="0.7em" viewBox="0 0 10 10" className="shrink-0">
        <path d="M1.5 8.5 L8.5 1.5 M3.5 1.5 H8.5 V6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </a>
  )
}

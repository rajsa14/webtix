import { useEffect, useRef, useState } from 'react'
import { FAQ } from '../../data/faq'
import { MANAGEMENT_CMS_FROM, MANAGEMENT_EDITS_FROM, PRICE_FROM, kc } from '../../data/site'
import { revealDelay, useInView, useMotionOk } from '../../lib/motion'
import { nb } from '../../lib/text'

/*
 * "Cena": the starting price, monthly care, and four questions. Built from
 * docs/design/source/Rest.dc.html (1440) and RestMobile.dc.html (390).
 * Prices and days come from src/data/site.ts. The answers are Dan's text
 * (2026-10-10), which replaced the design's; they live in src/data/faq.ts.
 */

export function Price() {
  return (
    <section id="cena" aria-labelledby="cena-title" className="bg-cream">
      <div className="container-x flex flex-col gap-8 py-24 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6 lg:py-40">
        <div data-reveal className="flex flex-col lg:col-span-5">
          <h2 id="cena-title" className="section-num mono m-0 mb-4 text-[11px] font-normal text-muted lg:mb-6 lg:text-[12px]">
            <span>04</span> Cena
          </h2>
          <p className="m-0 mb-3 text-[56px] font-bold leading-[0.92] tracking-[-0.045em] lg:mb-4 lg:text-[clamp(64px,7vw,108px)] lg:leading-[0.9]">
            od{' '}
            <span className="relative inline-block">
              <CountUp to={PRICE_FROM} />
              {/* A pen circle drawn around the price. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 300 120"
                preserveAspectRatio="none"
                className="doodle-draw pointer-events-none absolute -left-[6%] -top-[20%] h-[140%] w-[112%] text-terracotta"
              >
                <path
                  pathLength={1}
                  d="M160 9 C 70 4, 10 28, 9 62 C 8 99, 92 117, 172 112 C 252 107, 296 83, 290 51 C 284 17, 208 3, 118 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </p>
          <p className="m-0 max-w-[400px] text-[16px] leading-6 text-ink-soft lg:text-[20px] lg:leading-[30px]">
            Za hotový web. Přesnou částku znáte dřív, než cokoli podepíšete.
          </p>
          {/* Not in the design: Dan's line about monthly care (2026-10-10). Breaks only at the separators. */}
          <p className="m-0 mt-4 max-w-[400px] text-[14px] leading-5 text-ink-soft lg:mt-6 lg:text-meta">
            Správa webu: <span className="whitespace-nowrap">S CMS od {kc(MANAGEMENT_CMS_FROM)} měsíčně</span> ·{' '}
            <span className="whitespace-nowrap">S úpravami od nás od {kc(MANAGEMENT_EDITS_FROM)} měsíčně</span>
          </p>
        </div>

        <div className="flex flex-col lg:col-span-6 lg:col-start-7">
          {FAQ.map(({ q, a }, i) => (
            <details
              key={q}
              data-reveal
              style={revealDelay(i + 1, 90)}
              open={i === 0}
              className="group border-0 border-t border-solid border-ink py-5 last:border-b lg:py-6"
            >
              <summary className="flex cursor-pointer list-none justify-between gap-3 text-[19px] font-bold leading-[26px] lg:gap-4 lg:text-[clamp(20px,1.75vw,27px)] lg:leading-[1.25] [&::-webkit-details-marker]:hidden">
                {q}
                <span aria-hidden="true" className="text-terracotta">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">–</span>
                </span>
              </summary>
              <p className="m-0 mt-2.5 max-w-[520px] text-[16px] leading-6 text-ink-soft lg:mt-3 lg:text-[18px] lg:leading-7">{nb(a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/** The price counts up every time it comes into view. Screen readers get the final amount only. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, 0.6)
  // Without motion (and in the pre-rendered page): show the amount, do not count.
  const counts = useMotionOk()
  // Start from a four-digit amount, so the width barely changes while counting.
  const from = Math.min(1000, to)
  const [value, setValue] = useState(from)
  useEffect(() => {
    if (!seen || !counts) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100)
      const eased = 1 - (1 - t) ** 3
      setValue(t >= 1 ? to : Math.round((from + (to - from) * eased) / 10) * 10)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, counts, from, to])
  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {kc(counts ? value : to)}
      </span>
      <span className="sr-only">{kc(to)}</span>
    </>
  )
}

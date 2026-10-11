import { useEffect, useRef } from 'react'
import { INQUIRY_ANCHOR } from '../../data/site'
import { team } from '../../data/team'
import { revealDelay, useMotionOk } from '../../lib/motion'
import { cx, nb } from '../../lib/text'

// Team copy approved by Dan on 2026-10-11. Richard is the primary client contact.
export function Team() {
  return (
    <section id="kdo-jsme" aria-labelledby="kdo-title" className="bg-pink">
      <div className="container-x py-24 lg:py-40">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
        <div data-reveal className="flex flex-col lg:col-span-5 lg:row-start-1">
          <h2
            id="kdo-title"
            className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-8 lg:text-[clamp(46px,4.6vw,72px)] lg:leading-[0.95]"
          >
            Dva lidé. Mluvíte <em className="scribble italic text-terracotta">přímo</em> s&nbsp;námi.
          </h2>
          <p className="m-0 max-w-[420px] text-[16px] leading-6 text-ink-soft lg:text-[20px] lg:leading-[30px]">
            Jsme Daniel a Richard, malé webové studio z Prahy. Váš web navrhujeme a stavíme my dva.
          </p>
        </div>

        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:gap-6">
          {team.map((member, i) => (
            <li key={member.name} data-reveal style={revealDelay(i + 1, 150)} className={cx('relative', 'flex flex-col gap-3 lg:gap-4', i === 1 && 'mt-10 lg:mt-16')}>
              {i === 1 && (
                // A pen note pointing at the two of us (desktop only).
                <span aria-hidden="true" className="pointer-events-none absolute -top-16 left-2 hidden items-start gap-1 lg:flex">
                  <svg viewBox="0 0 60 40" className="mt-4 h-8 w-12 text-pen" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M56 8 C 40 6, 20 14, 8 32" />
                    <path d="M6 20 L 7 33 L 19 30" />
                  </svg>
                  <span className="hand rotate-3 text-[26px]">To jsme my.</span>
                </span>
              )}
              <div className="flex aspect-[4/5] flex-col overflow-hidden rounded-card border-2 border-solid border-ink bg-white">
                {/* The name follows right below, so the portrait needs no text of its own. */}
                <img
                  src={import.meta.env.BASE_URL + member.portrait}
                  alt=""
                  width={200}
                  height={250}
                  loading="lazy"
                  decoding="async"
                  className="mt-auto block h-auto w-full"
                />
              </div>
              <div>
                <h3 className="m-0 text-[17px] leading-[22px] lg:text-[24px] lg:leading-[30px]">{member.name}</h3>
                <p className="m-0 mt-2 text-[15px] font-semibold leading-5 lg:text-[18px] lg:leading-6">{member.role}</p>
                <div className="mt-3 flex flex-col gap-2 text-[15px] leading-[22px] text-ink-soft lg:text-[17px] lg:leading-[26px]">
                  {member.responsibilities.map((text) => <p key={text} className="m-0">{nb(text)}</p>)}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="lg:col-span-5 lg:row-start-2 lg:mt-10 lg:max-w-[420px]">
          <TeamChat />
          <p className="m-0 mt-8 text-[17px] font-semibold leading-[25px] lg:text-[18px] lg:leading-[27px]">
            Dva lidé. Přímá domluva. Bez prostředníků.
          </p>
          <a href={`#${INQUIRY_ANCHOR}`} className="mt-6 inline-block py-1 text-[16px] font-semibold underline decoration-1 underline-offset-4 transition-colors hover:text-terracotta hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4 lg:text-[18px]">
            Napište nám o svém webu →
          </a>
        </div>
      </div>
      </div>
    </section>
  )
}

// Approved sample conversation; illustrative, not a client testimonial.
function TeamChat() {
  const ref = useRef<HTMLOListElement>(null)
  const played = useRef(false)
  const motionOk = useMotionOk()

  useEffect(() => {
    const el = ref.current
    if (!el || !motionOk || played.current) return
    const animations: Animation[] = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played.current) return
      played.current = true
      observer.disconnect()
      el.querySelectorAll('li').forEach((message, i) => {
        animations.push(message.animate(
          [{ opacity: 0.65, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 400, delay: i * 250, easing: 'ease-out' },
        ))
      })
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => {
      observer.disconnect()
      animations.forEach((animation) => animation.cancel())
    }
  }, [motionOk])

  return (
    <div className="max-w-[340px] lg:max-w-[380px]">
      <p className="m-0 mb-4 text-[12px] leading-4 text-ink-soft">Jak může začít naše domluva</p>
      <ol ref={ref} aria-label="Jak může začít naše domluva" className="m-0 flex list-none flex-col gap-4 p-0">
        <li className="ml-10 flex flex-col items-end gap-1">
          <span className="mono text-[11px] text-ink-soft">Vy</span>
          <p className="m-0 rounded-[14px] rounded-br-[4px] border border-solid border-ink bg-white px-4 py-3 text-[15px] leading-[22px]">S kým budu řešit svůj web?</p>
        </li>
        <li className="mr-4 flex">
          <div className="flex flex-col gap-1">
            <span className="mono text-[11px] text-ink-soft">Richard</span>
            <p className="m-0 rounded-[14px] rounded-bl-[4px] bg-paper px-4 py-3 text-[15px] leading-[22px]">{nb('Se mnou. Domluvíme se, co potřebujete, a postarám se o vývoj. Daniel navrhne, jak bude váš web vypadat a působit.')}</p>
          </div>
        </li>
      </ol>
    </div>
  )
}

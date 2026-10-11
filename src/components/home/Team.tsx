import { useEffect, useRef, useState } from 'react'
import { PRICE_FROM, kc, previewDaysGenitive } from '../../data/site'
import { team } from '../../data/team'
import { revealDelay, useInView, useMotionOk } from '../../lib/motion'
import { cx, nb } from '../../lib/text'

/*
 * "Kdo jsme": the two of us. Built from docs/design/source/Rest.dc.html (1440)
 * and RestMobile.dc.html (390). Portraits come from src/data/team.ts.
 * Below the heading (desktop) or the portraits (phone), a short sample chat
 * shows that you talk to us directly: you ask, Daniel and Richard answer.
 */

export function Team() {
  return (
    <section id="kdo-jsme" aria-labelledby="kdo-title" className="bg-pink">
      <div className="container-x py-24 lg:py-40">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-6">
        <div data-reveal className="flex flex-col lg:col-span-5 lg:row-start-1">
          <p className="section-num mono m-0 mb-4 text-[11px] text-ink-soft lg:mb-6 lg:text-[12px]">
            <span>03</span> Kdo jsme
          </p>
          <h2
            id="kdo-title"
            className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-8 lg:text-[clamp(46px,4.6vw,72px)] lg:leading-[0.95]"
          >
            Dva lidé. Mluvíte <em className="scribble italic text-terracotta">přímo</em> s&nbsp;námi.
          </h2>
          <p className="m-0 max-w-[420px] text-[16px] leading-6 text-ink-soft lg:text-[20px] lg:leading-[30px]">
            {/* The phone copy drops the first sentence. */}
            <span className="hidden lg:inline">Žádný account manager. </span>Kdo váš web navrhne, ten vám ho taky ukáže.
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
                <p className="m-0 mt-0.5 text-[14px] leading-5 text-ink-soft lg:mt-1 lg:text-[17px] lg:leading-[26px]">{nb(member.bio)}</p>
              </div>
            </li>
          ))}
        </ul>

        <Chat />
      </div>
      </div>
    </section>
  )
}

type Message = { from: 'you' | 'daniel' | 'richard'; text: string }

// Draft copy (2026-10-10), waiting for Dan's approval. Only promises the site already makes.
const MESSAGES: Message[] = [
  { from: 'you', text: 'Dobrý den, kolik by stál nový web pro naši kavárnu?' },
  {
    from: 'daniel',
    text: `Dobrý den! Pošlete nám odkaz na váš současný web nebo Instagram. Do ${previewDaysGenitive()} vám zdarma ukážeme hotovou úvodní stránku.`,
  },
  { from: 'you', text: 'A když se mi bude líbit?' },
  {
    from: 'richard',
    text: `Pak web dokončíme, nasadíme na vaši doménu a postaráme se, aby běžel. Web stojí od ${kc(PRICE_FROM)}, přesnou cenu znáte předem.`,
  },
]

/** When each message appears (ms after the chat comes into view). Our replies "type" for TYPING_MS first. */
const SHOW_AT = [200, 1900, 3300, 5100]
const TYPING_MS = 1000

const NAME = { you: 'Vy', daniel: 'Daniel', richard: 'Richard' }
const PORTRAIT = { daniel: team[0].portrait, richard: team[1].portrait }

function Chat() {
  const ref = useRef<HTMLOListElement>(null)
  const seen = useInView(ref, 0.35)
  // Without motion (and in the pre-rendered page): show the whole chat, no typing.
  // Otherwise the chat replays every time it comes back on screen.
  const animated = useMotionOk()
  const [played, setElapsed] = useState(-1)
  const elapsed = animated ? played : Infinity

  useEffect(() => {
    if (!seen || !animated) return
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const t = performance.now() - start
      setElapsed(t)
      if (t < SHOW_AT[SHOW_AT.length - 1] + 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, animated])

  return (
    <ol
      ref={ref}
      aria-label="Ukázka rozhovoru s námi"
      className="m-0 flex list-none flex-col gap-4 p-0 lg:col-span-5 lg:row-start-2 lg:mt-14 lg:max-w-[460px]"
    >
      {MESSAGES.map((m, i) => {
        const ours = m.from !== 'you'
        const shown = elapsed >= SHOW_AT[i]
        const typing = ours && !shown && elapsed >= SHOW_AT[i] - TYPING_MS
        return (
          <li
            key={i}
            className={cx(
              'flex items-end gap-2.5 transition-opacity duration-300',
              !ours && 'flex-row-reverse',
              shown || typing ? 'opacity-100' : 'opacity-0',
            )}
          >
            {ours ? (
              <img
                src={import.meta.env.BASE_URL + PORTRAIT[m.from as 'daniel' | 'richard']}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                className="size-9 shrink-0 rounded-full border-[1.5px] border-solid border-ink bg-white object-cover object-[50%_25%]"
              />
            ) : null}
            <div className={cx('relative flex max-w-[85%] flex-col gap-1', !ours && 'items-end')}>
              <span className={cx('mono text-[11px] text-ink-soft transition-opacity duration-500 lg:text-[12px]', shown ? 'opacity-100' : 'opacity-0')}>{NAME[m.from]}</span>
              {/* The message is always in the page (screen readers read the whole chat); it only fades in. */}
              <p
                className={cx(
                  'm-0 rounded-[14px] px-4 py-3 text-[15px] leading-[22px] transition-[opacity,translate] duration-500 lg:text-[17px] lg:leading-[26px]',
                  m.from === 'you' && 'rounded-br-[4px] border border-solid border-ink bg-white text-ink',
                  m.from === 'daniel' && 'rounded-bl-[4px] bg-paper text-ink',
                  m.from === 'richard' && 'rounded-bl-[4px] bg-terracotta text-cream',
                  shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                )}
              >
                {nb(m.text)}
              </p>
              {typing && (
                <span
                  aria-hidden="true"
                  className={cx(
                    'absolute bottom-0 left-0 flex gap-1 rounded-[14px] rounded-bl-[4px] px-4 py-4',
                    m.from === 'daniel' ? 'bg-paper' : 'bg-terracotta',
                  )}
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className={cx('typing-dot size-1.5 rounded-full', m.from === 'daniel' ? 'bg-ink' : 'bg-cream')}
                      style={{ animationDelay: `${d * 160}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

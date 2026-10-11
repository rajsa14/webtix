import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CASES, SCREEN, type CaseId, type CaseStudy } from '../../data/cases'
import { useInView, useMotionOk } from '../../lib/motion'
import { cx, nb } from '../../lib/text'
import {
  AdAstraShot,
  BukyNew,
  BukyOld,
  HoblikNew,
  HoblikOld,
  KlicNew,
  KlicOld,
  KopretinaNew,
  KopretinaOld,
  VlnkaNew,
  VlnkaOld,
} from './caseSites'

/*
 * "Návrhy": a deck of phones you flip through. The front phone shows the old
 * site, then wipes (the hero's dashed line) to the new one; beside it the
 * case is told in text: the problem, then the fix. The deck moves on by
 * itself every few seconds while it is on screen, until the visitor touches
 * it. Swipe or drag the phones, use the buttons or the arrow keys; hovering
 * or tapping the front phone shows the old site again. Reduced motion: no
 * automatic moving and no wipes; everything still switches.
 */

const SITES: Record<CaseId, { old: () => ReactNode; fresh: () => ReactNode }> = {
  adastra: { old: () => <AdAstraShot which="old" />, fresh: () => <AdAstraShot which="new" /> },
  vlnka: { old: () => <VlnkaOld />, fresh: () => <VlnkaNew /> },
  hoblik: { old: () => <HoblikOld />, fresh: () => <HoblikNew /> },
  buky: { old: () => <BukyOld />, fresh: () => <BukyNew /> },
  klic: { old: () => <KlicOld />, fresh: () => <KlicNew /> },
  kopretina: { old: () => <KopretinaOld />, fresh: () => <KopretinaNew /> },
}

const AUTO_MS = 6500
const WIPE_MS = 900
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Where a card sits in the fan, by its distance from the front one. */
function place(offset: number, count: number) {
  if (offset === 0) return { x: '0%', y: '0%', r: 0, s: 1, o: 1, z: 10 }
  if (offset === count - 1) return { x: '-115%', y: '6%', r: -14, s: 0.9, o: 0, z: 11 }
  if (offset === 1) return { x: '20%', y: '-2%', r: 6, s: 0.92, o: 1, z: 9 }
  if (offset === 2) return { x: '36%', y: '-3%', r: 11, s: 0.85, o: 0.85, z: 8 }
  return { x: '44%', y: '-4%', r: 14, s: 0.8, o: 0, z: 1 }
}

export function CaseDeck() {
  const count = CASES.length
  const [active, setActive] = useState(0)
  const [before, setBefore] = useState(true)
  const [auto, setAuto] = useState(true)
  const [paused, setPaused] = useState(false)
  const deckRef = useRef<HTMLDivElement>(null)
  const inView = useInView(deckRef, 0.35)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)

  const go = (to: number, byUser = true) => {
    if (byUser) setAuto(false)
    setActive(((to % count) + count) % count)
  }

  // Each new front phone starts on the old site and wipes to the new one.
  useEffect(() => {
    const show = window.setTimeout(() => setBefore(true), 0)
    const wipe = window.setTimeout(() => setBefore(false), reducedMotion() ? 0 : 650)
    return () => {
      clearTimeout(show)
      clearTimeout(wipe)
    }
  }, [active])

  // Moves on by itself while on screen, until the visitor takes over.
  const motionOk = useMotionOk()
  const running = auto && inView && !paused && motionOk
  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => setActive((a) => (a + 1) % count), AUTO_MS)
    return () => clearTimeout(t)
  }, [running, active, count])

  const current = CASES[active]
  return (
    <section id="navrhy" aria-labelledby="navrhy-title" className="overflow-x-clip bg-ink text-paper" style={{ ['--focus' as string]: 'var(--color-cream)' }}>
      <div className="container-x py-24 lg:py-40">
        <div data-reveal className="flex flex-col lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
          <div className="flex flex-col lg:col-span-7">
            <p className="section-num mono m-0 mb-4 text-[11px] text-[#A79C94] lg:mb-6 lg:text-[12px]">
              <span>02</span> Návrhy
            </p>
            <h2 id="navrhy-title" className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-0 lg:text-[clamp(46px,4.6vw,72px)] lg:leading-[0.95]">
              Každý web měl jiný <em className="scribble italic text-pink">problém.</em>
            </h2>
          </div>
          <p className="m-0 text-[16px] leading-6 text-[#C9C0B9] lg:col-span-4 lg:col-start-9 lg:text-[20px] lg:leading-[30px]">
            Café AdAstra je skutečný návrh. Ostatní podniky jsme si vymysleli, chyby jsou ale skutečné a vídáme je pořád.
          </p>
        </div>

        <div
          ref={deckRef}
          aria-roledescription="carousel"
          aria-label="Ukázky webů"
          onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
          onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(active + 1)
            if (e.key === 'ArrowLeft') go(active - 1)
          }}
          className="mt-14 flex flex-col gap-12 lg:mt-20 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6"
        >
          {/* The fan of phones. Drag or swipe sideways to flip. */}
          <div
            className="relative mx-auto h-[500px] w-[260px] touch-pan-y select-none lg:col-span-6 lg:h-[660px] lg:w-[300px]"
            onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
            onPointerMove={(e) => {
              if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true
            }}
            onPointerUp={(e) => {
              const d = drag.current
              drag.current = null
              if (!d || !d.moved) return
              const dx = e.clientX - d.x
              if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1))
            }}
          >
            {CASES.map((c, i) => {
              const offset = (i - active + count) % count
              const p = place(offset, count)
              const front = offset === 0
              return (
                <div
                  key={c.id}
                  role="group"
                  aria-roledescription="snímek"
                  aria-label={`${i + 1} z ${count}: ${c.kind} ${c.name}`}
                  aria-hidden={!front}
                  inert={!front}
                  className="deck-card absolute left-1/2 top-0 -ml-[110px] [zoom:1.1] lg:[zoom:1.3]"
                  style={{ translate: `${p.x} ${p.y}`, rotate: `${p.r}deg`, scale: p.s, opacity: p.o, zIndex: p.z }}
                >
                  <button
                    type="button"
                    aria-pressed={front && before}
                    aria-label={front ? (before ? 'Ukázat nový web' : 'Ukázat původní web') : undefined}
                    tabIndex={front ? 0 : -1}
                    onPointerEnter={(e) => front && e.pointerType === 'mouse' && setBefore(true)}
                    onPointerLeave={(e) => front && e.pointerType === 'mouse' && setBefore(false)}
                    onClick={(e) => {
                      // Mouse users see the old site on hover; touch and keyboard toggle.
                      if (!front || (e.nativeEvent as PointerEvent).pointerType === 'mouse') return
                      setAuto(false)
                      setBefore((b) => !b)
                    }}
                    className="block cursor-pointer border-0 bg-transparent p-0"
                  >
                    <DeckPhone old={SITES[c.id].old()} fresh={SITES[c.id].fresh()} before={front ? before : false} />
                  </button>
                </div>
              )
            })}
          </div>

          <Story
            c={current}
            index={active}
            count={count}
            before={before}
            running={running}
            onPrev={() => go(active - 1)}
            onNext={() => go(active + 1)}
            onPick={(i) => go(i)}
            onToggle={() => {
              setAuto(false)
              setBefore((b) => !b)
            }}
          />
        </div>
      </div>
    </section>
  )
}

/** The case told in text, with the controls. */
function Story(props: {
  c: CaseStudy
  index: number
  count: number
  before: boolean
  running: boolean
  onPrev: () => void
  onNext: () => void
  onPick: (i: number) => void
  onToggle: () => void
}) {
  const { c, index, count, before, running } = props
  const round = 'grid size-12 cursor-pointer place-items-center rounded-full border border-solid border-paper/30 bg-transparent text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink'
  return (
    <div className="flex flex-col lg:col-span-5 lg:col-start-8">
      {/* Polite while the visitor is in control; silent while the deck moves by itself. */}
      <div aria-live={running ? 'off' : 'polite'} key={c.id} className="deck-story flex flex-col">
        <p className="mono m-0 flex items-center gap-3 text-[11px] text-[#A79C94] lg:text-[12px]">
          <span className="text-paper">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          {c.real ? (
            <span className="rounded-full bg-pink px-2.5 py-1 text-ink">Skutečný návrh</span>
          ) : (
            <span>Vymyšlený podnik</span>
          )}
        </p>
        <p className="mono m-0 mt-5 text-[11px] text-[#A79C94] lg:text-[12px]">
          {c.kind} · {c.city}
        </p>
        <h3 className="m-0 mt-2 text-[34px] leading-none tracking-[-0.03em] lg:text-[52px]">{c.name}</h3>

        {!c.real && (
          <div className="mt-7 flex flex-col gap-1">
            <span className="mono text-[11px] text-[#A79C94] lg:text-[12px]">Předtím</span>
            <p className="hand m-0 text-[26px] leading-[1.1] text-pink lg:text-[30px]">{c.problem}</p>
          </div>
        )}
        <div className="mt-6 flex flex-col gap-1">
          <span className="mono text-[11px] text-[#A79C94] lg:text-[12px]">{c.real ? 'Náš návrh' : 'Teď'}</span>
          <p className="m-0 max-w-[460px] text-[17px] leading-[26px] text-[#E4DCD5] lg:text-[20px] lg:leading-[30px]">{nb(c.fix)}</p>
        </div>
        {c.url && (
          <a href={c.url} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-1.5 self-start text-[17px] font-medium text-paper underline underline-offset-[6px]">
            Otevřít návrh
            <svg aria-hidden="true" width="0.7em" height="0.7em" viewBox="0 0 10 10">
              <path d="M1.5 8.5 L8.5 1.5 M3.5 1.5 H8.5 V6.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </a>
        )}
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <button type="button" onClick={props.onPrev} aria-label="Předchozí ukázka" className={round}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 8H3M7 4 3 8l4 4" />
          </svg>
        </button>
        <button type="button" onClick={props.onNext} aria-label="Další ukázka" className={round}>
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 8h11M9 4l4 4-4 4" />
          </svg>
        </button>
        <button
          type="button"
          aria-pressed={before}
          onClick={props.onToggle}
          className="mono ml-1 cursor-pointer rounded-full border border-solid border-paper/30 bg-transparent px-4 py-3 text-[12px] text-paper transition-colors hover:border-paper"
        >
          {before ? 'Ukázat nový web' : 'Ukázat původní web'}
        </button>
      </div>

      {/* One segment per case; the current one fills while the deck waits to move on. */}
      <div className="mt-8 flex gap-1.5" role="group" aria-label="Vybrat ukázku">
        {CASES.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => props.onPick(i)}
            aria-label={`${i + 1}: ${c.kind} ${c.name}`}
            aria-current={i === index ? 'true' : undefined}
            className="relative h-6 flex-1 cursor-pointer border-0 bg-transparent p-0"
          >
            <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-paper/20">
              {i < index && <span className="absolute inset-0 bg-paper/60" />}
              {i === index && (
                <span
                  key={`${index}-${running}`}
                  className={cx('deck-progress absolute inset-0 origin-left bg-pink', !running && 'is-static')}
                  style={{ animationDuration: `${AUTO_MS}ms` }}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** A phone: the old site underneath, the new one on top, revealed down to the dashed band. */
function DeckPhone({ old, fresh, before }: { old: ReactNode; fresh: ReactNode; before: boolean }) {
  const after = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLDivElement>(null)
  const reach = useRef(SCREEN.h)

  useEffect(() => {
    const target = before ? 0 : SCREEN.h
    const from = reach.current
    reach.current = target
    if (!after.current || !band.current || from === target) return
    const clip = (s: number) => `inset(0 0 ${SCREEN.h - s}px 0)`
    if (reducedMotion()) {
      after.current.style.clipPath = clip(target)
      return
    }
    const timing = { duration: WIPE_MS, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' as const }
    const a = after.current.animate([{ clipPath: clip(from) }, { clipPath: clip(target) }], timing)
    const b = band.current.animate(
      [
        { transform: `translateY(${from}px)`, opacity: 0 },
        { opacity: 1, offset: 0.12 },
        { opacity: 1, offset: 0.88 },
        { transform: `translateY(${target}px)`, opacity: 0 },
      ],
      timing,
    )
    return () => {
      // Interrupted mid-wipe: carry on from where the line is now.
      const progress = a.effect?.getComputedTiming().progress ?? 1
      reach.current = from + (target - from) * progress
      // Keep the clip where it is. Throws if the phone is already gone (leaving the page).
      try {
        a.commitStyles()
      } catch {
        // Nothing to keep.
      }
      a.cancel()
      b.cancel()
    }
  }, [before])

  return (
    <div className="relative h-[460px] w-[220px] overflow-hidden rounded-[30px] border-[7px] border-solid border-[#2E2826] bg-[#2E2826] shadow-[0_30px_50px_-28px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-0">{old}</div>
      <div ref={after} className="absolute inset-0">
        {fresh}
      </div>
      <div ref={band} className="absolute inset-x-0 top-0 -mt-[5px] flex h-[10px] items-center bg-cream opacity-0">
        <span className="block w-full border-0 border-t-2 border-dashed border-terracotta" />
      </div>
    </div>
  )
}

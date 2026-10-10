import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CASES, type CaseStudy, type NewSiteLook, type OldSiteLook } from '../../data/cases'
import { revealDelay, useInView } from '../../lib/motion'
import { cx, nb } from '../../lib/text'

/*
 * "Ukázky": six invented businesses on a desk, one phone each, like Šlapadlo.
 * When the desk scrolls into view the phones flip from the old site to the
 * new one, one after another, with the hero's dashed-line wipe. Hovering a
 * phone (or tapping it, or pressing Enter on it) wipes it back to the old site
 * and shows the red-pen note about what was wrong. The wipe is clip-path and
 * transform only (Web Animations). Reduced motion: no wipes, the new sites
 * show, and a tap still switches.
 */

const SCREEN = { w: 206, h: 446 }
const WIPE_MS = 900
const TILT = [-3, 2, -1.5, 2.5, -2, 1.5]

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function CaseGallery() {
  const deskRef = useRef<HTMLDivElement>(null)
  const inView = useInView(deskRef, 0.2)
  return (
    <section id="ukazky" aria-labelledby="ukazky-title" className="container-x overflow-x-clip py-24 lg:py-40">
      <div data-reveal className="flex flex-col lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="flex flex-col lg:col-span-7">
          <p className="mono m-0 mb-4 text-[11px] text-muted lg:mb-6 lg:text-[12px]">Ukázky</p>
          <h2
            id="ukazky-title"
            className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-0 lg:text-[clamp(46px,4.6vw,72px)] lg:leading-[0.95]"
          >
            Šest podniků. <em className="scribble italic text-terracotta">Šest</em> nových webů.
          </h2>
        </div>
        <p className="m-0 text-[16px] leading-6 text-ink-soft lg:col-span-4 lg:col-start-9 lg:text-[20px] lg:leading-[30px]">
          Podniky jsme si vymysleli, chyby jsou skutečné. Najeďte na telefon (nebo na něj klepněte) a uvidíte, jak web vypadal předtím.
        </p>
      </div>

      <div ref={deskRef} className="mt-14 flex flex-col gap-14 lg:mt-24 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-24">
        {CASES.map((c, i) => (
          <CaseItem key={c.id} c={c} i={i} play={inView} />
        ))}
      </div>
    </section>
  )
}

function CaseItem({ c, i, play }: { c: CaseStudy; i: number; play: boolean }) {
  const [before, setBefore] = useState(true)
  const lastPointer = useRef('')

  // The domino: when the desk comes into view, phone i turns to the new site after i × 220 ms.
  // When the desk leaves the screen, every phone goes back to the old site, ready to replay.
  useEffect(() => {
    if (!play) {
      const t = window.setTimeout(() => setBefore(true), 0)
      return () => clearTimeout(t)
    }
    const t = window.setTimeout(() => setBefore(false), (reducedMotion() ? 0 : 500) + i * 220)
    return () => clearTimeout(t)
  }, [play, i])

  const label = `${c.kind} ${c.name}: ${before ? 'ukázat nový web' : 'ukázat původní web'}`
  return (
    <div
      data-reveal
      style={revealDelay(i % 3, 120)}
      className={cx('flex items-center gap-5 lg:flex-col lg:items-center lg:gap-6', i % 2 === 1 && 'flex-row-reverse lg:flex-col', i % 3 === 1 && 'lg:mt-16')}
    >
      <button
        type="button"
        aria-pressed={before}
        aria-label={label}
        onPointerDown={(e) => (lastPointer.current = e.pointerType)}
        onPointerEnter={(e) => e.pointerType === 'mouse' && play && setBefore(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && play && setBefore(false)}
        onClick={() => {
          // A mouse already switches on hover; touch and the keyboard toggle.
          if (lastPointer.current === 'mouse') return
          setBefore((b) => !b)
        }}
        className="relative shrink-0 cursor-pointer border-0 bg-transparent p-0 [zoom:0.86] lg:[zoom:1.18]"
        style={{ rotate: `${TILT[i]}deg` }}
      >
        <Tape />
        <CasePhone c={c} before={before} />
        <p
          aria-hidden="true"
          className={cx(
            'hand pointer-events-none absolute -top-9 right-0 w-[150px] rotate-3 text-left text-[22px] transition-[opacity,translate] duration-300 lg:-right-6',
            before && play ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
          )}
        >
          {c.note}
        </p>
      </button>
      <div className="flex min-w-0 flex-col gap-1.5 text-left lg:items-center lg:text-center">
        <p className="mono m-0 text-[11px] text-muted lg:text-[12px]">
          {c.kind} · {c.city}
        </p>
        <h3 className="m-0 text-[22px] leading-7 lg:text-[26px] lg:leading-8">{c.name}</h3>
        <p className="m-0 max-w-[300px] text-[15px] leading-[22px] text-ink-soft lg:text-[17px] lg:leading-[26px]">{nb(c.result)}</p>
      </div>
    </div>
  )
}

/** A strip of tape pinning the phone to the desk. */
function Tape() {
  return <span aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 bg-cream/80 [box-shadow:0_1px_0_rgba(22,17,16,0.08)]" />
}

/** The phone: old site underneath, new site on top, revealed from the top down to the dashed band. */
function CasePhone({ c, before }: { c: CaseStudy; before: boolean }) {
  const after = useRef<HTMLDivElement>(null)
  const band = useRef<HTMLDivElement>(null)
  // How far the new site reaches down (px of the screen): 0 = old site only.
  const reach = useRef(0)

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
      // Interrupted (hover out mid-wipe): continue from where the line is now.
      const progress = a.effect?.getComputedTiming().progress ?? 1
      reach.current = from + (target - from) * progress
      a.commitStyles?.()
      a.cancel()
      b.cancel()
    }
  }, [before])

  return (
    <div className="relative h-[460px] w-[220px] overflow-hidden rounded-[30px] border-[7px] border-solid border-ink bg-ink shadow-[0_24px_40px_-24px_rgba(22,17,16,0.55)]">
      <div className="absolute inset-0">
        <MiniOld look={c.old} />
      </div>
      <div ref={after} className="absolute inset-0" style={{ clipPath: `inset(0 0 ${SCREEN.h}px 0)` }}>
        <MiniNew look={c.new} />
      </div>
      <div ref={band} className="absolute inset-x-0 top-0 -mt-[5px] flex h-[10px] items-center bg-cream opacity-0">
        <span className="block w-full border-0 border-t-2 border-dashed border-terracotta" />
      </div>
    </div>
  )
}

/* ---------- the two mini sites (206 × 446, drawn at size) ---------- */

const link: CSSProperties = { color: '#0000EE', textDecoration: 'underline' }

function MiniOld({ look }: { look: OldSiteLook }) {
  return (
    <div
      aria-hidden="true"
      style={{ width: SCREEN.w, height: SCREEN.h, background: '#EFEFEF', color: '#222', fontFamily: "'Times New Roman',Times,serif", textAlign: 'center', overflow: 'hidden' }}
    >
      <div style={{ background: `linear-gradient(180deg, ${look.header[0]}, ${look.header[1]})`, padding: '12px 6px 9px' }}>
        <p style={{ margin: 0, fontFamily: look.titleFont, fontSize: 17, fontWeight: 700, lineHeight: 1.1, color: look.titleColor, textShadow: '1px 1px 0 #000' }}>{look.title}</p>
        <p style={{ margin: '3px 0 0', fontSize: 8, fontStyle: 'italic', color: '#fff' }}>{look.subtitle}</p>
      </div>
      <p style={{ margin: 0, background: '#CCCCCC', padding: '4px 2px', fontSize: 8, borderBottom: '1px solid #999' }}>
        {look.links.map((l, i) => (
          <span key={l}>
            {i > 0 && ' | '}
            <span style={link}>{l}</span>
          </span>
        ))}
      </p>
      <p className="old-blink" style={{ margin: '9px 0 0', fontSize: 10, fontWeight: 700, color: '#FF0000' }}>
        {look.shout}
      </p>
      <p style={{ margin: '8px 12px 0', fontSize: 8.5, lineHeight: '11.5px' }}>{look.body}</p>
      <div
        style={{
          margin: '10px auto 0',
          width: 140,
          height: 78,
          border: '1px solid #999',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          fontSize: 7.5,
          color: '#777',
        }}
      >
        <span style={{ display: 'inline-block', width: 10, height: 10, border: '1px solid #C00', color: '#C00', fontSize: 8, lineHeight: '9px', fontFamily: 'Arial' }}>x</span>
        {look.broken}
      </div>
      <p style={{ margin: '10px 12px 0', fontSize: 8.5 }}>
        <span style={link}>Ceník ke stažení (PDF)</span>
      </p>
      <p style={{ margin: '8px 12px 0', fontSize: 7.5, fontStyle: 'italic', color: '#555' }}>Stránky jsou optimalizovány pro rozlišení 1024 × 768.</p>
      <p style={{ margin: '10px 0 0', fontSize: 7.5, color: '#555' }}>
        Počet návštěv: <span style={{ fontFamily: "'Courier New',monospace", background: '#000', color: '#0F0', padding: '0 3px' }}>002318</span>
      </p>
      <p style={{ margin: '5px 0 0', fontSize: 7, color: '#777' }}>Naposledy aktualizováno: {look.updated}</p>
    </div>
  )
}

const FONTS: Record<NewSiteLook['font'], { family: string; headline: CSSProperties }> = {
  archivo: { family: "'Archivo Variable','Archivo','Arial Narrow',sans-serif", headline: { fontWeight: 900, fontStretch: '72%', textTransform: 'uppercase', fontSize: 34, lineHeight: 0.88 } },
  serif: { family: "Georgia,'Times New Roman',serif", headline: { fontWeight: 700, fontSize: 28, lineHeight: 1.02, letterSpacing: '-0.01em' } },
  sans: { family: "'Instrument Sans','Helvetica Neue',Arial,sans-serif", headline: { fontWeight: 700, fontSize: 27, lineHeight: 1, letterSpacing: '-0.03em' } },
}

function MiniNew({ look }: { look: NewSiteLook }) {
  const font = FONTS[look.font]
  return (
    <div aria-hidden="true" style={{ position: 'relative', width: SCREEN.w, height: SCREEN.h, background: look.bg, color: look.fg, fontFamily: font.family, overflow: 'hidden' }}>
      <div style={{ height: 34, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${look.fg}22` }}>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em' }}>{look.logo}</span>
        <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75 }}>{look.meta}</span>
      </div>
      <div style={{ padding: '11px 10px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span
          style={{
            alignSelf: 'flex-start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 7.5,
            fontWeight: 700,
            padding: '4px 7px',
            borderRadius: 999,
            background: look.fg,
            color: look.bg,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3DDC84' }} />
          {look.badge}
        </span>
        <p style={{ margin: 0, ...font.headline }}>{look.headline}</p>
        <p style={{ margin: 0, fontSize: 9.5, lineHeight: '13.5px', opacity: 0.85 }}>{look.sub}</p>
        <span style={{ marginTop: 2, display: 'block', textAlign: 'center', padding: '9px 6px', borderRadius: 8, background: look.accent, color: look.onAccent, fontSize: 10, fontWeight: 800 }}>
          {look.cta}
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 246,
          bottom: 0,
          padding: '12px 10px',
          borderRadius: '14px 14px 0 0',
          background: look.panel,
          color: look.panelFg,
        }}
      >
        <p style={{ margin: '0 0 5px', fontSize: 6.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.6 }}>{look.bottom.title}</p>
        {look.bottom.kind === 'list' ? (
          look.bottom.rows.map(([name, price]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderTop: `1px solid ${look.panelFg}22`, fontSize: 9.5, fontWeight: 700 }}>
              <span>{name}</span>
              <span>{price}</span>
            </div>
          ))
        ) : (
          <div style={{ display: 'flex', gap: 6 }}>
            {look.bottom.tiles.map(([color, text]) => (
              <div key={text} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ display: 'block', height: 118, borderRadius: 8, background: color }} />
                <span style={{ fontSize: 8, fontWeight: 700 }}>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

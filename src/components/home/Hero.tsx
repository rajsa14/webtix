import { useEffect, useId, useState, type CSSProperties, type FormEvent } from 'react'
import { INQUIRY_ANCHOR, PREVIEW_DAYS, priceText } from '../../data/site'
import { NOTE_MIN_PX, noteSize } from '../../lib/notes'
import { navigate } from '../../lib/router'
import { useUi } from '../../store/ui'
import { Navbar } from '../Navbar'
import {
  FILL_HEIGHT,
  LINE_HEIGHT,
  PHONE_LABEL,
  desktopFrame,
  phoneFrame,
  useGroupScale,
  useReducedMotion,
  useScene,
  type PlayState,
} from './heroScene'
import { ShopAfter, ShopBefore, ShopScreen } from './Shop'

/*
 * The hero, from docs/design/source/S1Pred (před), S2Siti (předělávka) and
 * S3Po (po), 1440 × 900, and S1Mobile for phones. Timing and painting live in
 * heroScene.ts.
 *
 * Desktop (1024px and up) is a fluid two-column layout: the text column (state
 * 1, it stays put) and the pink panel with the phone, its notes and arrows as
 * one group in the design's 720 × 900 coordinates, scaled to fit.
 * Phone: the header text, then the pink block with the phone and two notes.
 * In both, the phone scene plays once like a short video when it comes into
 * view: old site, the dashed line wipes down, new site. A button pauses,
 * resumes and replays it. Reduced motion: nothing moves, the button switches
 * between the old and the new site.
 */

const PANEL = { width: 720, height: 900 }
const PHONE_SCENE = { width: 390, height: 520 }
const PHONE_CLAMP: [number, number] = [0.8, 1.25]


/** Notes draw in one by one when the page opens (index.css, .note-in). */
const intro = (on: boolean, i: number) => (on ? { className: 'note-in', style: { animationDelay: `${300 + i * 220}ms` } } : {})

const metaText = () => `Návrh do ${PREVIEW_DAYS} pracovních dnů. Web od ${priceText()}.`

export function Hero() {
  const reduced = useReducedMotion()
  return (
    <section aria-labelledby="hero-title">
      <div className="lg:hidden">
        <PhoneHero reduced={reduced} />
      </div>
      <div className="hidden lg:block">
        <DesktopScene reduced={reduced} />
      </div>
    </section>
  )
}

const PLAY_LABEL: Record<PlayState, string> = {
  waiting: 'Pozastavit ukázku',
  playing: 'Pozastavit ukázku',
  paused: 'Přehrát ukázku',
  done: 'Přehrát znovu',
}

/** Pause, resume and replay the phone scene; with reduced motion, switch old ↔ new site. */
function PlayButton({ state, reduced, onClick, className }: { state: PlayState; reduced: boolean; onClick: () => void; className: string }) {
  const label = reduced ? (state === 'done' ? 'Ukázat starý web' : 'Ukázat nový web') : PLAY_LABEL[state]
  const icon = reduced ? 'swap' : state === 'playing' || state === 'waiting' ? 'pause' : state === 'done' ? 'replay' : 'play'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`mono inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-solid border-ink/15 bg-paper py-1.5 pl-1.5 pr-4 text-[12px] text-ink ${className}`}
    >
      {/* Progress ring around the icon, so the control reads as a video player. */}
      <span className="relative grid size-7 place-items-center">
        <svg aria-hidden="true" viewBox="0 0 28 28" className="absolute inset-0 size-full -rotate-90">
          <circle cx="14" cy="14" r="12.5" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
          <circle
            cx="14"
            cy="14"
            r="12.5"
            pathLength={1}
            fill="none"
            stroke="var(--color-terracotta)"
            strokeWidth="2"
            strokeDasharray="1"
            style={{ strokeDashoffset: 'calc(1 - var(--play, 0))' }}
          />
        </svg>
        <svg aria-hidden="true" width="10" height="10" viewBox="0 0 12 12" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {icon === 'pause' && (
          <>
            <rect x="2.5" y="2" width="2" height="8" stroke="none" />
            <rect x="7.5" y="2" width="2" height="8" stroke="none" />
          </>
        )}
        {icon === 'play' && <path d="M3 2 L10 6 L3 10 Z" stroke="none" />}
        {icon === 'replay' && (
          <>
            <path d="M2.5 6 A3.5 3.5 0 1 0 4 3.1" fill="none" />
            <path d="M2 1.5 V4 H4.5" fill="none" />
          </>
        )}
        {icon === 'swap' && <path d="M2 4 H10 M7.5 1.5 L10 4 L7.5 6.5 M10 8 H2 M4.5 5.5 L2 8 L4.5 10.5" fill="none" />}
        </svg>
      </span>
      {label}
    </button>
  )
}

/** "Váš web nebo @instagram" + "Chci návrh". Sends the address on to the enquiry form. */
function HeroForm({ variant, value, onValueChange }: { variant: 'desktop' | 'phone'; value: string; onValueChange: (v: string) => void }) {
  const id = useId()
  const setHeroSite = useUi((s) => s.setHeroSite)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setHeroSite(value.trim())
    navigate(`/#${INQUIRY_ANCHOR}`)
  }

  const desktop = variant === 'desktop'
  return (
    <form onSubmit={onSubmit} className={desktop ? 'flex w-[min(520px,100%)] gap-2' : 'flex gap-2'}>
      <label htmlFor={id} className="absolute size-px overflow-hidden [clip:rect(0_0_0_0)]">
        Váš web nebo Instagram
      </label>
      <input
        id={id}
        name="currentSite"
        type="text"
        inputMode="url"
        autoComplete="url"
        placeholder="Váš web nebo @instagram"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={
          desktop
            ? 'min-w-0 flex-1 rounded-input border border-ink bg-white p-4 font-sans text-[17px] text-ink'
            : 'min-w-0 flex-1 rounded-input border border-ink bg-white px-3 py-3.5 font-sans text-[16px] text-ink'
        }
      />
      <button
        type="submit"
        className={
          desktop
            ? 'hero-cta cursor-pointer rounded-card border-0 bg-ink px-6 font-sans text-[16px] font-medium text-paper'
            : 'cursor-pointer rounded-card border-0 bg-ink px-4 font-sans text-[15px] font-medium text-paper'
        }
      >
        Chci návrh
      </button>
    </form>
  )
}

/**
 * The phone: Šlapadlo's old site, and the new one on top of it, revealed from
 * the top down by a clip-path down to the cream band with the dashed line.
 */
function ScenePhone({ className, shopScale, band }: { className: string; shopScale?: number; band: { height: number; dash: number } }) {
  return (
    <div data-phone role="img" aria-label={PHONE_LABEL.old} className={className}>
      <div className="absolute inset-0 bg-[#EFEFEF]">
        <ShopScreen scale={shopScale}>
          <ShopBefore />
        </ShopScreen>
      </div>
      <div data-after className="absolute inset-0 bg-[#FFD23F]">
        <ShopScreen scale={shopScale}>
          <ShopAfter />
        </ShopScreen>
      </div>
      <div
        data-band
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex items-center bg-cream"
        style={{ height: band.height, marginTop: -band.height / 2 }}
      >
        <span className="block w-full border-0 border-solid border-t-terracotta [border-top-style:dashed]" style={{ borderTopWidth: band.dash }} />
      </div>
    </div>
  )
}

/** The terracotta ground above the dashed line, and the line itself, in a group's own units. */
function Fill({ width, strokeWidth }: { width: number; strokeWidth: number }) {
  // Wide enough to cover the panel past the group's sides at any scale.
  const left = -2000
  const span = width + 4000
  return (
    <>
      <div data-fill aria-hidden="true" className="absolute bg-terracotta" style={{ left, top: -FILL_HEIGHT, width: span, height: FILL_HEIGHT }} />
      <svg
        data-line
        aria-hidden="true"
        width={span}
        height={LINE_HEIGHT}
        className="absolute"
        style={{ left, top: -LINE_HEIGHT / 2 }}
      >
        {/* The dash pattern (12 9) starts at the group's left edge, as in the design. */}
        <path
          d={`M0 ${LINE_HEIGHT / 2} H${span}`}
          stroke="#161110"
          strokeWidth={strokeWidth}
          strokeDasharray="12 9"
          strokeDashoffset={21 - (-left % 21)}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </>
  )
}

/** Desktop: the text column and the pink panel, one screen tall. */
function DesktopScene({ reduced }: { reduced: boolean }) {
  // The phone may grow a little past the design size on large screens.
  const [panelRef, scale, panelHeight] = useGroupScale(PANEL, [0, 1.12])
  // When the 26px notes would drop below 20px, keep only the right-hand notes (with their marks).
  const allNotes = 26 * scale >= NOTE_MIN_PX
  const [site, setSite] = useState('')

  const groupTop = (panelHeight - PANEL.height * scale) / 2
  // The text column stays on state 1 ("Vpravo je typický web…"); only the panel plays.
  const { rootRef, state, toggle } = useScene((p) => ({ ...desktopFrame(p, { scale, groupTop, allNotes }), texts: { 1: 1 }, form: '1' }), reduced)

  // Cinematic start: the panel fills the screen and plays first; the text slides in when
  // it ends, or as soon as the visitor scrolls, types or clicks.
  const [introOn, setIntroOn] = useState(!reduced)
  const showIntro = introOn && !reduced && state !== 'done'
  useEffect(() => {
    if (!introOn) return
    const end = () => setIntroOn(false)
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    events.forEach((e) => window.addEventListener(e, end, { passive: true, once: true }))
    const t = window.setTimeout(end, state === 'done' ? 0 : 12000)
    return () => {
      events.forEach((e) => window.removeEventListener(e, end))
      clearTimeout(t)
    }
  }, [introOn, state])
  // Spotlight on replays: the text steps back, a pen circle draws round the phone.
  const spot = !showIntro && !reduced && state === 'playing'
  // When a run ends, the "Chci návrh" button pulses twice.
  const [cta, setCta] = useState(false)
  useEffect(() => {
    if (state !== 'done' || reduced) return
    const on = window.setTimeout(() => setCta(true), 0)
    const off = window.setTimeout(() => setCta(false), 2600)
    return () => {
      clearTimeout(on)
      clearTimeout(off)
    }
  }, [state, reduced])

  const s1 = allNotes ? ['a0', 'a1', 'a2', 'a3'] : ['a0', 'a2']
  const n1 = (key: string) => intro(!reduced, s1.indexOf(key))
  const heading = 'm-0 text-[clamp(48px,5.5556cqw,88px)] leading-[0.92] tracking-[-0.04em] text-balance'
  const lead = 'm-0 w-[min(500px,100%)] text-[clamp(17px,1.3889cqw,21px)] leading-[1.5] text-ink-soft'

  return (
    <div
      ref={rootRef}
      data-scene
      data-intro={showIntro || undefined}
      data-spot={spot || undefined}
      data-cta={cta || undefined}
      className="hero-grid h-screen-stable relative grid min-h-[640px] [container-type:inline-size]"
      // Outer margin: 64px, and wider screens keep a 1600 content width centred.
      style={{ ['--edge' as string]: 'max(64px, calc(50cqw - 736px))' }}
    >
      {/* First in the DOM so the keyboard reaches the header before the hero form; z-10 keeps it over the panel. */}
      <div data-nav className="hero-nav absolute inset-x-[var(--edge)] top-0 z-10">
        <Navbar variant="desktop" />
      </div>
      <div inert={showIntro} className="hero-text min-w-0 overflow-hidden pl-[var(--edge)] pt-[clamp(112px,18.667svh,168px)]">
        <div data-text="1" className="flex w-[min(620px,calc(50cqw-var(--edge)-36px))] flex-col">
          <p className="mono m-0 mb-6 text-muted">Webové studio · Praha</p>
          <h1 id="hero-title" className={`${heading} mb-8`}>
            Podíváme se na váš web. Pak vám ukážeme <em className="italic text-terracotta">lepší.</em>
          </h1>
          <p className={`${lead} mb-10`}>Vpravo je typický web malého podniku. Podnik jsme si vymysleli, chyby jsou skutečné.</p>
          <div data-form="1" className="mb-4">
            <HeroForm variant="desktop" value={site} onValueChange={setSite} />
          </div>
          <p className="m-0 text-meta text-muted">{metaText()}</p>
          {/* Points first-time visitors at the phone, so they watch before scrolling on. */}
          <p aria-hidden="true" className="hand hero-cue mt-8 flex items-center gap-3 text-[30px]">
            Sledujte, co s tím webem uděláme
            <svg viewBox="0 0 100 26" className="cue-arrow h-6 w-20 shrink-0" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 15 C 30 6, 62 22, 94 12" />
              <path d="M81 4 L 95 12 L 82 21" />
            </svg>
          </p>
        </div>
      </div>

      <div ref={panelRef} className="relative flex items-center justify-center overflow-hidden bg-pink">
        {/* The phone with its notes and arrows: one group, scaled to fit the panel. */}
        <div className="relative shrink-0" style={{ width: PANEL.width, height: PANEL.height, zoom: scale }}>
          <Fill width={PANEL.width} strokeWidth={3} />
          <ScenePhone
            band={{ height: 16, dash: 3 }}
            className="hero-phone-in absolute left-[160px] top-[104px] h-[740px] w-[360px] overflow-hidden rounded-[44px] border-[10px] border-solid border-ink bg-ink shadow-[0_30px_60px_-30px_rgba(22,17,16,0.5)]"
          />

          {/* Spotlight: a pen circle drawn round the phone while a replay runs. */}
          <svg aria-hidden="true" width="720" height="900" viewBox="720 0 720 900" className="hero-spot pointer-events-none absolute inset-0 text-pen">
            <path
              pathLength={1}
              d="M1062 78 C 1292 80, 1306 300, 1294 482 C 1284 702, 1252 876, 1058 874 C 858 872, 828 700, 826 482 C 824 262, 842 70, 1086 92"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* Design coordinates minus 720, the panel's left edge in the 1440 artboard. */}
          <svg aria-hidden="true" width="720" height="900" viewBox="720 0 720 900" className="pointer-events-none absolute inset-0">
            <g fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <g stroke="#9B2C1F">
                <g data-note="a0" {...n1('a0')}>
                  <ellipse cx="1060" cy="240" rx="156" ry="19" transform="rotate(-2 1060 240)" />
                  <path d="M1264 200 C 1246 212, 1232 224, 1220 234" />
                  <path d="M1220 221 L 1219 235 L 1232 237" />
                </g>
                {allNotes && (
                  <g data-note="a1" {...n1('a1')}>
                    <ellipse cx="1060" cy="402" rx="116" ry="72" transform="rotate(3 1060 402)" />
                    <path d="M868 410 C 900 404, 920 402, 940 404" />
                    <path d="M928 396 L 941 404 L 928 412" />
                  </g>
                )}
                <g data-note="a2" {...n1('a2')}>
                  <path d="M954 538 q 10 -7 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
                  <path d="M1264 548 C 1240 548, 1220 546, 1196 542" />
                  <path d="M1208 534 L 1195 542 L 1207 550" />
                </g>
                {allNotes && (
                  <g data-note="a3" {...n1('a3')}>
                    <ellipse cx="1060" cy="746" rx="104" ry="15" transform="rotate(-1 1060 746)" />
                    <path d="M868 752 C 900 752, 924 748, 952 747" />
                    <path d="M940 739 L 953 747 L 940 755" />
                  </g>
                )}
              </g>
              <g stroke="#F6EFE5">
                <g data-note="b0">
                  <path d="M1268 200 C 1200 200, 1110 198, 1050 196" />
                  <path d="M1062 188 L 1049 196 L 1062 204" />
                </g>
                {allNotes && (
                  <>
                    <g data-note="c0">
                      <path d="M868 196 C 880 194, 890 194, 900 194" />
                      <path d="M888 186 L 901 194 L 888 202" />
                    </g>
                    <g data-note="c1">
                      <path d="M868 330 C 880 330, 892 330, 904 330" />
                      <path d="M892 322 L 905 330 L 892 338" />
                    </g>
                  </>
                )}
                <g data-note="c2">
                  <path d="M1268 512 C 1250 510, 1234 508, 1218 506" />
                  <path d="M1230 498 L 1217 506 L 1229 514" />
                </g>
                <g data-note="c3">
                  <path d="M1268 712 C 1250 712, 1234 712, 1218 712" />
                  <path d="M1230 704 L 1217 712 L 1230 720" />
                </g>
              </g>
            </g>
          </svg>

          <div aria-hidden="true" style={{ fontSize: noteSize(26, scale) }}>
            <Note k="a0" at="left-[552px] top-[156px] w-[156px] rotate-2" {...n1('a0')}>
              Nově v sobotu? Dole stojí „dle dohody“.
            </Note>
            {allNotes && (
              <Note k="a1" at="left-[24px] top-[368px] w-[124px] -rotate-2" {...n1('a1')}>
                Fotka dílny se nenačte.
              </Note>
            )}
            <Note k="a2" at="left-[552px] top-[504px] w-[156px] rotate-2" {...n1('a2')}>
              Ceník jen v PDF. Na mobilu? Hodně štěstí.
            </Note>
            {allNotes && (
              <Note k="a3" at="left-[24px] top-[712px] w-[124px] -rotate-2" {...n1('a3')}>
                Naposledy změněno 2014.
              </Note>
            )}

            <Note k="b0" at="left-[552px] top-[180px] w-[156px] rotate-2 text-cream">
              Nahoře už nový web.
            </Note>
            <Note k="b1" at="left-[552px] top-[560px] w-[156px] -rotate-2">
              Tohle ještě předěláváme…
            </Note>

            {allNotes && (
              <>
                <Note k="c0" at="left-[24px] top-[164px] w-[124px] -rotate-2 text-cream">
                  Otevřeno? Hned vidíte.
                </Note>
                <Note k="c1" at="left-[24px] top-[300px] w-[124px] -rotate-2 text-cream">
                  Slib místo „tradice“.
                </Note>
              </>
            )}
            <Note k="c2" at="left-[552px] top-[476px] w-[156px] rotate-2 text-cream">
              Objednávka jedním tlačítkem.
            </Note>
            <Note k="c3" at="left-[552px] top-[684px] w-[156px] rotate-2 text-cream">
              Ceník rovnou na stránce.
            </Note>
          </div>
        </div>
        <PlayButton state={state} reduced={reduced} onClick={toggle} className="absolute bottom-6 right-[var(--edge)] z-10" />
      </div>
    </div>
  )
}

function Note({ k, at, className, style, children }: { k: string; at: string; className?: string; style?: CSSProperties; children: string }) {
  return (
    <p data-note={k} className={`hand absolute ${at} ${className ?? ''}`} style={style}>
      {children}
    </p>
  )
}

function PhoneHero({ reduced }: { reduced: boolean }) {
  const [site, setSite] = useState('')
  const [sceneRef, scale] = useGroupScale({ width: PHONE_SCENE.width }, PHONE_CLAMP)
  return (
    <>
      <Navbar variant="phone" />
      <div className="flex flex-col gap-4 px-4 pt-3">
        <p className="mono m-0 text-[11px] text-muted">Webové studio · Praha</p>
        <h1 id="hero-title-telefon" className="m-0 text-hero-m">
          Podíváme se na váš web. Pak vám ukážeme <em className="italic text-terracotta">lepší.</em>
        </h1>
        <p className="m-0 text-body-m text-ink-soft">Níž je typický web malého podniku. Podnik je vymyšlený, chyby jsou skutečné.</p>
      </div>
      {/* On phones the animation comes first, inside the first screen; the form follows it. */}
      <div ref={sceneRef} className="mt-6">
        <PhoneScene scale={scale} reduced={reduced} />
      </div>
      <div className="flex flex-col gap-4 px-4 pt-6">
        <HeroForm variant="phone" value={site} onValueChange={setSite} />
        <p className="m-0 text-meta-m text-muted">{metaText()}</p>
      </div>
    </>
  )
}

/** Phone: the pink block of S1Mobile, playing the same wipe; the control sits below it. */
function PhoneScene({ scale, reduced }: { scale: number; reduced: boolean }) {
  const { rootRef, state, toggle } = useScene((p) => phoneFrame(p, { pad: 12 }), reduced)
  const live = !reduced

  const group = (
    <div ref={rootRef} className="relative mx-auto" style={{ width: PHONE_SCENE.width, height: PHONE_SCENE.height, zoom: scale }}>
      <Fill width={PHONE_SCENE.width} strokeWidth={2.5} />
      <ScenePhone
        shopScale={0.606}
        band={{ height: 10, dash: 2 }}
        className="absolute left-[150px] top-[28px] h-[460px] w-[220px] overflow-hidden rounded-[30px] border-[7px] border-solid border-ink bg-ink"
      />
      <>
          <svg aria-hidden="true" width="390" height="424" viewBox="0 0 390 424" className="pointer-events-none absolute left-0 top-0">
            <g fill="none" stroke="#9B2C1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <g data-note="m0" {...intro(live, 0)}>
                <ellipse cx="260" cy="111" rx="96" ry="12" transform="rotate(-2 260 111)" />
                <path d="M112 104 C 130 104, 146 106, 160 108" />
                <path d="M151 101 L 161 108 L 151 115" />
              </g>
              <g data-note="m1" {...intro(live, 1)}>
                <ellipse cx="240" cy="210" rx="56" ry="44" transform="rotate(3 240 210)" />
                <path d="M112 218 C 140 216, 160 214, 180 212" />
                <path d="M170 205 L 181 212 L 171 219" />
              </g>
            </g>
          </svg>
          <div aria-hidden="true" style={{ fontSize: noteSize(22, scale) }}>
            <Note k="m0" at="left-[14px] top-20 w-24 -rotate-4" {...intro(live, 0)}>
              Křičí to. A kdy?
            </Note>
            <Note k="m1" at="left-[14px] top-48 w-24 -rotate-3" {...intro(live, 1)}>
              Fotka se nenačte.
            </Note>
          </div>
      </>
    </div>
  )

  return (
    <div data-scene>
      <div className="overflow-clip bg-pink">{group}</div>
      <div className="flex justify-end px-4 pt-3">
        <PlayButton state={state} reduced={reduced} onClick={toggle} className="" />
      </div>
    </div>
  )
}

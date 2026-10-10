import { useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { INQUIRY_ANCHOR, PREVIEW_DAYS, priceText } from '../../data/site'
import { navigate } from '../../lib/router'
import { useUi } from '../../store/ui'
import { Navbar } from '../Navbar'
import { ShopBefore, ShopScreen } from './Shop'

/*
 * Hero, state 1 ("před"), static. Built from docs/design/source/S1Pred.dc.html
 * (1440 × 900) and S1Mobile.dc.html (390px phone); sizes and copy come from there.
 *
 * Desktop (1024px and up) is a fluid two-column layout: the text column and
 * the pink panel sit on a real grid, headings use clamp(), body text stays at
 * 17px or more. Only the phone mockup with its notes and arrows scales, as
 * one group, and it shrinks on screens shorter than 900px instead of the text.
 */

/** The phone group is drawn in the panel's own 720 × 900 coordinates from the design. */
const PANEL = { width: 720, height: 900 }
const PHONE_SCENE_WIDTH = 390

/** Scale of a group drawn at a fixed size so it fits the measured box, never above 1. */
function useGroupScale(base: { width: number; height?: number }, [min, max]: [number, number] = [0, 1]) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const fit = Math.min(el.clientWidth / base.width, base.height ? el.clientHeight / base.height : Infinity)
      setScale(Math.min(max, Math.max(min, fit)))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [base.width, base.height, min, max])
  return [ref, scale] as const
}

/** Handwritten notes never render below 20px, however small their group is scaled. */
const NOTE_MIN_PX = 20
const noteSize = (designSize: number, scale: number) => Math.max(designSize, Math.ceil((NOTE_MIN_PX / scale) * 10) / 10)

const metaText = () => `Návrh do ${PREVIEW_DAYS} pracovních dnů. Web od ${priceText()}.`

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="lg:hidden">
        <PhoneHero />
      </div>
      <div className="hidden lg:block">
        <DesktopHero />
      </div>
    </section>
  )
}

/** "Váš web nebo @instagram" + "Chci návrh". Sends the address on to the enquiry form. */
function HeroForm({ variant }: { variant: 'desktop' | 'phone' }) {
  const id = useId()
  const [value, setValue] = useState('')
  const setHeroSite = useUi((s) => s.setHeroSite)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setHeroSite(value.trim())
    navigate(`/#${INQUIRY_ANCHOR}`)
  }

  const desktop = variant === 'desktop'
  return (
    <form onSubmit={onSubmit} className={desktop ? 'mb-4 flex w-[min(520px,100%)] gap-2' : 'flex gap-2'}>
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
        onChange={(e) => setValue(e.target.value)}
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
            ? 'cursor-pointer rounded-card border-0 bg-ink px-6 font-sans text-[16px] font-medium text-paper'
            : 'cursor-pointer rounded-card border-0 bg-ink px-4 font-sans text-[15px] font-medium text-paper'
        }
      >
        Chci návrh
      </button>
    </form>
  )
}

/** The old-site phone: a frame with Šlapadlo's old site on its screen. */
function OldSitePhone({ className, scale }: { className: string; scale?: number }) {
  return (
    <div role="img" aria-label="Ukázka: starý web vymyšleného servisu kol Šlapadlo" className={className}>
      <ShopScreen scale={scale}>
        <ShopBefore />
      </ShopScreen>
    </div>
  )
}

const PHONE_CLAMP: [number, number] = [0.8, 1.25]

function DesktopHero() {
  const [panelRef, scale] = useGroupScale(PANEL)
  // When the 26px notes would drop below 20px, keep only the two right-hand notes (with their marks).
  const allNotes = 26 * scale >= NOTE_MIN_PX
  return (
    <div
      className="relative grid h-svh min-h-[640px] grid-cols-2 [container-type:inline-size]"
      // Outer margin: 64px, and wider screens keep the 1440 content width centred.
      style={{ ['--edge' as string]: 'max(64px, calc(50cqw - 656px))' }}
    >
      <div className="bg-paper pl-[var(--edge)] pt-[clamp(112px,18.667svh,168px)]">
        <div className="flex w-[min(620px,calc(50cqw-var(--edge)-36px))] flex-col">
          <p className="mono m-0 mb-6 text-muted">Webové studio · Praha</p>
          <h1 id="hero-title" className="m-0 mb-8 text-[clamp(48px,5.5556cqw,80px)] leading-[0.92] tracking-[-0.04em] text-balance">
            Podíváme se na váš web. Pak vám ukážeme <em className="italic text-terracotta">lepší.</em>
          </h1>
          <p className="m-0 mb-10 w-[min(500px,100%)] text-[clamp(17px,1.3889cqw,20px)] leading-[1.5] text-ink-soft">
            Vpravo je typický web malého podniku. Podnik jsme si vymysleli, chyby jsou skutečné.
          </p>
          <HeroForm variant="desktop" />
          <p className="m-0 text-meta text-muted">{metaText()}</p>
        </div>
      </div>

      <div ref={panelRef} className="relative flex items-center justify-center overflow-hidden bg-pink">
        {/* The phone with its notes and arrows: one group, scaled to fit the panel. */}
        <div className="relative shrink-0" style={{ width: PANEL.width, height: PANEL.height, zoom: scale }}>
          <OldSitePhone className="absolute left-[160px] top-[104px] h-[740px] w-[360px] overflow-hidden rounded-[44px] border-[10px] border-solid border-ink bg-[#EFEFEF] shadow-[0_30px_60px_-30px_rgba(22,17,16,0.5)]" />

          {/* Design coordinates minus 720, the panel's left edge in the 1440 artboard. */}
          <svg aria-hidden="true" width="720" height="900" viewBox="720 0 720 900" className="pointer-events-none absolute inset-0">
            <g fill="none" stroke="#9B2C1F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="1060" cy="240" rx="156" ry="19" transform="rotate(-2 1060 240)" />
              <path d="M1264 200 C 1246 212, 1232 224, 1220 234" />
              <path d="M1220 221 L 1219 235 L 1232 237" />
              {allNotes && (
                <>
                  <ellipse cx="1060" cy="402" rx="116" ry="72" transform="rotate(3 1060 402)" />
                  <path d="M868 410 C 900 404, 920 402, 940 404" />
                  <path d="M928 396 L 941 404 L 928 412" />
                </>
              )}
              <path d="M954 538 q 10 -7 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" />
              <path d="M1264 548 C 1240 548, 1220 546, 1196 542" />
              <path d="M1208 534 L 1195 542 L 1207 550" />
              {allNotes && (
                <>
                  <ellipse cx="1060" cy="746" rx="104" ry="15" transform="rotate(-1 1060 746)" />
                  <path d="M868 752 C 900 752, 924 748, 952 747" />
                  <path d="M940 739 L 953 747 L 940 755" />
                </>
              )}
            </g>
          </svg>

          <div aria-hidden="true" style={{ fontSize: noteSize(26, scale) }}>
            <p className="hand absolute left-[552px] top-[156px] w-[156px] rotate-2">Nově v sobotu? Dole stojí „dle dohody“.</p>
            {allNotes && <p className="hand absolute left-[24px] top-[368px] w-[124px] -rotate-2">Fotka dílny se nenačte.</p>}
            <p className="hand absolute left-[552px] top-[504px] w-[156px] rotate-2">Ceník jen v PDF. Na mobilu? Hodně štěstí.</p>
            {allNotes && <p className="hand absolute left-[24px] top-[712px] w-[124px] -rotate-2">Naposledy změněno 2014.</p>}
          </div>
        </div>
      </div>

      <Navbar variant="desktop" className="absolute inset-x-[var(--edge)] top-0" />
    </div>
  )
}

function PhoneHero() {
  const [sceneRef, scale] = useGroupScale({ width: PHONE_SCENE_WIDTH }, PHONE_CLAMP)
  return (
    <>
      <Navbar variant="phone" />
      <div className="flex flex-col gap-4 px-4 pt-3">
        <p className="mono m-0 text-[11px] text-muted">Webové studio · Praha</p>
        <h1 id="hero-title-telefon" className="m-0 text-hero-m">
          Podíváme se na váš web. Pak vám ukážeme <em className="italic text-terracotta">lepší.</em>
        </h1>
        <p className="m-0 text-body-m text-ink-soft">Níž je typický web malého podniku. Podnik je vymyšlený, chyby jsou skutečné.</p>
        <HeroForm variant="phone" />
        <p className="m-0 text-meta-m text-muted">{metaText()}</p>
      </div>

      {/* Pink block. Its height is temporary until the scroll scene (step 4). */}
      <div ref={sceneRef} className="mt-7 overflow-hidden bg-pink">
        <div className="relative mx-auto" style={{ width: PHONE_SCENE_WIDTH, height: 520, zoom: scale }}>
          <OldSitePhone scale={0.606} className="absolute left-[150px] top-[28px] h-[460px] w-[220px] overflow-hidden rounded-[30px] border-[7px] border-solid border-ink bg-[#EFEFEF]" />
          <svg aria-hidden="true" width="390" height="424" viewBox="0 0 390 424" className="pointer-events-none absolute left-0 top-0">
            <g fill="none" stroke="#9B2C1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="260" cy="111" rx="96" ry="12" transform="rotate(-2 260 111)" />
              <path d="M112 104 C 130 104, 146 106, 160 108" />
              <path d="M151 101 L 161 108 L 151 115" />
              <ellipse cx="240" cy="210" rx="56" ry="44" transform="rotate(3 240 210)" />
              <path d="M112 218 C 140 216, 160 214, 180 212" />
              <path d="M170 205 L 181 212 L 171 219" />
            </g>
          </svg>
          <div aria-hidden="true" style={{ fontSize: noteSize(22, scale) }}>
            <p className="hand absolute left-[14px] top-20 w-24 -rotate-4">Křičí to. A kdy?</p>
            <p className="hand absolute left-[14px] top-48 w-24 -rotate-3">Fotka se nenačte.</p>
          </div>
        </div>
      </div>
    </>
  )
}

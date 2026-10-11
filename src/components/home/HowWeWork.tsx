import type { ReactNode } from 'react'
import { previewDaysWords } from '../../data/site'
import { NOTE_MIN_PX, noteSize } from '../../lib/notes'
import { revealDelay } from '../../lib/motion'
import { cx } from '../../lib/text'
import { useGroupScale } from './heroScene'
import { ShopAfter, ShopBefore, ShopScreen } from './Shop'

/*
 * "Jak to děláme": heading, intro and three steps with scene cards. Built from
 * docs/design/source/Rest.dc.html (1440) and RestMobile.dc.html (390).
 *
 * Text sits on the real 12-column grid. Each scene card is media: its content
 * is drawn at the design's card size and scaled as one group to the card's
 * width (the handwritten notes stay at 20px or more).
 */

type Variant = 'desktop' | 'phone'

/** Card content size in the design: 421.33 × 316 at 1440, 358 × 268.5 at 390. */
const CARD = {
  desktop: { width: (1312 - 48) / 3, height: 316, clamp: [0, 1.15] as [number, number] },
  phone: { width: 358, height: 268.5, clamp: [0.8, 1.25] as [number, number] },
}

const SHOP_SCALE = 0.4235

export function HowWeWork() {
  // "pět pracovních dnů": the last two words never split across lines.
  const days = previewDaysWords()
  const cut = days.lastIndexOf(' ')
  return (
    <section id="jak-to-delame" aria-labelledby="jak-title" className="container-x pb-24 pt-10 lg:pb-40 lg:pt-16">
      <div data-reveal className="flex flex-col lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-6">
        <div className="flex flex-col lg:col-span-7">
          <p className="section-num mono m-0 mb-4 text-[11px] text-muted lg:mb-6 lg:text-[12px]">
            <span>01</span> Jak to děláme
          </p>
          <h2
            id="jak-title"
            className="m-0 mb-5 text-[40px] leading-[0.96] tracking-[-0.035em] lg:mb-0 lg:text-[clamp(46px,4.6vw,72px)] lg:leading-[0.95]"
          >
            Od odkazu k&nbsp;hotovému návrhu za{' '}
            <em className="italic text-terracotta">
              {days.slice(0, cut)}&nbsp;{days.slice(cut + 1)}.
            </em>
          </h2>
        </div>
        <p className="m-0 text-[16px] leading-6 text-ink-soft lg:col-span-4 lg:col-start-9 lg:text-[20px] lg:leading-[30px]">
          {/* The phone copy is one phrase shorter. */}
          Nepotřebujeme <span className="hidden lg:inline">od vás </span>zadání ani schůzku. Stačí odkaz na to, co už máte.
        </p>
      </div>

      <ol className="m-0 mt-10 flex list-none flex-col gap-10 p-0 lg:mt-[72px] lg:grid lg:grid-cols-3 lg:gap-6">
        <Step i={0} number="01" title="Pošlete odkaz" text="Web, Instagram, nebo jen název podniku." card={<SceneCard className="bg-pink">{LinkScene}</SceneCard>} />
        <Step
          i={1}
          number="02"
          title="Postavíme první stránku"
          text="Z vašich fotek, textů a menu. Na vlastní adrese, ne v PDF."
          card={<SceneCard className="bg-terracotta">{BuildScene}</SceneCard>}
        />
        <Step
          i={2}
          number="03"
          title="Rozhodnete se"
          text="Líbí se vám? Domluvíme cenu a dokončíme zbytek. Nelíbí? Nic neplatíte."
          card={<SceneCard className="bg-ink">{DecideScene}</SceneCard>}
        />
      </ol>
    </section>
  )
}

function Step({ i, number, title, text, card }: { i: number; number: string; title: string; text: string; card: ReactNode }) {
  return (
    <li data-reveal style={revealDelay(i, 140)} className="relative z-0 flex flex-col gap-4 lg:gap-6">
      <span aria-hidden="true" className="step-num pointer-events-none absolute -left-2 -top-[86px] -z-10 hidden text-[150px] font-bold leading-none tracking-[-0.05em] lg:block">
        {number}
      </span>
      {card}
      <div className="flex items-baseline gap-3 lg:gap-4">
        <span className="mono text-[11px] text-terracotta lg:text-[12px]">{number}</span>
        <div className="flex flex-col gap-1.5 lg:gap-2">
          <h3 className="m-0 text-[22px] leading-7 lg:text-[clamp(22px,2.0833vw,31px)] lg:leading-[1.1429] lg:tracking-[-0.01em]">{title}</h3>
          <p className="m-0 text-[16px] leading-6 text-ink-soft lg:text-[18px] lg:leading-7">{text}</p>
        </div>
      </div>
    </li>
  )
}

type Scene = (variant: Variant, scale: number) => ReactNode

/** A 4:3 card. Its picture is drawn once per layout and only the matching one is shown. */
function SceneCard({ className, children }: { className: string; children: Scene }) {
  return (
    <div aria-hidden="true" className={cx('scene-card relative aspect-[4/3] overflow-hidden rounded-card', className)}>
      <CardGroup variant="desktop" className="hidden lg:flex">
        {children}
      </CardGroup>
      <CardGroup variant="phone" className="flex lg:hidden">
        {children}
      </CardGroup>
    </div>
  )
}

function CardGroup({ variant, className, children }: { variant: Variant; className: string; children: Scene }) {
  const base = CARD[variant]
  const [ref, scale] = useGroupScale(base, base.clamp)
  return (
    <div ref={ref} className={cx('absolute inset-0 items-start justify-center', className)}>
      <div className="relative shrink-0" style={{ width: base.width, height: base.height, zoom: scale }}>
        {children(variant, scale)}
      </div>
    </div>
  )
}

/** 01: the hero's input box with a link in it. */
const LinkScene: Scene = (variant, scale) => {
  const desktop = variant === 'desktop'
  return (
    <div className={cx('flex h-full flex-col items-center justify-center', desktop ? 'gap-4' : 'gap-3')}>
      <div
        className="flex items-center gap-1.5 rounded-[10px] border border-solid border-ink bg-white"
        style={{ width: desktop ? '78%' : '84%', padding: desktop ? '6px 6px 6px 16px' : '5px 5px 5px 12px' }}
      >
        <span className="flex-1" style={{ fontSize: desktop ? 17 : 15 }}>
          slapadlo.cz
          {desktop && <span className="caret ml-0.5 inline-block h-[18px] w-0.5 bg-ink align-[-3px]" />}
        </span>
        <span
          className="rounded-[6px] bg-ink font-medium text-paper"
          style={{ padding: desktop ? '10px 14px' : '9px 12px', fontSize: desktop ? 14 : 13 }}
        >
          Chci návrh
        </span>
      </div>
      <span className="hand -rotate-2" style={{ fontSize: noteSize(desktop ? 26 : 22, scale) }}>
        Stačí odkaz. Nic víc.
      </span>
    </div>
  )
}

/** The small phone of steps 02 and 03: 154 × 316, centred, 22px from the top (20 on phones). */
function SmallPhone({ variant, className, children }: { variant: Variant; className: string; children: ReactNode }) {
  return (
    <div
      className={cx('scene-lift absolute left-1/2 -ml-[77px] h-[316px] w-[154px] overflow-hidden rounded-[22px] border-[5px] border-solid', className)}
      style={{ top: variant === 'desktop' ? 22 : 20 }}
    >
      {children}
    </div>
  )
}

/** 02: the new site above the dashed line, the old one below. */
const BuildScene: Scene = (variant, scale) => (
  <>
    <SmallPhone variant={variant} className="border-ink bg-ink">
      <div className="absolute left-0 top-0 h-[138px] w-[144px] overflow-hidden">
        <ShopScreen scale={SHOP_SCALE}>
          <ShopAfter />
        </ShopScreen>
      </div>
      <div className="absolute left-0 top-[138px] h-[170px] w-[144px] overflow-hidden">
        <ShopScreen scale={SHOP_SCALE} offsetY={326}>
          <ShopBefore />
        </ShopScreen>
      </div>
      <div className="absolute inset-x-0 top-[134px] border-0 border-t-2 border-dashed border-cream" />
    </SmallPhone>
    {sideNote(variant, scale) && (
      <span className="hand absolute right-5 top-10 w-[110px] rotate-3 text-cream" style={{ fontSize: noteSize(26, scale) }}>
        Z vašich fotek a textů.
      </span>
    )}
  </>
)

/** 03: the finished new site on an ink card. */
const DecideScene: Scene = (variant, scale) => (
  <>
    <SmallPhone variant={variant} className="border-paper bg-[#FFD23F]">
      <ShopScreen scale={SHOP_SCALE}>
        <ShopAfter />
      </ShopScreen>
    </SmallPhone>
    {sideNote(variant, scale) && (
      <span className="hand absolute left-5 top-10 w-[110px] -rotate-3 text-pink" style={{ fontSize: noteSize(26, scale) }}>
        Až teď se rozhodujete.
      </span>
    )}
  </>
)

/**
 * The side notes of cards 02 and 03 show only where they fit at 20px or more
 * (cards about 324px wide, screens from ~1100px). Narrower, they would run
 * into the phone, so they go, as on the phone layout.
 */
const sideNote = (variant: Variant, scale: number) => variant === 'desktop' && 26 * scale >= NOTE_MIN_PX

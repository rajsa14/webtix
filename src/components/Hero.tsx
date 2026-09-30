import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import { findItem } from '../data/catalog'
import { fonts } from '../data/fonts'
import { heroShowcase } from '../data/content'
import { SITE } from '../data/site'
import type { ButtonItem, FontItem, LayoutItem, PaletteItem } from '../data/types'
import { nb } from '../lib/text'
import { BrowserFrame } from './BrowserFrame'
import { CtaLink } from './Cta'
import { Scribble } from './Decor'
import { MiniSite } from './previews/MiniSite'
import { EASE } from './Reveal'

export function Hero() {
  return (
    <section id="domu" className="relative overflow-hidden pb-14 pt-24 sm:pt-28 lg:pb-20">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line pb-4 font-mono text-[12px] uppercase tracking-[0.14em] text-muted"
        >
          <span>Webové studio</span>
          <span className="hidden sm:inline">Richard &amp; Daniel</span>
          <span>Weby na míru · {SITE.year}</span>
        </motion.div>

        <div className="mt-10 grid items-end gap-12 sm:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <div>
            <h1 className="font-display text-[clamp(3.6rem,9.4vw,9.6rem)] font-extrabold leading-[0.86] tracking-[-0.065em]">
              <Line delay={0.2}>Web podle</Line>
              <Line delay={0.3}>
                <FontSwapWord />
              </Line>
              <Line delay={0.4}>
                představ<span className="text-accent">.</span>
              </Line>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
              className="mt-10 max-w-[30rem] text-lg leading-relaxed text-muted sm:text-[1.2rem]"
            >
              {nb(
                'Naklikejte si písmo, barvy a styl, který se vám líbí. My z toho postavíme konkrétní návrh webu. Bez briefů a bez šablon.',
              )}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <CtaLink href="#katalog" size="lg" arrow>
                Otevřít katalog
              </CtaLink>
              <CtaLink href="#jak-to-funguje" size="lg" variant="secondary">
                Jak to funguje
              </CtaLink>
            </motion.div>
          </div>

          <HeroShowcase />
        </div>
      </div>
    </section>
  )
}

/**
 * "vašich" in the headline trades its font for the next one from the catalog
 * on every hover or click. A small taste of what the catalog does.
 */
function FontSwapWord() {
  const [index, setIndex] = useState(-1)
  const [touched, setTouched] = useState(false)
  const font = index >= 0 ? fonts[index] : undefined
  const next = () => {
    setTouched(true)
    setIndex((i) => (i + 1) % fonts.length)
  }

  return (
    <span className="relative inline-flex items-baseline gap-4">
      <button
        type="button"
        onPointerEnter={(e) => e.pointerType === 'mouse' && next()}
        onClick={next}
        title="Vyzkoušet jiné písmo"
        className="relative inline-block cursor-pointer rounded-[0.1em] text-left outline-offset-8"
        style={font ? { fontFamily: font.family, fontWeight: font.weight, fontSize: `${(font.scale ?? 1) * 100}%` } : undefined}
      >
        vašich
        <Scribble className="-inset-x-[6%] -inset-y-[14%] h-[128%] w-[112%]" delay={1.1} />
      </button>
      <span className="hidden self-center font-mono text-[12px] font-normal uppercase leading-snug tracking-[0.12em] text-accent sm:inline-block" aria-live="polite">
        {font ? (
          <>
            {font.name}
            <br />
            <span className="text-muted">{index + 1}/{fonts.length}</span>
          </>
        ) : (
          !touched && (
            <span className="inline-block -rotate-6 rounded-full border border-accent px-3 py-1">← zkuste najet</span>
          )
        )}
      </span>
    </span>
  )
}

function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.06em] pt-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

const SLOTS = [
  { x: '0%', y: '0%', scale: 1, rotate: 0, zIndex: 3, opacity: 1, filter: 'saturate(1) opacity(1)' },
  { x: '-9%', y: '-17%', scale: 0.8, rotate: -4, zIndex: 1, opacity: 1, filter: 'saturate(0.6) opacity(0.55)' },
  { x: '10%', y: '-10%', scale: 0.87, rotate: 3.5, zIndex: 2, opacity: 1, filter: 'saturate(0.8) opacity(0.8)' },
]

function HeroShowcase() {
  const reduce = useReducedMotion()
  // order[slot] = showcase index. Slot 0 is the front window.
  const [order, setOrder] = useState([0, 1, 2])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const timer = window.setInterval(() => setOrder(([a, b, c]) => [c, a, b]), 5200)
    return () => window.clearInterval(timer)
  }, [reduce, paused])

  const bringToFront = (index: number) => {
    setOrder((current) => [index, ...current.filter((i) => i !== index)])
  }

  // Gentle pointer parallax, driven by motion values (no React re-renders).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 18 })
  const sy = useSpring(py, { stiffness: 60, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5])
  const rotateX = useTransform(sy, [-0.5, 0.5], [4, -4])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const front = heroShowcase[order[0]]

  return (
    <div
      className="relative mx-auto w-full max-w-[640px] [perspective:1400px] lg:max-w-none"
      onPointerMove={onMove}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false)
        px.set(0)
        py.set(0)
      }}
    >
      <motion.div style={{ rotateX, rotateY }} className="relative aspect-[1/0.84] [transform-style:preserve-3d]">
        {heroShowcase.map((demo, index) => {
          const slot = order.indexOf(index)
          const font = findItem<FontItem>('fonts', demo.font)!
          const palette = findItem<PaletteItem>('palettes', demo.palette)!
          const isFront = slot === 0
          return (
            <motion.div
              key={demo.address}
              role={isFront ? undefined : 'button'}
              tabIndex={isFront ? -1 : 0}
              aria-label={isFront ? undefined : `Zobrazit ukázku ${demo.content.brand}`}
              onClick={() => !isFront && bringToFront(index)}
              onKeyDown={(e) => {
                if (!isFront && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  bringToFront(index)
                }
              }}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={SLOTS[slot]}
              transition={{ duration: 1.1, ease: EASE, delay: 0 }}
              className="absolute left-[5%] top-[17%] w-[90%] outline-offset-4"
              style={{ cursor: isFront ? 'default' : 'pointer' }}
            >
              <BrowserFrame address={demo.address} className="aspect-[16/11]">
                <MiniSite
                  mode="live"
                  eager
                  layout={findItem<LayoutItem>('layouts', demo.layout)!}
                  theme={palette.roles}
                  font={{ family: font.family, weight: font.weight, uppercase: font.uppercase, scale: font.scale }}
                  button={findItem<ButtonItem>('buttons', demo.button)}
                  images={demo.images}
                  content={demo.content}
                />
              </BrowserFrame>
            </motion.div>
          )
        })}
      </motion.div>

      <div className="absolute -bottom-6 left-2 z-10 hidden w-[250px] -rotate-[4deg] sm:block lg:-left-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={front.address}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="rounded-[18px] bg-accent p-4 text-white shadow-[0_24px_50px_-24px_rgb(18_18_16/0.5)]"
          >
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">Sestaveno z katalogu</p>
            <Recipe demo={front} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Recipe({ demo }: { demo: (typeof heroShowcase)[number] }) {
  const font = findItem<FontItem>('fonts', demo.font)!
  const palette = findItem<PaletteItem>('palettes', demo.palette)!
  const layout = findItem<LayoutItem>('layouts', demo.layout)!
  const button = findItem<ButtonItem>('buttons', demo.button)!
  const rows = [
    { label: 'Písmo', value: <span style={{ fontFamily: font.family, fontWeight: font.weight }}>{font.name}</span> },
    {
      label: 'Barvy',
      value: (
        <span className="inline-flex items-center gap-2">
          <span className="flex -space-x-1">
            {palette.colors.map((c) => (
              <span key={c.hex} className="size-3.5 rounded-full ring-2 ring-accent" style={{ background: c.hex }} />
            ))}
          </span>
          {palette.name}
        </span>
      ),
    },
    { label: 'Layout', value: layout.name },
    { label: 'Tlačítka', value: button.name },
  ]
  return (
    <dl className="grid gap-2 text-[13px]">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3">
          <dt className="text-white/70">{row.label}</dt>
          <dd className="text-white">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

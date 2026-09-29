import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useEffect, useState, type PointerEvent } from 'react'
import { findItem } from '../data/catalog'
import { heroShowcase } from '../data/content'
import type { ButtonItem, FontItem, LayoutItem, PaletteItem } from '../data/types'
import { nb } from '../lib/text'
import { BrowserFrame } from './BrowserFrame'
import { CtaLink } from './Cta'
import { LogoMark } from './Logo'
import { MiniSite } from './previews/MiniSite'
import { EASE } from './Reveal'

const HEADLINE = ['Web', 'podle', 'vašich', 'představ.']

export function Hero() {
  return (
    <section id="domu" className="relative flex items-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:min-h-[100dvh] lg:pb-16 lg:pt-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_75%_35%,rgb(79_107_255/0.16),transparent_70%),radial-gradient(40%_35%_at_10%_0%,rgb(79_107_255/0.08),transparent_70%)]"
      />
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
        <div className="max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] py-1.5 pl-2 pr-4 text-[13px] text-muted"
          >
            <span className="grid size-6 place-items-center rounded-full bg-accent/15">
              <LogoMark className="h-2.5 w-auto" />
            </span>
            Kreativní webové studio
          </motion.p>

          <h1 className="text-[clamp(3rem,7.4vw,6.4rem)] font-semibold leading-[0.93] tracking-[-0.045em] [font-stretch:92%]">
            {HEADLINE.map((word, i) => (
              <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-top">
                <motion.span
                  className={i >= 2 ? 'inline-block text-accent-soft' : 'inline-block'}
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.08 }}
                >
                  {word}
                </motion.span>
                {i < HEADLINE.length - 1 && ' '}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
            className="mt-7 max-w-[34rem] text-lg leading-relaxed text-muted sm:text-[1.2rem]"
          >
            {nb(
              'Vyberte si styl, barvy, písmo a další prvky, které se vám líbí. My z vaší představy vytvoříme konkrétní návrh webu.',
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.72 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <CtaLink href="#katalog" size="lg" arrow>
              Prohlédnout katalog
            </CtaLink>
            <CtaLink href="#jak-to-funguje" size="lg" variant="secondary">
              Jak to funguje
            </CtaLink>
          </motion.div>
        </div>

        <HeroShowcase />
      </div>
    </section>
  )
}

const SLOTS = [
  { x: '0%', y: '0%', scale: 1, rotate: 0, zIndex: 3, opacity: 1, filter: 'brightness(1)' },
  { x: '-9%', y: '-17%', scale: 0.8, rotate: -4, zIndex: 1, opacity: 1, filter: 'brightness(0.42)' },
  { x: '10%', y: '-10%', scale: 0.87, rotate: 3.5, zIndex: 2, opacity: 1, filter: 'brightness(0.6)' },
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

      <div className="absolute -bottom-2 left-0 z-10 hidden w-[250px] sm:block lg:-left-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={front.address}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="glass-fallback rounded-[16px] border border-line-strong bg-ink-900/85 p-4 shadow-[0_30px_60px_-25px_rgb(0_0_0/0.9)] backdrop-blur-xl"
          >
            <p className="mb-3 text-[12px] text-muted">Sestaveno z katalogu</p>
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
              <span key={c.hex} className="size-3.5 rounded-full ring-2 ring-ink-900" style={{ background: c.hex }} />
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
          <dt className="text-muted">{row.label}</dt>
          <dd className="text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

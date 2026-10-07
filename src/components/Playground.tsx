import { ArrowRightIcon, DiceFiveIcon, LockSimpleIcon, LockSimpleOpenIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { ButtonItem, FontItem, LayoutItem, PaletteItem, PhotoItem, WebStyleItem } from '../data/types'
import { useCatalog, useT } from '../i18n'
import { cx, nb } from '../lib/text'
import { useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { BrowserFrame } from './BrowserFrame'
import { SectionLabel } from './Decor'
import { MiniSite } from './previews/MiniSite'
import { EASE, Reveal } from './Reveal'

/** Each reel spins through one catalog category. */
const REELS = [
  { key: 'font', category: 'fonts' },
  { key: 'palette', category: 'palettes' },
  { key: 'layout', category: 'layouts' },
  { key: 'button', category: 'buttons' },
  { key: 'photo', category: 'photos' },
  { key: 'style', category: 'webStyles' },
] as const

type ReelKey = (typeof REELS)[number]['key']
type Combo = Record<ReelKey, number> & { brand: number }

const rand = (n: number, not?: number) => {
  if (n < 2) return 0
  let r = Math.floor(Math.random() * n)
  if (r === not) r = (r + 1) % n
  return r
}

const START: Combo = { font: 2, palette: 1, layout: 2, button: 0, photo: 0, style: 0, brand: 0 }

export function Playground() {
  const t = useT()
  const catalog = useCatalog()
  const items = Object.fromEntries(catalog.map((c) => [c.id, c.items])) as Record<(typeof REELS)[number]['category'], unknown[]>
  const size = (reel: (typeof REELS)[number]) => items[reel.category].length
  const brands = t.playground.brands
  const reduce = useReducedMotion()
  const [combo, setCombo] = useState<Combo>(START)
  const [locked, setLocked] = useState<Record<ReelKey, boolean>>({ font: false, palette: false, layout: false, button: false, photo: false, style: false })
  const [spinning, setSpinning] = useState<Record<ReelKey, boolean>>({ font: false, palette: false, layout: false, button: false, photo: false, style: false })
  const [spins, setSpins] = useState(0)
  const timers = useRef<number[]>([])
  const apply = useSelection((s) => s.apply)
  const toast = useUi((s) => s.toast)

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const anySpinning = Object.values(spinning).some(Boolean)
  const allLocked = REELS.every((r) => locked[r.key])

  const spin = () => {
    if (anySpinning || allLocked) return
    setSpins((n) => n + 1)
    setCombo((c) => ({ ...c, brand: rand(brands.length, c.brand) }))
    const open = REELS.filter((r) => !locked[r.key])

    if (reduce) {
      setCombo((c) => {
        const next = { ...c }
        open.forEach((r) => (next[r.key] = rand(size(r), c[r.key])))
        return next
      })
      return
    }

    setSpinning((s) => ({ ...s, ...Object.fromEntries(open.map((r) => [r.key, true])) }))
    // Each reel flickers through items, then stops one after another like a slot machine.
    open.forEach((reel, i) => {
      const stopAt = 520 + i * 170
      for (let t = 0; t < stopAt; t += 75) {
        timers.current.push(window.setTimeout(() => setCombo((c) => ({ ...c, [reel.key]: rand(size(reel), c[reel.key]) })), t))
      }
      timers.current.push(window.setTimeout(() => setSpinning((s) => ({ ...s, [reel.key]: false })), stopAt))
    })
  }

  const font = items.fonts[combo.font] as FontItem
  const palette = items.palettes[combo.palette] as PaletteItem
  const layout = items.layouts[combo.layout] as LayoutItem
  const button = items.buttons[combo.button] as ButtonItem
  const photo = items.photos[combo.photo] as PhotoItem
  const style = items.webStyles[combo.style] as WebStyleItem

  const keep = () => {
    // Fills every catalog step at once, so the whole catalog opens up.
    apply({
      fonts: [font.id],
      palettes: [palette.id],
      photos: [photo.id],
      webStyles: [style.id],
      buttons: [button.id],
      layouts: [layout.id],
    })
    toast(t.playground.kept)
    document.getElementById('poptavka')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  const values: Record<ReelKey, ReactNode> = {
    font: <span style={{ fontFamily: font.family, fontWeight: font.weight }}>{font.name}</span>,
    palette: (
      <span className="inline-flex items-center gap-2">
        <span className="flex -space-x-1.5">
          {palette.colors.map((c) => (
            <span key={c.hex} className="size-4 rounded-full ring-2 ring-ink-900" style={{ background: c.hex }} />
          ))}
        </span>
        {palette.name}
      </span>
    ),
    layout: layout.name,
    button: button.name,
    photo: photo.name,
    style: style.name,
  }

  return (
    <section id="zkuste-si" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-4xl">
            <SectionLabel number="00">{t.playground.label}</SectionLabel>
            <h2 className="display-xl">
              {t.playground.title}
              <span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {nb(t.playground.lead)}
            </p>
          </div>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted" aria-live="polite">
            {t.playground.spins(spins)}
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <Reveal onClick={spin} data-cursor={t.playground.cursor} className="cursor-pointer">
            <BrowserFrame address={`${slug(brands[combo.brand].brand)}${t.playground.tld}`} className="aspect-[16/11]">
              <MiniSite
                mode="live"
                layout={layout}
                theme={palette.roles}
                font={{ family: font.family, weight: font.weight, uppercase: font.uppercase, scale: font.scale }}
                button={button}
                images={[photo.image]}
                radius={Math.max(style.radius, 0.4)}
                effect={style.effect}
                content={brands[combo.brand]}
              />
            </BrowserFrame>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="grid gap-2">
              {REELS.map((reel) => {
                const isLocked = locked[reel.key]
                return (
                  <li key={reel.key}>
                    <button
                      type="button"
                      onClick={() => setLocked((l) => ({ ...l, [reel.key]: !l[reel.key] }))}
                      aria-pressed={isLocked}
                      className={cx(
                        'group flex w-full items-center gap-4 rounded-[16px] border px-4 py-3.5 text-left transition-colors duration-300',
                        isLocked ? 'border-accent bg-accent text-white' : 'border-fg bg-ink-900 hover:bg-ink-850',
                      )}
                    >
                      <span
                        className={cx(
                          'w-20 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em]',
                          isLocked ? 'text-white/70' : 'text-muted',
                        )}
                      >
                        {t.playground.reels[reel.key]}
                      </span>
                      <span className="relative h-7 min-w-0 flex-1 overflow-hidden text-[1.15rem] font-semibold leading-7">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={combo[reel.key]}
                            initial={{ y: '-100%', opacity: 0 }}
                            animate={{ y: '0%', opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ duration: spinning[reel.key] ? 0.08 : 0.35, ease: EASE }}
                            className={cx('absolute inset-x-0 truncate', spinning[reel.key] && 'blur-[1px]')}
                          >
                            {values[reel.key]}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-[12px]">
                        {isLocked ? <LockSimpleIcon size={17} weight="bold" /> : <LockSimpleOpenIcon size={17} className="text-muted group-hover:text-fg" />}
                        <span className="sr-only">{isLocked ? t.playground.locked : t.playground.unlocked}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <motion.button
                type="button"
                onClick={spin}
                disabled={allLocked}
                whileTap={{ scale: 0.94, rotate: -2 }}
                className="inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-full bg-fg px-7 text-[1.05rem] font-semibold text-ink-950 transition-colors hover:bg-accent hover:text-white disabled:opacity-40 sm:flex-none"
              >
                <motion.span animate={anySpinning ? { rotate: 360 } : { rotate: 0 }} transition={anySpinning ? { duration: 0.5, repeat: Infinity, ease: 'linear' } : { duration: 0 }}>
                  <DiceFiveIcon size={22} weight="fill" />
                </motion.span>
                {allLocked ? t.playground.allLocked : t.playground.spin}
              </motion.button>
              <button
                type="button"
                onClick={keep}
                disabled={anySpinning}
                className="group/k inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-fg px-6 font-semibold transition-colors hover:bg-fg hover:text-ink-950 disabled:opacity-40 sm:flex-none"
              >
                {t.playground.keep}
                <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover/k:translate-x-0.5" />
              </button>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              {nb(t.playground.keepNote)}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

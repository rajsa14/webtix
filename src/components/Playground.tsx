import { ArrowRightIcon, DiceFiveIcon, LockSimpleIcon, LockSimpleOpenIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { buttonStyles } from '../data/buttonStyles'
import { colorPalettes } from '../data/colorPalettes'
import { fonts } from '../data/fonts'
import { imageStyles } from '../data/imageStyles'
import { layouts } from '../data/layouts'
import { cx, nb } from '../lib/text'
import { useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { BrowserFrame } from './BrowserFrame'
import { SectionLabel } from './Decor'
import { MiniSite } from './previews/MiniSite'
import { EASE, Reveal } from './Reveal'

/** Made-up businesses the random website is built for. */
const BRANDS = [
  { brand: 'Pekárna Kvásek', heading: 'Chleba, který voní', text: 'Kváskový chléb a rohlíky pečené každé ráno od čtyř.', cta: 'Objednat' },
  { brand: 'Truhlářství Dub', heading: 'Nábytek na celý život', text: 'Stoly, kuchyně a police z masivu přesně na míru.', cta: 'Poptat' },
  { brand: 'Jóga Klid', heading: 'Nadechněte se', text: 'Lekce pro začátečníky i pokročilé v centru města.', cta: 'Rezervovat' },
  { brand: 'Autoservis Piston', heading: 'Auto do druhého dne', text: 'Servis, pneu a STK bez čekání a bez překvapení.', cta: 'Objednat servis' },
  { brand: 'Studio Forma', heading: 'Prostor, co dýchá', text: 'Interiéry, které se dobře fotí a ještě líp žijí.', cta: 'Portfolio' },
  { brand: 'Květinka', heading: 'Kytice do hodiny', text: 'Čerstvé květiny a rozvoz po celém městě.', cta: 'Vybrat kytici' },
]

const REELS = [
  { key: 'font', label: 'Písmo', size: fonts.length },
  { key: 'palette', label: 'Barvy', size: colorPalettes.length },
  { key: 'layout', label: 'Layout', size: layouts.length },
  { key: 'button', label: 'Tlačítka', size: buttonStyles.length },
  { key: 'photo', label: 'Fotky', size: imageStyles.length },
] as const

type ReelKey = (typeof REELS)[number]['key']
type Combo = Record<ReelKey, number> & { brand: number }

const rand = (n: number, not?: number) => {
  if (n < 2) return 0
  let r = Math.floor(Math.random() * n)
  if (r === not) r = (r + 1) % n
  return r
}

const START: Combo = { font: 2, palette: 1, layout: 2, button: 0, photo: 0, brand: 0 }

export function Playground() {
  const reduce = useReducedMotion()
  const [combo, setCombo] = useState<Combo>(START)
  const [locked, setLocked] = useState<Record<ReelKey, boolean>>({ font: false, palette: false, layout: false, button: false, photo: false })
  const [spinning, setSpinning] = useState<Record<ReelKey, boolean>>({ font: false, palette: false, layout: false, button: false, photo: false })
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
    setCombo((c) => ({ ...c, brand: rand(BRANDS.length, c.brand) }))
    const open = REELS.filter((r) => !locked[r.key])

    if (reduce) {
      setCombo((c) => {
        const next = { ...c }
        open.forEach((r) => (next[r.key] = rand(r.size, c[r.key])))
        return next
      })
      return
    }

    setSpinning((s) => ({ ...s, ...Object.fromEntries(open.map((r) => [r.key, true])) }))
    // Each reel flickers through items, then stops one after another like a slot machine.
    open.forEach((reel, i) => {
      const stopAt = 520 + i * 170
      for (let t = 0; t < stopAt; t += 75) {
        timers.current.push(window.setTimeout(() => setCombo((c) => ({ ...c, [reel.key]: rand(reel.size, c[reel.key]) })), t))
      }
      timers.current.push(window.setTimeout(() => setSpinning((s) => ({ ...s, [reel.key]: false })), stopAt))
    })
  }

  const font = fonts[combo.font]
  const palette = colorPalettes[combo.palette]
  const layout = layouts[combo.layout]
  const button = buttonStyles[combo.button]
  const photo = imageStyles[combo.photo]

  const keep = () => {
    apply({ fonts: [font.id], palettes: [palette.id], layouts: [layout.id], buttons: [button.id], photos: [photo.id] })
    toast('Kombinace je ve vašem výběru. Doplňte zbytek ve formuláři.')
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
  }

  return (
    <section id="zkuste-si" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-4xl">
            <SectionLabel number="00">Na zkoušku</SectionLabel>
            <h2 className="display-xl">
              Zamíchejte si web<span className="text-accent">.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {nb('Zatočte a uvidíte, jak by mohl vypadat. Co se vám líbí, zamkněte kliknutím, a točte dál.')}
            </p>
          </div>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted" aria-live="polite">
            Zamícháno {spins}×
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
          <Reveal onClick={spin} data-cursor="Zamíchat" className="cursor-pointer">
            <BrowserFrame address={`${slug(BRANDS[combo.brand].brand)}.cz`} className="aspect-[16/11]">
              <MiniSite
                mode="live"
                layout={layout}
                theme={palette.roles}
                font={{ family: font.family, weight: font.weight, uppercase: font.uppercase, scale: font.scale }}
                button={button}
                images={[photo.image]}
                content={BRANDS[combo.brand]}
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
                        {reel.label}
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
                        <span className="sr-only">{isLocked ? 'zamčeno' : 'odemčeno'}</span>
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
                {allLocked ? 'Vše zamčeno' : 'Zamíchat'}
              </motion.button>
              <button
                type="button"
                onClick={keep}
                disabled={anySpinning}
                className="group/k inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full border border-fg px-6 font-semibold transition-colors hover:bg-fg hover:text-ink-950 disabled:opacity-40 sm:flex-none"
              >
                Chci tenhle
                <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover/k:translate-x-0.5" />
              </button>
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              {nb('„Chci tenhle“ přenese kombinaci do vašeho výběru. Zbytek doladíte v katalogu.')}
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

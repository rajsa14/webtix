import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { NAV_LINKS, PAGES } from '../data/site'
import { cx } from '../lib/text'

/** Where a link leads, by its address. */
const PAGE_NAMES: Record<string, string> = {
  ...Object.fromEntries(NAV_LINKS.map((link) => [link.href, link.label])),
  [PAGES.privacy]: 'Ochrana údajů',
  [PAGES.terms]: 'Podmínky',
}

/**
 * What the thing under the mouse does, in a word or two. An element can name
 * itself with data-cursor="…"; everything else is described by its kind.
 */
function describe(el: Element | null) {
  const tagged = el?.closest<HTMLElement>('[data-cursor]')
  if (tagged) return tagged.dataset.cursor ?? ''
  const link = el?.closest('a')
  if (link) {
    const href = link.getAttribute('href') ?? ''
    if (href.startsWith('mailto:')) return 'Napsat e-mail'
    if (link.target === '_blank') return 'Otevřít v novém okně'
    if (href.startsWith('#')) return 'Posunout'
    const page = PAGE_NAMES[href.split('#')[0]]
    return page ? `→ ${page}` : 'Přejít'
  }
  if (el?.closest('input, textarea')) return 'Psát'
  if (el?.closest('label, select')) return 'Vybrat'
  if (el?.closest('summary')) return 'Rozbalit'
  if (el?.closest('button, [role="button"]')) return 'Kliknout'
  return ''
}

/**
 * A small ring that trails the mouse, with a tag saying what is under it. The
 * system cursor stays visible, so nothing is lost when this is off: touch
 * devices and reduced motion never render it.
 */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 })

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (hover: hover)')
    const update = () => setEnabled(mq.matches && !reduce)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      setLabel(describe(e.target as Element | null))
    }
    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => setVisible(false)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
      className="pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <motion.div
        animate={{ scale: down ? 0.7 : label ? 1.25 : 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={cx(
          'size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-accent',
          label && 'bg-accent/10',
        )}
      />
      {/* The tag sits below and to the right, so it never covers what you are pointing at. */}
      <AnimatePresence mode="wait">
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 top-4 whitespace-nowrap rounded-full bg-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-950"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

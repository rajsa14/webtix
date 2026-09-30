import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { cx } from '../lib/text'

type Mode = 'default' | 'link' | 'card' | 'text'

/**
 * A ring that trails the mouse and reacts to what it is over. The system
 * cursor stays visible, so nothing is lost when this is off: touch devices
 * and reduced motion never render it.
 */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [mode, setMode] = useState<Mode>('default')
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
      const el = e.target as Element | null
      const tagged = el?.closest<HTMLElement>('[data-cursor]')
      if (tagged) {
        setMode('card')
        setLabel(tagged.dataset.cursor ?? '')
      } else if (el?.closest('a, button, [role="button"], label, select, summary')) {
        setMode('link')
        setLabel('')
      } else if (el?.closest('input, textarea')) {
        setMode('text')
        setLabel('')
      } else {
        setMode('default')
        setLabel('')
      }
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

  const size = mode === 'card' ? 84 : mode === 'link' ? 52 : mode === 'text' ? 6 : 30
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <motion.div
        animate={{ width: size, height: size, scale: down ? 0.8 : 1, opacity: visible ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={cx(
          'grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full',
          mode === 'card' ? 'bg-accent text-white' : 'border-[1.5px] border-accent',
          mode === 'link' && 'bg-accent/10',
        )}
      >
        {mode === 'card' && <span className="font-mono text-[11px] uppercase tracking-[0.1em]">{label}</span>}
      </motion.div>
    </motion.div>
  )
}

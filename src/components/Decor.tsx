import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef, useState } from 'react'
import { cx } from '../lib/text'
import { EASE } from './Reveal'

const SCRIBBLES = {
  // A loose hand-drawn loop, drawn around a word.
  circle: {
    viewBox: '0 0 220 80',
    d: 'M14 46C10 24 60 8 118 8c52 0 94 12 94 32 0 22-54 34-110 32C48 70 10 60 12 42 14 28 44 16 86 13',
  },
  // A quick underline with a flick at the end.
  underline: {
    viewBox: '0 0 220 24',
    d: 'M4 16c40-8 96-11 150-9 22 1 42 3 60 6-18-1-30 1-40 5',
  },
} as const

/** Hand-drawn accent stroke that draws itself when it scrolls into view. */
export function Scribble({
  variant = 'circle',
  className,
  delay = 0.6,
}: {
  variant?: keyof typeof SCRIBBLES
  className?: string
  delay?: number
}) {
  const s = SCRIBBLES[variant]
  return (
    <svg
      viewBox={s.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cx('pointer-events-none absolute overflow-visible text-accent', className)}
    >
      <motion.path
        d={s.d}
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.1, ease: EASE, delay }}
      />
    </svg>
  )
}

/**
 * Full-bleed strip of words scrolling sideways. Scrolling the page speeds it
 * up and flips its direction. Decorative, hidden from screen readers.
 */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1500, 0, 1500], [-5, 0, 5], { clamp: false })
  const direction = useRef(-1)
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const b = boost.get()
    if (b < 0) direction.current = 1
    else if (b > 0) direction.current = -1
    // 2.2 % of the strip per second at rest, much faster while scrolling.
    base.set(base.get() + direction.current * 2.2 * (delta / 1000) * (1 + Math.abs(b)))
  })

  const row = [...items, ...items]
  return (
    <div aria-hidden="true" className={cx('overflow-hidden whitespace-nowrap', className)}>
      <motion.div style={{ x }} className="flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {row.map((item, i) => (
              <span key={`${copy}-${i}`} className="inline-flex items-center">
                <span className="px-6 sm:px-9">{item}</span>
                <span className="text-accent">✺</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/**
 * Big wordmark whose letters jump and tilt when the mouse passes over them.
 * Clicking a letter paints it blue.
 */
export function PlayfulWord({ text, className }: { text: string; className?: string }) {
  const [painted, setPainted] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setPainted((p) => {
      const n = new Set(p)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  return (
    <p aria-label={text} className={cx('select-none', className)}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          onClick={() => toggle(i)}
          whileHover={{ y: '-0.12em', rotate: i % 2 ? 6 : -6 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          className={cx('inline-block cursor-pointer transition-colors duration-300', painted.has(i) || ch === '.' ? 'text-accent' : '')}
        >
          {ch}
        </motion.span>
      ))}
    </p>
  )
}

/** Small uppercase label that opens a section, with its running number. */
export function SectionLabel({ number, children, className }: { number: string; children: string; className?: string }) {
  return (
    <p className={cx('mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted', className)}>
      <span className="text-accent">{number}</span>
      <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
      {children}
    </p>
  )
}

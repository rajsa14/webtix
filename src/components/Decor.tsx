import { motion } from 'motion/react'
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

/** Full-bleed strip of words scrolling sideways. Decorative, hidden from screen readers. */
export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = [...items, ...items]
  return (
    <div aria-hidden="true" className={cx('overflow-hidden whitespace-nowrap', className)}>
      <div className="marquee-track flex w-max">
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
      </div>
    </div>
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

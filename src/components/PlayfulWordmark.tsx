import { useState } from 'react'
import { WORDMARK_LETTERS, WORDMARK_VIEWBOX } from '../data/wordmarkLetters'
import { cx } from '../lib/text'

/**
 * The big footer wordmark: the real logo (letters split from the brand SVG,
 * never redrawn). Each letter jumps and tilts when the pointer passes over
 * it; clicking or tapping a letter paints it pink, and again turns it back.
 * The motion is CSS (index.css, .wm-letter), so reduced motion stills it.
 */
export function PlayfulWordmark({ className }: { className?: string }) {
  const [painted, setPainted] = useState<Set<number>>(() => new Set())
  const toggle = (i: number) =>
    setPainted((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  return (
    <svg viewBox={WORDMARK_VIEWBOX} role="img" aria-label="webtix" className={cx('block h-auto w-full overflow-visible', className)}>
      {WORDMARK_LETTERS.map((d, i) => (
        <path
          key={i}
          d={d}
          onClick={() => toggle(i)}
          className={cx('wm-letter', i % 2 ? 'wm-odd' : 'wm-even', painted.has(i) && 'wm-painted')}
        />
      ))}
    </svg>
  )
}

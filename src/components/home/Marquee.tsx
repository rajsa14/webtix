import { useEffect, useRef } from 'react'
import { previewDaysGenitive, priceText } from '../../data/site'
import { cx } from '../../lib/text'

/*
 * Two tilted bands crossing like strips of tape, each scrolling a line of
 * what we promise. They drift on their own, speed up while the page scrolls
 * and run backwards when it scrolls up. Decorative (aria-hidden): every fact
 * here is also said elsewhere on the page. Reduced motion: still bands.
 */

const items = () => ['Návrh zdarma', `Do ${previewDaysGenitive()}`, `Web od ${priceText()}`, 'Mluvíte přímo s námi', 'Návrh uvidíte dřív, než zaplatíte']

function Star({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cx('size-[0.7em] shrink-0', className)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
    </svg>
  )
}

function Band({ tone, reverse, className }: { tone: 'terracotta' | 'ink'; reverse?: boolean; className?: string }) {
  const line = items()
  const run = (
    <span className="flex shrink-0 items-center gap-8 pr-8 lg:gap-12 lg:pr-12">
      {[...line, ...line].map((text, i) => (
        <span key={i} className="flex items-center gap-8 lg:gap-12">
          <span className="whitespace-nowrap">{text}</span>
          <Star className={tone === 'terracotta' ? 'text-ink' : 'text-pink'} />
        </span>
      ))}
    </span>
  )
  return (
    <div
      className={cx(
        'absolute -left-[10vw] top-1/2 w-[120vw] -translate-y-1/2 py-4 text-[26px] font-bold tracking-[-0.02em] lg:py-5 lg:text-[44px]',
        tone === 'terracotta' ? 'bg-terracotta text-cream' : 'bg-ink text-paper',
        className,
      )}
    >
      <div className={cx('marquee-track flex w-max', reverse && 'marquee-reverse')}>
        {run}
        {run}
      </div>
    </div>
  )
}

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)

  // Scroll speed drives the bands: faster while scrolling, backwards when scrolling up.
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animations = () => Array.from(el.querySelectorAll<HTMLElement>('.marquee-track')).flatMap((t) => t.getAnimations())
    let last = window.scrollY
    let rate = 1
    let raf = 0
    let visible = false
    const tick = () => {
      const y = window.scrollY
      const v = y - last
      last = y
      const target = v === 0 ? Math.sign(rate) || 1 : Math.sign(v) * (1 + Math.min(6, Math.abs(v) / 6))
      rate += (target - rate) * 0.08
      for (const a of animations()) a.playbackRate = rate
      if (visible) raf = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(raf)
      if (visible) {
        last = window.scrollY
        raf = requestAnimationFrame(tick)
      }
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="relative h-[190px] overflow-clip lg:h-[300px]">
      <Band tone="terracotta" className="-rotate-[4deg]" />
      <Band tone="ink" reverse className="rotate-[3deg]" />
    </div>
  )
}

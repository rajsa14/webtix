import { useEffect, useState, type RefObject } from 'react'

/*
 * Subtle entrance animations. Mark an element with `data-reveal` (optionally
 * style={{ '--reveal-delay': '120ms' }} to stagger a group); it fades and
 * rises in the first time it scrolls into view. The hiding CSS only applies
 * once `html.reveal-on` is set here and the visitor allows motion, so without
 * JavaScript, or with reduced motion, everything is simply visible.
 */

const motionOk = () => typeof window !== 'undefined' && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Reveal every `[data-reveal]` on the page as it scrolls in. Run again when the page (`key`) changes. */
export function useRevealAll(key: string) {
  useEffect(() => {
    if (!motionOk()) return
    document.documentElement.classList.add('reveal-on')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
    )
    document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])
}

/** True once the element has been at least `threshold` on screen (stays true). With reduced motion: true at once. */
export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.4) {
  const [seen, setSeen] = useState(() => !motionOk())
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        observer.disconnect()
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, seen, threshold])
  return seen
}

/** `style` for a staggered `data-reveal` element: the i-th item waits i × step ms. */
export const revealDelay = (i: number, step = 110) => ({ ['--reveal-delay' as string]: `${i * step}ms` })

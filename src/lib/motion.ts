import { useEffect, useState, type RefObject } from 'react'

/*
 * Entrance animations. Mark an element with `data-reveal` (optionally
 * style={{ '--reveal-delay': '120ms' }} to stagger a group); it fades and
 * slides in every time it scrolls into view, and resets once it has left the
 * screen, coming back from the side it left through. The hiding CSS only
 * applies once `html.reveal-on` is set here and the visitor allows motion, so
 * without JavaScript, or with reduced motion, everything is simply visible.
 */

const motionOk = () => typeof window !== 'undefined' && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Reveal every `[data-reveal]` on the page as it scrolls in, again and again. Run again when the page (`key`) changes. */
export function useRevealAll(key: string) {
  useEffect(() => {
    if (!motionOk()) return
    document.documentElement.classList.add('reveal-on')
    const show = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) entry.target.setAttribute('data-revealed', '')
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    // Reset only once the element is fully off screen, so it never flickers at the edge.
    const reset = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) continue
        entry.target.removeAttribute('data-revealed')
        entry.target.setAttribute('data-from', entry.boundingClientRect.top < 0 ? 'above' : 'below')
      }
    })
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      show.observe(el)
      reset.observe(el)
    })
    return () => {
      show.disconnect()
      reset.disconnect()
    }
  }, [key])
}

/**
 * Whether the element is on screen now (at least `threshold` of it), for
 * animations that replay on every visit. With reduced motion: always true.
 */
export function useInView(ref: RefObject<Element | null>, threshold = 0.4) {
  const [inView, setInView] = useState(() => !motionOk())
  useEffect(() => {
    const el = ref.current
    if (!el || !motionOk()) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold])
  return inView
}

/** `style` for a staggered `data-reveal` element: the i-th item waits i × step ms. */
export const revealDelay = (i: number, step = 110) => ({ ['--reveal-delay' as string]: `${i * step}ms` })

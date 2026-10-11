import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react'

/*
 * Entrance animations. Mark an element with `data-reveal` (optionally
 * style={{ '--reveal-delay': '120ms' }} to stagger a group); it fades and
 * slides in every time it scrolls into view, and resets once it has left the
 * screen, coming back from the side it left through. The hiding CSS only
 * applies once `html.reveal-on` is set here and the visitor allows motion, so
 * without JavaScript, or with reduced motion, everything is simply visible.
 */

const REDUCE = '(prefers-reduced-motion: reduce)'
const motionOk = () => typeof window !== 'undefined' && 'IntersectionObserver' in window && !window.matchMedia(REDUCE).matches

const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCE)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

/**
 * Whether animations may run. The pre-rendered HTML (and the first render in
 * the browser, which must match it) says no, so the page is built in its final
 * state: the whole chat, the real price. Animations take over right after.
 */
export function useMotionOk() {
  return useSyncExternalStore(subscribeMotion, motionOk, () => false)
}

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
  const ok = useMotionOk()
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !ok) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, threshold, ok])
  return !ok || inView
}

/** `style` for a staggered `data-reveal` element: the i-th item waits i × step ms. */
export const revealDelay = (i: number, step = 110) => ({ ['--reveal-delay' as string]: `${i * step}ms` })

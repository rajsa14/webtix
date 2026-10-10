import Lenis from 'lenis'

/*
 * Smooth scrolling with Lenis: the wheel and trackpad glide instead of
 * jumping, and in-page links (the menu) ease to their section. Only for a
 * mouse or trackpad and when the visitor allows motion; touch devices keep
 * their native scrolling, which already feels right. Scroll positions stay
 * native, so IntersectionObserver, focus and the keyboard work as before.
 */

let lenis: Lenis | null = null
let raf = 0

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

export function startSmoothScroll() {
  if (lenis || reduced() || !fine()) return () => {}
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true })
  const loop = (time: number) => {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

/** Ease to an element (or the top). Falls back to native scrolling without Lenis. */
export function scrollToTarget(target: HTMLElement | null) {
  if (lenis) {
    lenis.scrollTo(target ?? 0, { duration: 1.2, easing: (t) => 1 - (1 - t) ** 4 })
    return
  }
  const behavior = reduced() ? 'instant' : 'smooth'
  if (target) target.scrollIntoView({ behavior })
  else window.scrollTo({ top: 0, behavior })
}

/** Pause smooth scrolling while something (a dialog) locks the page. */
export function setSmoothScrollPaused(paused: boolean) {
  if (paused) lenis?.stop()
  else lenis?.start()
}

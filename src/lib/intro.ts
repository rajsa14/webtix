/**
 * The intro curtain plays once per browser session, never with reduced motion.
 * Decided once at load, so the hero can delay its entrance by INTRO_DELAY.
 */
function shouldPlay() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (window.sessionStorage.getItem('webtix-intro')) return false
    window.sessionStorage.setItem('webtix-intro', '1')
    return true
  } catch {
    // Storage blocked: skip the intro rather than replay it on every visit.
    return false
  }
}

export const INTRO_PLAYS = shouldPlay()

/** Seconds the curtain stays down before it lifts. */
export const INTRO_HOLD = 1.05

/** Extra delay for entrance animations that would otherwise run under the curtain. */
export const INTRO_DELAY = INTRO_PLAYS ? INTRO_HOLD + 0.35 : 0

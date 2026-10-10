import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/*
 * The hero scene: one progress value p (0 to 1) drives everything, from the
 * old Šlapadlo site with red-pen notes (0) to the new one with cream notes (1).
 *
 * p plays like a short video: once the scene is at least half on screen it
 * runs from 0 to 1 over PLAY_MS. A small button pauses, resumes and replays it.
 * Each animation frame writes transform, opacity and clip-path straight to the
 * DOM, without React renders and without reading layout.
 * With reduced motion nothing moves: the button switches between 0 and 1.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** 0 before a, 1 after b, linear in between. */
export const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))

/** Smooth start and stop between two points. */
const ease = (t: number) => t * t * (3 - 2 * t)

/** Value through [p, value] points, eased between them, held flat outside them. */
export function track(p: number, points: [number, number][]) {
  if (p <= points[0][0]) return points[0][1]
  for (let i = 1; i < points.length; i++) {
    const [p0, v0] = points[i - 1]
    const [p1, v1] = points[i]
    if (p <= p1) return v0 + (v1 - v0) * ease((p - p0) / (p1 - p0))
  }
  return points[points.length - 1][1]
}

/* ---------- reduced motion ---------- */

const REDUCE = '(prefers-reduced-motion: reduce)'
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => false,
  )
}

/* ---------- group scale ---------- */

/** Scale of a group drawn at a fixed size so it fits the measured box, and the box height. */
export function useGroupScale(base: { width: number; height?: number }, [min, max]: [number, number] = [0, 1]) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ scale: 1, boxHeight: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const fit = Math.min(el.clientWidth / base.width, base.height ? el.clientHeight / base.height : Infinity)
      const scale = Math.min(max, Math.max(min, fit))
      const boxHeight = el.clientHeight
      setState((s) => (s.scale === scale && s.boxHeight === boxHeight ? s : { scale, boxHeight }))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [base.width, base.height, min, max])
  return [ref, state.scale, state.boxHeight] as const
}

/* ---------- playback ---------- */

/** One run from the old site to the new one. */
export const PLAY_MS = 7000
/** Wait after the scene appears, so the red-pen notes have drawn in first. */
const START_DELAY_MS = 1400
/** Replay: wind back to the old site, wait a moment, play again. */
const REWIND_MS = 900
const REWIND_PAUSE_MS = 500

export type PlayState = 'waiting' | 'playing' | 'paused' | 'done'
type Phase = 'play' | 'rewind' | 'hold'

/* ---------- painting ---------- */

type Styled = Element & ElementCSSInlineStyle

/** The animated parts of one scene, found by their data attributes. */
export type SceneNodes = {
  texts: Map<string, HTMLElement>
  forms: Map<string, HTMLElement>
  notes: Map<string, Styled[]>
  fill: Styled | null
  line: Styled | null
  after: Styled | null
  band: Styled | null
  phone: HTMLElement | null
  nav: HTMLElement | null
}

export function collectNodes(root: HTMLElement): SceneNodes {
  const byKey = (attr: string) => {
    const map = new Map<string, HTMLElement>()
    root.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => map.set(el.getAttribute(attr) ?? '', el))
    return map
  }
  const notes = new Map<string, Styled[]>()
  root.querySelectorAll<HTMLElement | SVGElement>('[data-note]').forEach((el) => {
    const key = el.getAttribute('data-note') ?? ''
    notes.set(key, [...(notes.get(key) ?? []), el])
  })
  const one = (attr: string) => root.querySelector<HTMLElement>(`[${attr}]`)
  return {
    texts: byKey('data-text'),
    forms: byKey('data-form'),
    notes,
    fill: one('data-fill'),
    line: one('data-line'),
    after: one('data-after'),
    band: one('data-band'),
    phone: one('data-phone'),
    nav: one('data-nav'),
  }
}

/** Everything one moment of the scene needs. Lengths are in the group's own (unscaled) units. */
export type Frame = {
  /** The dashed line across the panel; terracotta above it, pink below. */
  y: number
  /** The phone screen: its top in group units, its height, and the cream band's height. */
  screen: { top: number; height: number; band: number }
  notes: Record<string, number>
  texts?: Record<string, number>
  /** The one hero form that is reachable now. */
  form?: string
  /** True when the panel behind the nav is terracotta. */
  dark?: boolean
  /** The phone shows the new site. */
  isNew: boolean
}

/** Group height of the terracotta layer and the dashed line's svg (see the markup). */
export const FILL_HEIGHT = 4000
export const LINE_HEIGHT = 6

// Percentages of the element's own size, so the values are the same at any zoom.
const ty = (v: number, size: number) => `translateY(${((v / size) * 100).toFixed(4)}%)`

export const PHONE_LABEL = {
  old: 'Ukázka: starý web vymyšleného servisu kol Šlapadlo',
  new: 'Ukázka: nový web vymyšleného servisu kol Šlapadlo',
}

export function paintScene(n: SceneNodes, f: Frame) {
  if (n.fill) n.fill.style.transform = ty(f.y, FILL_HEIGHT)
  if (n.line) n.line.style.transform = ty(f.y, LINE_HEIGHT)

  const { top, height, band } = f.screen
  const s = Math.min(height, Math.max(0, f.y - top))
  if (n.after) n.after.style.clipPath = `inset(0 0 ${(100 - (s / height) * 100).toFixed(4)}% 0)`
  if (n.band) {
    n.band.style.transform = ty(s, band)
    n.band.style.opacity = s > 0 && s < height ? '1' : '0'
  }

  for (const [key, els] of n.notes) {
    const o = String(f.notes[key] ?? 0)
    for (const el of els) el.style.opacity = o
  }
  for (const [key, el] of n.texts) {
    const o = f.texts?.[key] ?? 0
    el.style.opacity = String(o)
    el.style.pointerEvents = o < 0.5 ? 'none' : ''
  }
  for (const [key, el] of n.forms) el.inert = key !== f.form

  if (n.nav) n.nav.toggleAttribute('data-dark', !!f.dark)
  if (n.phone) {
    const label = f.isNew ? PHONE_LABEL.new : PHONE_LABEL.old
    if (n.phone.getAttribute('aria-label') !== label) n.phone.setAttribute('aria-label', label)
  }
}

/**
 * A whole scene: `rootRef` goes on the element holding its animated parts.
 * It plays p from 0 to 1 when at least half of it is on screen (and pauses
 * while it is off screen), repaints after every render so React never leaves
 * stale values behind, and returns the state and the action of the control
 * button. With `reduced`, nothing animates: `toggle` jumps between 0 and 1.
 */
export function useScene(frame: (p: number) => Frame, reduced: boolean) {
  const rootRef = useRef<HTMLDivElement>(null)
  const nodes = useRef<SceneNodes | null>(null)
  const pRef = useRef(0)
  const frameRef = useRef(frame)
  const phase = useRef<Phase>('play')
  const holdUntil = useRef(0)
  const visible = useRef(false)
  const [state, setState] = useState<PlayState>(reduced ? 'paused' : 'waiting')
  const stateRef = useRef(state)

  useLayoutEffect(() => {
    frameRef.current = frame
    stateRef.current = state
    if (!rootRef.current) return
    nodes.current = collectNodes(rootRef.current)
    paintScene(nodes.current, frame(pRef.current))
  })

  const paint = useCallback((p: number) => {
    pRef.current = p
    if (nodes.current) paintScene(nodes.current, frameRef.current(p))
  }, [])

  // Start once at least half the scene is on screen; keep track of visibility.
  useEffect(() => {
    const el = rootRef.current
    if (!el || reduced) return
    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        if (entry.isIntersecting && stateRef.current === 'waiting' && !timer) {
          timer = window.setTimeout(() => setState((s) => (s === 'waiting' ? 'playing' : s)), START_DELAY_MS)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [reduced])

  // The animation loop: runs only while playing and on screen.
  useEffect(() => {
    if (state !== 'playing' || reduced) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100)
      last = now
      if (visible.current) {
        if (phase.current === 'rewind') {
          const p = pRef.current - dt / REWIND_MS
          if (p <= 0) {
            paint(0)
            phase.current = 'hold'
            holdUntil.current = now + REWIND_PAUSE_MS
          } else paint(p)
        } else if (phase.current === 'hold') {
          if (now >= holdUntil.current) phase.current = 'play'
        } else {
          const p = pRef.current + dt / PLAY_MS
          if (p >= 1) {
            paint(1)
            setState('done')
            return
          }
          paint(p)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [state, reduced, paint])

  /** Pause, resume, replay; with reduced motion, switch old ↔ new at once. */
  const toggle = useCallback(() => {
    if (reduced) {
      const next = pRef.current < 0.5 ? 1 : 0
      paint(next)
      setState(next === 1 ? 'done' : 'paused')
      return
    }
    setState((s) => {
      if (s === 'playing' || s === 'waiting') return 'paused'
      if (s === 'done') phase.current = 'rewind'
      return 'playing'
    })
  }, [reduced, paint])

  return { rootRef, state, toggle }
}

/* ---------- timelines ---------- */

/** Notes fade in or out one after another: note i of `keys` uses the window shifted by i × step. */
function stagger(keys: string[], p: number, from: number, to: number, step: number, out: boolean) {
  const result: Record<string, number> = {}
  keys.forEach((key, i) => {
    const v = ramp(p, from + i * step, to + i * step)
    result[key] = out ? 1 - v : v
  })
  return result
}

/**
 * Desktop, in the 720 × 900 panel group of the design.
 *   0    – 0.18  state 1 (S1Pred), as it was drawn
 *   0.18 – 0.30  red-pen notes vanish one by one, text 1 fades out
 *   0.28 – 0.45  dashed line comes down to 436, text 2 fades in
 *   0.45 – 0.55  state 2 (S2Siti) held, its two notes shown
 *   0.55 – 0.74  line goes on down and out, text 3 fades in
 *   0.80 – 0.96  cream notes appear one by one, state 3 (S3Po)
 */
export function desktopFrame(p: number, ctx: { scale: number; groupTop: number; allNotes: boolean }): Frame {
  // Past the panel's edge (in group units), so the line starts and ends out of sight.
  const pad = ctx.groupTop / ctx.scale + 12
  const y = track(p, [
    [0.28, -pad],
    [0.45, 436],
    [0.55, 436],
    [0.74, 900 + pad],
  ])
  const before = ctx.allNotes ? ['a0', 'a1', 'a2', 'a3'] : ['a0', 'a2']
  const after = ctx.allNotes ? ['c0', 'c1', 'c2', 'c3'] : ['c2', 'c3']
  return {
    y,
    // The design draws the phone's band at screen y 326 when the panel line is at 436.
    screen: { top: 110, height: 720, band: 16 },
    notes: {
      ...stagger(before, p, 0.18, 0.22, 0.025, true),
      b0: Math.min(ramp(p, 0.42, 0.46), 1 - ramp(p, 0.56, 0.6)),
      b1: Math.min(ramp(p, 0.44, 0.48), 1 - ramp(p, 0.54, 0.58)),
      ...stagger(after, p, 0.8, 0.84, 0.04, false),
    },
    texts: {
      1: 1 - ramp(p, 0.24, 0.3),
      2: Math.min(ramp(p, 0.28, 0.34), 1 - ramp(p, 0.68, 0.74)),
      3: ramp(p, 0.72, 0.78),
    },
    form: p < 0.5 ? '1' : '3',
    // The nav links sit around y 44 of the panel.
    dark: ctx.groupTop + y * ctx.scale > 52,
    isNew: p >= 0.5,
  }
}

/** Phone, in the 390 × 520 pink block of S1Mobile: the two notes go, then the same wipe. */
export function phoneFrame(p: number, ctx: { pad: number }): Frame {
  const y = track(p, [
    [0.2, -ctx.pad],
    [0.45, 258],
    [0.6, 258],
    [0.85, 520 + ctx.pad],
  ])
  return {
    y,
    screen: { top: 35, height: 446, band: 10 },
    notes: stagger(['m0', 'm1'], p, 0.1, 0.15, 0.05, true),
    isNew: p >= 0.5,
  }
}

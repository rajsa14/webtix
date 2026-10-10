import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

/*
 * The hero scroll scene: one progress value p (0 to 1) drives everything.
 *
 * p comes from native scroll: the scene is a tall section with a sticky inner
 * box, and p is how far the page has scrolled through it. A passive scroll
 * listener schedules one requestAnimationFrame; the frame reads only
 * window.scrollY (sizes are measured on resize, never in the loop) and writes
 * transform, opacity and clip-path straight to the DOM, without React renders.
 * Scrolling back gives the same p, so everything reverses exactly.
 */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** 0 before a, 1 after b, linear in between. */
export const ramp = (p: number, a: number, b: number) => clamp01((p - a) / (b - a))

/** Piecewise linear value through [p, value] points, held flat outside them. */
export function track(p: number, points: [number, number][]) {
  if (p <= points[0][0]) return points[0][1]
  for (let i = 1; i < points.length; i++) {
    const [p0, v0] = points[i - 1]
    const [p1, v1] = points[i]
    if (p <= p1) return v0 + (v1 - v0) * ((p - p0) / (p1 - p0))
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

/* ---------- scroll progress ---------- */

export type SceneMeasure = { start: number; range: number; stickyTop: number }

/**
 * Progress through a pinned section. Put `sectionRef` on the tall section and
 * `stickyRef` on its sticky child. `onFrame` runs once per animation frame
 * while scrolling, and again whenever the layout is measured.
 */
export function useScrollScene(onFrame: (p: number, m: SceneMeasure) => void, enabled: boolean) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(onFrame)
  const measureRef = useRef<SceneMeasure>({ start: 0, range: 0, stickyTop: 0 })
  const pRef = useRef(0)

  useLayoutEffect(() => {
    frameRef.current = onFrame
  })

  useLayoutEffect(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!enabled || !section || !sticky) return
    let raf = 0
    const tick = () => {
      raf = 0
      const m = measureRef.current
      // A range of 0 means the scene is hidden (the other breakpoint's layout).
      if (m.range <= 0) return
      pRef.current = clamp01((window.scrollY - m.start) / m.range)
      frameRef.current(pRef.current, m)
    }
    const measure = () => {
      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0
      measureRef.current = {
        start: section.getBoundingClientRect().top + window.scrollY - stickyTop,
        range: section.offsetHeight - sticky.offsetHeight,
        stickyTop,
      }
      tick()
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(section)
    observer.observe(sticky)
    observer.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  /** Jump (no smooth scroll) to the scroll position of progress p. */
  const scrollToProgress = useCallback((p: number) => {
    const { start, range } = measureRef.current
    if (range > 0) window.scrollTo({ top: start + p * range, behavior: 'instant' })
  }, [])

  return { sectionRef, stickyRef, pRef, measureRef, scrollToProgress }
}

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
 * Live, it follows the scroll through `sectionRef`/`stickyRef`; otherwise it
 * shows the fixed progress `fixed`. It repaints after every render, so React
 * never leaves stale values behind.
 */
export function useScene(fixed: number | undefined, frame: (p: number, m: SceneMeasure) => Frame) {
  const live = fixed === undefined
  const rootRef = useRef<HTMLDivElement>(null)
  const nodes = useRef<SceneNodes | null>(null)
  const scene = useScrollScene((p, m) => {
    if (nodes.current) paintScene(nodes.current, frame(p, m))
  }, live)
  const { pRef, measureRef } = scene
  useLayoutEffect(() => {
    if (!rootRef.current) return
    nodes.current = collectNodes(rootRef.current)
    paintScene(nodes.current, frame(fixed ?? pRef.current, measureRef.current))
  })
  return { ...scene, rootRef }
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

import { useEffect, useRef, useState } from 'react'

/*
 * Custom cursor: a small dot that sits exactly on the pointer and a ring that
 * follows it softly. Over anything clickable the ring grows and the dot hides;
 * pressing shrinks the ring. Both use mix-blend-mode: difference, so they show
 * on every ground (paper, pink, terracotta, ink).
 *
 * Only for a mouse or trackpad (pointer: fine) and when the visitor allows
 * motion. Text fields keep the normal text cursor, and our dot hides there.
 * The loop runs only while the ring is catching up, then stops.
 */

const FINE = '(hover: hover) and (pointer: fine)'
const REDUCE = '(prefers-reduced-motion: reduce)'
const CLICKABLE = 'a, button, summary, label, select, [role="button"], input[type="submit"], input[type="checkbox"], input[type="radio"]'
const TEXT = 'input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'

const usable = () => window.matchMedia(FINE).matches && !window.matchMedia(REDUCE).matches

export function Cursor() {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && usable())
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  // Follow changes (a mouse plugged in, reduced motion switched on).
  useEffect(() => {
    const queries = [window.matchMedia(FINE), window.matchMedia(REDUCE)]
    const update = () => setOn(usable())
    queries.forEach((q) => q.addEventListener('change', update))
    return () => queries.forEach((q) => q.removeEventListener('change', update))
  }, [])

  useEffect(() => {
    if (!on) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let mode: 'default' | 'link' | 'text' = 'default'
    let down = false
    let visible = false
    let raf = 0

    const render = () => {
      raf = 0
      pos.x += (target.x - pos.x) * 0.22
      pos.y += (target.y - pos.y) * 0.22
      const ringScale = mode === 'link' ? 1.7 : down ? 0.75 : 1
      const show = visible && mode !== 'text' ? '1' : '0'
      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(${mode === 'link' ? 0 : 1})`
        dot.current.style.opacity = show
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
        ring.current.style.opacity = show
        // The circle inside scales with a CSS transition, so growing and shrinking ease.
        const circle = ring.current.firstElementChild as HTMLElement | null
        if (circle) circle.style.transform = `scale(${ringScale})`
      }
      if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) raf = requestAnimationFrame(render)
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        // Appear where the pointer is, without flying in from a corner.
        pos.x = target.x
        pos.y = target.y
        visible = true
      }
      const el = e.target instanceof Element ? e.target : null
      mode = el?.closest(TEXT) ? 'text' : el?.closest(CLICKABLE) ? 'link' : 'default'
      kick()
    }
    const onDown = () => {
      down = true
      kick()
    }
    const onUp = () => {
      down = false
      kick()
    }
    const onLeave = () => {
      visible = false
      kick()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [on])

  if (!on) return null
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <div ref={ring} className="absolute left-0 top-0 -ml-[18px] -mt-[18px] size-9 opacity-0 transition-opacity duration-200">
        <div className="size-full rounded-full border-[1.5px] border-solid border-white transition-transform duration-200 ease-out" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-white opacity-0 transition-opacity duration-150" />
    </div>
  )
}

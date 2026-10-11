import { useEffect, useRef, useState } from 'react'
import { Navbar } from './Navbar'

/**
 * Smart sticky menu: once the page has scrolled past its own header, a
 * compact copy slides in whenever the visitor scrolls up a little and slides
 * away again while they scroll down. A thin terracotta line shows how far
 * down the page they are. Hidden, it is inert (not reachable by keyboard);
 * the page's own header at the top is always there for the keyboard.
 */
export function StickyHeader() {
  const [shown, setShown] = useState(false)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const tick = () => {
      raf = 0
      const y = window.scrollY
      const dy = y - last
      last = y
      if (y < 400) setShown(false)
      else if (dy < -4) setShown(true)
      else if (dy > 4) setShown(false)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.scale = `${max > 0 ? Math.min(1, y / max) : 0} 1`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      inert={!shown}
      data-shown={shown || undefined}
      className="sticky-header fixed inset-x-0 top-0 z-[60] border-0 border-b border-solid border-ink/10 bg-paper"
    >
      <div className="container-x hidden lg:block">
        <Navbar variant="desktop" compact />
      </div>
      <div className="lg:hidden">
        <Navbar variant="phone" />
      </div>
      <div ref={bar} aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-terracotta" style={{ scale: '0 1' }} />
    </div>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { NAV_LINKS, PAGES, SITE } from '../data/site'
import { useEscape } from '../lib/hooks'
import { cx } from '../lib/text'
import { Wordmark } from './Wordmark'

/**
 * Site header from the design (S1Pred / S1Mobile).
 * Desktop: 88px tall, 64px margins, wordmark 28px, mono nav with 32px gaps.
 * Phone: 60px tall, 16px margins, wordmark 22px, a two-line menu button.
 * On the homepage the hero places it; elsewhere it sits on the paper ground.
 */
export function Navbar({ variant, className }: { variant: 'desktop' | 'phone'; className?: string }) {
  if (variant === 'desktop') {
    return (
      <header className={cx('flex h-[88px] items-center justify-between', className)}>
        <a href={PAGES.home} aria-label={`${SITE.name}, úvodní stránka`}>
          <Wordmark height={28} />
        </a>
        <nav aria-label="Hlavní" className="mono flex gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-ink no-underline hover:text-terracotta">
              {link.label}
            </a>
          ))}
        </nav>
      </header>
    )
  }
  return <PhoneHeader className={className} />
}

function PhoneHeader({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const toggleRef = useRef<HTMLButtonElement>(null)
  useEscape(open, () => {
    close()
    toggleRef.current?.focus()
  })

  // Close the menu if the screen grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && close()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [close])

  return (
    <header className={cx('relative', className)}>
      <div className="flex h-[60px] items-center justify-between px-4">
        <a href={PAGES.home} aria-label={`${SITE.name}, úvodní stránka`}>
          <Wordmark height={22} />
        </a>
        <button
          ref={toggleRef}
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="menu-telefon"
          onClick={() => setOpen((v) => !v)}
          className="flex size-11 cursor-pointer flex-col items-end justify-center gap-1.5 border-0 bg-transparent p-0"
        >
          <span className="h-0.5 w-[22px] bg-ink" />
          <span className="h-0.5 w-[22px] bg-ink" />
        </button>
      </div>
      {/* The open menu is not in the design; it lists the same four links in the nav style. */}
      <nav id="menu-telefon" aria-label="Hlavní" hidden={!open} className="absolute inset-x-0 top-[60px] z-50 bg-paper px-4 pb-4">
        <ul className="m-0 list-none p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={close} className="mono flex h-11 items-center text-[11px] text-ink no-underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

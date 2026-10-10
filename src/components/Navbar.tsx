import { useCallback, useEffect, useRef, useState } from 'react'
import { NAV_LINKS, PAGES, SITE } from '../data/site'
import { useActiveSection, useEscape } from '../lib/hooks'
import { cx } from '../lib/text'
import { usePath } from '../lib/router'
import { Wordmark } from './Wordmark'

/**
 * Site header from the design (S1Pred / S1Mobile).
 * Desktop: 88px tall, 64px margins, wordmark 28px, mono nav with 32px gaps.
 * The link of the section on screen keeps its underline; hovering draws it in.
 * Phone: 60px tall, 16px margins, wordmark 22px, a two-line menu button that
 * turns into a cross and opens the links as a sliding panel.
 * On the homepage the hero places it; elsewhere it sits on the paper ground.
 */

const SECTION_IDS = NAV_LINKS.map((link) => link.href.split('#')[1])
const NONE: string[] = []

/** On the homepage: the id of the section in the middle of the screen. */
function useCurrentSection() {
  const onHome = usePath() === PAGES.home
  const active = useActiveSection(onHome ? SECTION_IDS : NONE)
  return onHome ? active : null
}

export function Navbar({ variant, className }: { variant: 'desktop' | 'phone'; className?: string }) {
  const active = useCurrentSection()
  if (variant === 'desktop') {
    return (
      <header className={cx('flex h-[88px] items-center justify-between', className)}>
        <a href={PAGES.home} aria-label={`${SITE.name}, úvodní stránka`}>
          <Wordmark height={28} />
        </a>
        <nav aria-label="Hlavní" className="mono flex gap-8 lg:text-[13px]">
          {NAV_LINKS.map((link) => {
            const current = active === link.href.split('#')[1]
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={current ? 'location' : undefined}
                className={cx('nav-link relative text-ink no-underline hover:text-terracotta', current && 'is-current')}
              >
                {link.label}
              </a>
            )
          })}
        </nav>
      </header>
    )
  }
  return <PhoneHeader className={className} active={active} />
}

function PhoneHeader({ className, active }: { className?: string; active: string | null }) {
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
          data-open={open || undefined}
          className="menu-toggle flex size-11 cursor-pointer flex-col items-end justify-center gap-1.5 border-0 bg-transparent p-0"
        >
          <span className="h-0.5 w-[22px] bg-ink" />
          <span className="h-0.5 w-[22px] bg-ink" />
        </button>
      </div>
      {/* The open menu is not in the design; it lists the same four links in the nav style. */}
      <nav
        id="menu-telefon"
        aria-label="Hlavní"
        inert={!open}
        data-open={open || undefined}
        className="phone-menu absolute inset-x-0 top-[60px] z-50 border-0 border-b border-solid border-ink/15 bg-paper px-4 pb-4"
      >
        <ul className="m-0 list-none p-0">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} style={{ ['--i' as string]: i }}>
              <a
                href={link.href}
                onClick={close}
                aria-current={active === link.href.split('#')[1] ? 'location' : undefined}
                className="flex h-12 items-center justify-between border-0 border-b border-solid border-ink/10 font-sans text-[22px] font-bold tracking-[-0.02em] text-ink no-underline aria-[current]:text-terracotta"
              >
                {link.label}
                <span aria-hidden="true" className="mono text-[11px] font-normal text-muted">
                  0{i + 1}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

import { ListIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NAV_LINKS, SITE } from '../data/site'
import { useActiveSection, useEscape, useFocusTrap, useScrollLock } from '../lib/hooks'
import { cx } from '../lib/text'
import { CtaLink } from './Cta'
import { Logo } from './Logo'
import { EASE } from './Reveal'

const SECTION_IDS = NAV_LINKS.map((l) => l.id)

export function Navbar() {
  const active = useActiveSection(SECTION_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24
    if (next !== scrolled) setScrolled(next)
  })

  const close = useCallback(() => setOpen(false), [])
  useScrollLock(open)
  useEscape(open, close)
  useFocusTrap(open, menuRef)

  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      menuRef.current?.querySelector<HTMLElement>('a')?.focus()
    } else if (wasOpen.current) {
      wasOpen.current = false
      toggleRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  // Close the mobile menu when resizing up to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mq.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
      <motion.nav
        aria-label="Hlavní navigace"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className={cx(
          'glass-fallback mx-auto flex h-14 max-w-[1240px] items-center justify-between rounded-full border pl-5 pr-2 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:h-16',
          scrolled || open
            ? 'border-line-strong bg-ink-900/80 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.9)]'
            : 'border-transparent bg-ink-900/30',
        )}
      >
        <a href="#domu" className="shrink-0 rounded-full" aria-label={`${SITE.name}, zpět nahoru`}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={cx(
                    'relative block rounded-full px-4 py-2 text-[14.5px] transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <CtaLink href="#katalog" arrow className="h-11 px-5 text-[14px]">
              Vytvořit výběr
            </CtaLink>
          </span>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Zavřít menu' : 'Otevřít menu'}
            className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-white/[0.07] lg:hidden"
          >
            {open ? <XIcon size={22} /> : <ListIcon size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-fallback fixed inset-x-3 top-[4.6rem] z-[55] flex max-h-[calc(100dvh-5.5rem)] flex-col overflow-y-auto rounded-card border border-line-strong bg-ink-900/95 p-3 backdrop-blur-xl sm:inset-x-5 sm:top-[5.2rem] lg:hidden"
          >
            <ul>
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.4, ease: EASE }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={close}
                    aria-current={active === link.id ? 'location' : undefined}
                    className={cx(
                      'flex items-center justify-between rounded-[14px] px-4 py-3.5 font-display text-2xl font-semibold tracking-[-0.02em] transition-colors',
                      active === link.id ? 'bg-white/[0.06] text-fg' : 'text-fg/85 hover:bg-white/[0.04]',
                    )}
                  >
                    {link.label}
                    <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-3 grid gap-3 border-t border-line p-2 pt-4">
              <CtaLink href="#katalog" arrow size="lg" onClick={close} className="w-full">
                Vytvořit výběr
              </CtaLink>
              <a href={`mailto:${SITE.email}`} className="py-2 text-center text-sm text-muted hover:text-fg">
                {SITE.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

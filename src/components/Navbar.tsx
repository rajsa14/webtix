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
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-500',
        scrolled || open ? 'border-line bg-ink-950/92 backdrop-blur-md' : 'border-transparent bg-transparent',
      )}
    >
      <motion.nav
        aria-label="Hlavní navigace"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        className="container-x flex h-16 items-center justify-between"
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
                    'relative flex items-center gap-2 px-3.5 py-2 font-mono text-[12.5px] uppercase tracking-[0.1em] transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute left-0.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent"
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
            className="grid size-11 place-items-center rounded-full border border-fg text-fg transition-colors hover:bg-fg hover:text-ink-950 lg:hidden"
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
            className="fixed inset-x-0 top-16 z-[55] flex max-h-[calc(100dvh-4rem)] flex-col overflow-y-auto border-b border-fg bg-ink-950 p-3 lg:hidden"
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
                      'flex items-center justify-between rounded-[14px] px-4 py-3 font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.05em] transition-colors',
                      active === link.id ? 'text-accent' : 'text-fg hover:text-accent',
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

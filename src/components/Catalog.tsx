import { ArrowDownIcon, CheckIcon, LockSimpleIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { catalog } from '../data/catalog'
import { plural, useActiveSection } from '../lib/hooks'
import { cx, nb } from '../lib/text'
import { countCategoriesDone, countSelected, unlockedCount, useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { CatalogCategory } from './CatalogCategory'
import { CtaLink } from './Cta'
import { SectionLabel } from './Decor'
import { EASE, Reveal } from './Reveal'

export function Catalog() {
  const open = useOpenCatalog()
  return (
    <section id="katalog" className="relative py-24 sm:py-32">
      <div className="container-x relative">
        <Reveal className="max-w-5xl">
          <SectionLabel number="02">Katalog</SectionLabel>
          <h2 className="display-xl">
            {nb('Nevíte přesně, jak má váš web vypadat? Nevadí.')}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {nb(
              'Projděte si jednotlivé možnosti a jednoduše si označte to, co se vám líbí. Zbytek už necháte na nás.',
            )}
          </p>
        </Reveal>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <Unfold key="catalog">
            <CategoryTabs />
            <CatalogSteps />
          </Unfold>
        ) : (
          <Unfold key="gate">
            <OpenButton />
          </Unfold>
        )}
      </AnimatePresence>
    </section>
  )
}

/**
 * Opens the catalog from links elsewhere (hero, navbar, contact) and for
 * visitors who come back with a saved selection.
 */
function useOpenCatalog() {
  const open = useUi((s) => s.catalogOpen)
  const openCatalog = useUi((s) => s.openCatalog)
  const hasSaved = useSelection((s) => countSelected(s.selected) > 0)

  useEffect(() => {
    if (hasSaved) openCatalog()
  }, [hasSaved, openCatalog])

  useEffect(() => {
    const wanted = (hash: string) => hash === '#katalog' || hash.startsWith('#kategorie-')
    if (wanted(window.location.hash)) openCatalog()
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]')
      if (link && wanted(link.getAttribute('href') ?? '')) openCatalog()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [openCatalog])

  return open
}

/** The big button the catalog waits behind. */
function OpenButton() {
  const openCatalog = useUi((s) => s.openCatalog)
  return (
    <div className="container-x mt-12">
      <motion.button
        type="button"
        onClick={openCatalog}
        whileTap={{ scale: 0.98 }}
        data-cursor="Otevřít"
        className="group flex w-full items-center justify-between gap-6 rounded-card bg-accent px-7 py-8 text-left text-white shadow-[10px_10px_0_0_var(--color-fg)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-fg hover:shadow-[14px_14px_0_0_var(--color-accent)] sm:px-12 sm:py-12"
      >
        <span>
          <span className="block font-display text-[clamp(3.4rem,10vw,8.5rem)] font-extrabold leading-[0.85] tracking-[-0.06em]">
            Katalog
          </span>
          <span className="mt-4 block font-mono text-[12px] uppercase tracking-[0.14em] text-white/75">
            {catalog.length} kroků · písmo, barvy, fotky, styl, tlačítka, layout
          </span>
        </span>
        <span className="grid size-16 shrink-0 place-items-center rounded-full bg-white text-fg transition-transform duration-500 group-hover:translate-y-1.5 sm:size-24">
          <ArrowDownIcon weight="bold" className="size-7 sm:size-10" />
        </span>
      </motion.button>
    </div>
  )
}

/**
 * Shows the categories one step at a time: the first is open from the start
 * and every next one slides in once the one before it has a choice.
 */
function CatalogSteps() {
  const selected = useSelection((s) => s.selected)
  const open = unlockedCount(selected)
  const next = catalog[open]

  return (
    <div className="container-x mt-12">
      <AnimatePresence initial={false}>
        {catalog.slice(0, open).map((category, i) => (
          <Unfold key={category.id} className={i > 0 ? 'pt-24 sm:pt-32' : undefined}>
            <CatalogCategory category={category} />
          </Unfold>
        ))}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        <Unfold key={next ? `next-${next.id}` : 'done'} className="pt-24 sm:pt-32">
          {next ? <NextStep index={open} /> : <CatalogDone />}
        </Unfold>
      </AnimatePresence>
    </div>
  )
}

/** Grows from zero height so content below slides down instead of jumping. */
function Unfold({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  // Clip only while moving, so card hover lifts are not cut off afterwards.
  const [moving, setMoving] = useState(false)
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={reduce ? { duration: 0 } : { height: { duration: 0.7, ease: EASE }, opacity: { duration: 0.45, delay: 0.1 } }}
      onAnimationStart={() => setMoving(true)}
      onAnimationComplete={() => setMoving(false)}
      style={{ overflow: moving ? 'hidden' : 'visible' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Placeholder for the next locked step, so the visitor knows more is coming. */
function NextStep({ index }: { index: number }) {
  const cat = catalog[index]
  const previous = catalog[index - 1]
  const later = catalog.slice(index + 1)
  return (
    <div className="flex flex-col gap-5 rounded-card border border-dashed border-line-strong p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
      <div className="flex items-center gap-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-fg">
          <LockSimpleIcon size={20} weight="bold" />
        </span>
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
            Krok {index + 1} z {catalog.length}
          </p>
          <h3 className="mt-1 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.04em]">
            {cat.title}
          </h3>
          <p className="mt-1 text-muted">{nb(`Odemkne se, jakmile vyberete ${previous.label.toLowerCase()}.`)}</p>
        </div>
      </div>
      {later.length > 0 && (
        <p className="text-[13px] text-faint sm:max-w-[16rem] sm:text-right">
          {nb(`Potom: ${later.map((c) => c.label.toLowerCase()).join(', ')}`)}
        </p>
      )}
    </div>
  )
}

const TAB_IDS = catalog.map((c) => `kategorie-${c.id}`)

function CategoryTabs() {
  const selected = useSelection((s) => s.selected)
  const open = unlockedCount(selected)
  // Re-observe whenever a new category appears on the page.
  const ids = useMemo(() => TAB_IDS.slice(0, open), [open])
  const active = useActiveSection(ids, '-35% 0px -55% 0px')
  const done = countCategoriesDone(selected)
  const scroller = useRef<HTMLDivElement>(null)

  // Keep the active tab visible on narrow screens without moving the page.
  useEffect(() => {
    const box = scroller.current
    const tab = box?.querySelector<HTMLElement>(`[data-tab="${active}"]`)
    if (!box || !tab) return
    box.scrollTo({ left: tab.offsetLeft - box.clientWidth / 2 + tab.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  return (
    <div className="sticky top-[76px] z-30 mt-12">
      <div className="container-x">
        <nav
          aria-label="Kategorie katalogu"
          className="flex items-center gap-2 rounded-full border border-fg bg-ink-900 p-1.5"
        >
          <div ref={scroller} className="no-scrollbar relative flex min-w-0 flex-1 gap-1 overflow-x-auto">
            {catalog.map((cat, i) => {
              const id = `kategorie-${cat.id}`
              const n = selected[cat.id].length
              const isActive = active === id
              if (i >= open)
                return (
                  <span
                    key={cat.id}
                    aria-disabled="true"
                    title="Odemkne se po výběru v předchozí kategorii"
                    className="flex h-9 shrink-0 cursor-not-allowed items-center gap-1.5 rounded-full px-3.5 text-[13.5px] text-faint"
                  >
                    <LockSimpleIcon size={12} weight="bold" aria-hidden="true" />
                    {cat.label}
                    <span className="sr-only">(zamčeno)</span>
                  </span>
                )
              return (
                <a
                  key={cat.id}
                  href={`#${id}`}
                  data-tab={id}
                  aria-current={isActive ? 'location' : undefined}
                  className={cx(
                    'relative flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[13.5px] transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="catalog-tab"
                      className="absolute inset-0 rounded-full bg-fg/[0.08]"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{cat.label}</span>
                  {n > 0 && (
                    <span className="relative grid size-[18px] place-items-center rounded-full bg-accent-strong text-white">
                      <CheckIcon size={10} weight="bold" />
                      <span className="sr-only">vybráno</span>
                    </span>
                  )}
                </a>
              )
            })}
          </div>
          <div className="hidden shrink-0 items-center gap-2.5 border-l border-line pl-3 pr-2 sm:flex">
            <span className="flex gap-1" aria-hidden="true">
              {catalog.map((cat) => (
                <span
                  key={cat.id}
                  className={cx(
                    'h-1.5 w-3 rounded-full transition-colors duration-500',
                    selected[cat.id].length ? 'bg-accent' : 'bg-fg/12',
                  )}
                />
              ))}
            </span>
            <span className="font-mono text-[12px] text-muted">
              {done}/{catalog.length}
            </span>
          </div>
        </nav>
      </div>
    </div>
  )
}

function CatalogDone() {
  const selected = useSelection((s) => s.selected)
  const total = useMemo(() => countSelected(selected), [selected])
  const done = countCategoriesDone(selected)

  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-card border border-fg bg-ink-900 p-7 sm:p-10">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-tight tracking-[-0.025em]">
              {total > 0 ? 'Máte vybráno. Pošlete nám svou představu.' : 'Zatím nemáte nic vybráno.'}
            </h3>
            <p className="mt-2 text-muted">
              {total > 0
                ? `${total} ${plural(total, ['položka', 'položky', 'položek'])} ve výběru, ${done} ze ${catalog.length} kategorií. Výběr se ukládá automaticky.`
                : 'Klikněte na karty, které se vám líbí. Stačí i jedna.'}
            </p>
          </div>
          <CtaLink
            href={total > 0 ? '#poptavka' : '#kategorie-fonts'}
            size="lg"
            arrow
            className="shrink-0"
          >
            {total > 0 ? 'Pokračovat k odeslání' : 'Začít písmem'}
          </CtaLink>
        </div>
      </div>
    </Reveal>
  )
}

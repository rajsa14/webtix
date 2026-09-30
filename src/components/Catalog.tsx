import { CheckIcon } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef } from 'react'
import { catalog } from '../data/catalog'
import { plural, useActiveSection } from '../lib/hooks'
import { cx, nb } from '../lib/text'
import { countCategoriesDone, countSelected, useSelection } from '../store/selection'
import { CatalogCategory } from './CatalogCategory'
import { CtaLink } from './Cta'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

export function Catalog() {
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

      <CategoryTabs />

      <div className="container-x mt-12 space-y-24 sm:space-y-32">
        {catalog.map((category) => (
          <CatalogCategory key={category.id} category={category} />
        ))}
        <CatalogDone />
      </div>
    </section>
  )
}

const TAB_IDS = catalog.map((c) => `kategorie-${c.id}`)

function CategoryTabs() {
  const selected = useSelection((s) => s.selected)
  const active = useActiveSection(TAB_IDS, '-35% 0px -55% 0px')
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
            {catalog.map((cat) => {
              const id = `kategorie-${cat.id}`
              const n = selected[cat.id].length
              const isActive = active === id
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

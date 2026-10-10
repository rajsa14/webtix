import { ArrowDownIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useMemo, useState, type MouseEvent } from 'react'
import { KIND_LABELS, references, type Reference, type ReferenceKind } from '../data/references'
import { PAGES } from '../data/site'
import { plural } from '../lib/hooks'
import { cx, nb } from '../lib/text'
import { BrowserFrame } from './BrowserFrame'
import { CtaLink } from './Cta'
import { SectionLabel } from './Decor'
import { EASE, Reveal } from './Reveal'

const LINK_TEXT: Record<ReferenceKind, string> = {
  client: 'Otevřít web',
  own: 'Otevřít web',
  proposal: 'Prohlédnout návrh',
  concept: 'Prohlédnout koncept',
}

/** What each kind honestly is, shown under the featured project. */
const KIND_NOTE: Record<ReferenceKind, string> = {
  client: 'Web pro klienta, běží naostro.',
  own: 'Náš vlastní web.',
  proposal: 'Návrh pro skutečný podnik. Ostrý web zatím neběží.',
  concept: 'Koncept pro vymyšlenou značku.',
}

type Filter = 'all' | ReferenceKind

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Vše' },
  { id: 'client', label: 'Klienti' },
  { id: 'proposal', label: 'Návrhy' },
  { id: 'concept', label: 'Koncepty' },
  { id: 'own', label: 'Vlastní weby' },
]

const number = (i: number) => String(i + 1).padStart(2, '0')
const anchor = (ref: Reference) => `projekt-${references.indexOf(ref) + 1}`
const indexOf = (ref: Reference) => references.indexOf(ref)

function hrefOf(ref: Reference) {
  if (!ref.url) return undefined
  return /^https?:/.test(ref.url) ? ref.url : import.meta.env.BASE_URL + ref.url
}

/** The address shown in the browser bar: a hostname, or webtix.cz/... for our own concept pages. */
function addressOf(ref: Reference) {
  if (!ref.url) return 'webtix.cz'
  if (/^https?:/.test(ref.url)) return new URL(ref.url).hostname.replace(/^www\./, '')
  return 'webtix.cz/' + ref.url.replace(/\/?index\.html$/, '')
}

export function References() {
  const [filter, setFilter] = useState<Filter>('all')
  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: references.length, client: 0, own: 0, proposal: 0, concept: 0 }
    references.forEach((r) => c[r.kind]++)
    return c
  }, [])
  const shown = filter === 'all' ? references : references.filter((r) => r.kind === filter)

  if (references.length === 0) return null

  const [featured, ...rest] = shown

  return (
    <section className="relative pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="container-x">
        {/* Heading */}
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel>Práce</SectionLabel>
            <h1 className="display-xl">
              Reference<span className="text-accent">.</span>
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-muted lg:col-span-4 lg:pb-3">
            {nb(
              'Weby, které jsme navrhli a postavili. U každého poctivě píšeme, co to je: vlastní web, návrh pro skutečný podnik, nebo koncept pro vymyšlenou značku.',
            )}
          </p>
        </Reveal>

        {/* Filters double as a summary of what is on the page. */}
        <Reveal delay={0.08}>
          <div
            role="group"
            aria-label="Filtrovat projekty"
            className="mt-12 flex flex-wrap items-center gap-2 border-y border-fg py-4"
          >
            {FILTERS.filter((f) => counts[f.id] > 0).map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={cx(
                    'relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-[15px] transition-colors duration-300',
                    active ? 'text-ink-950' : 'text-fg hover:text-accent',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="reference-filter"
                      className="absolute inset-0 rounded-full bg-fg"
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                  <span className={cx('relative font-mono text-[11px]', active ? 'text-ink-800' : 'text-muted')}>
                    {counts[f.id]}
                  </span>
                </button>
              )
            })}
            <span className="ml-auto hidden font-mono text-[12px] uppercase tracking-[0.14em] text-muted sm:block">
              {shown.length} {plural(shown.length, ['projekt', 'projekty', 'projektů'])}
            </span>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {featured && <Featured reference={featured} />}
            {shown.length > 1 && <Index items={shown} />}
            {rest.length > 0 && (
              <div className="mt-20 grid gap-x-6 gap-y-16 lg:grid-cols-12 lg:gap-y-24">
                {rest.map((ref, i) => (
                  <Reveal
                    key={ref.title}
                    delay={(i % 2) * 0.08}
                    className={cx(
                      // Alternate wide and narrow columns so the grid reads like a layout, not a table.
                      i % 4 === 0 && 'lg:col-span-7',
                      i % 4 === 1 && 'lg:col-span-5 lg:mt-32',
                      i % 4 === 2 && 'lg:col-span-5',
                      i % 4 === 3 && 'lg:col-span-7 lg:mt-32',
                    )}
                  >
                    <Project reference={ref} />
                  </Reveal>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Closing line */}
        <Reveal>
          <div className="mt-28 flex flex-col items-start justify-between gap-8 rounded-card border border-fg bg-ink-900 p-8 sm:p-12 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">Další na řadě</p>
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">
                {nb('Tady může být váš web.')}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                {nb('Vyberte si styl v katalogu, nebo nám rovnou napište. Pošleme vám konkrétní návrh.')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <CtaLink href={PAGES.catalog} size="lg" arrow>
                Otevřít katalog
              </CtaLink>
              <CtaLink href={PAGES.contact} variant="secondary" size="lg">
                Napsat nám
              </CtaLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** A screenshot, or a typographic cover when there is none yet. */
function Shot({ reference: ref, className }: { reference: Reference; className?: string }) {
  if (ref.image) {
    return (
      <img
        src={import.meta.env.BASE_URL + ref.image}
        alt={`Ukázka webu ${ref.title}`}
        loading="lazy"
        className={cx(
          'h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.035]',
          className,
        )}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`${ref.title}, ${ref.client}`}
      className={cx(
        'relative flex h-full w-full flex-col justify-between overflow-hidden bg-fg p-[6%] text-ink-950',
        className,
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
        {ref.client} · {ref.type}
      </span>
      <span className="font-display text-[clamp(2.4rem,7vw,5.5rem)] font-extrabold leading-[0.88] tracking-[-0.055em] transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:-translate-y-1">
        {ref.title}
        <span className="text-accent">.</span>
      </span>
      <span
        aria-hidden="true"
        className="absolute -right-[8%] -top-[30%] size-[60%] rounded-full border border-ink-700/40"
      />
      <span
        aria-hidden="true"
        className="absolute -right-[2%] -top-[18%] size-[42%] rounded-full bg-accent/90 mix-blend-screen"
      />
    </div>
  )
}

function KindTag({ kind, className }: { kind: ReferenceKind; className?: string }) {
  const label = KIND_LABELS[kind] || 'Klient'
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]',
        kind === 'client' ? 'border-accent bg-accent text-white' : 'border-fg text-fg',
        className,
      )}
    >
      {label}
    </span>
  )
}

function Featured({ reference: ref }: { reference: Reference }) {
  const href = hrefOf(ref)
  const frame = (
    <BrowserFrame address={addressOf(ref)} className="aspect-[16/10.6] w-full">
      <Shot reference={ref} />
    </BrowserFrame>
  )

  return (
    <article id={anchor(ref)} className="group mt-14 grid scroll-mt-28 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
      <Reveal className="lg:col-span-7">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${ref.title}, ${LINK_TEXT[ref.kind].toLowerCase()}`}>
            {frame}
          </a>
        ) : (
          frame
        )}
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] text-accent">{number(indexOf(ref))}</span>
          <span className="h-px flex-1 bg-fg" />
          <KindTag kind={ref.kind} />
        </div>
        <h2 className="mt-6 text-[clamp(2.6rem,5.4vw,4.6rem)] font-extrabold leading-[0.9] tracking-[-0.055em]">
          {ref.title}
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">{nb(ref.description)}</p>
        <dl className="mt-8 grid grid-cols-3 border-t border-fg">
          {[
            ['Obor', ref.client],
            ['Typ', ref.type],
            ['Rok', String(ref.year)],
          ].map(([term, value]) => (
            <div key={term} className="border-b border-line py-3 pr-3">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{term}</dt>
              <dd className="mt-1 text-[15px]">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[14px] text-muted">{KIND_NOTE[ref.kind]}</p>
        {href && (
          <CtaLink href={href} target="_blank" rel="noopener noreferrer" className="mt-8" arrow>
            {LINK_TEXT[ref.kind]}
          </CtaLink>
        )}
      </Reveal>
    </article>
  )
}

/** A plain studio index: name, field, kind, year. On a mouse, a preview follows the cursor. */
function Index({ items }: { items: Reference[] }) {
  const [hovered, setHovered] = useState<Reference | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 })

  const move = (event: MouseEvent) => {
    x.set(event.clientX)
    y.set(event.clientY)
  }

  return (
    <Reveal>
      <div className="mt-24">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">Rejstřík</p>
        <ol className="mt-4 border-t border-fg" onMouseMove={move} onMouseLeave={() => setHovered(null)}>
          {items.map((ref) => (
            <li key={ref.title}>
              <a
                href={`#${anchor(ref)}`}
                onMouseEnter={() => setHovered(ref)}
                onFocus={() => setHovered(null)}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-line py-4 transition-[color,border-color,padding] duration-500 ease-[var(--ease-out-expo)] hover:border-fg hover:pl-3 hover:text-accent md:grid-cols-[3rem_1.4fr_1fr_8rem_4rem_1.5rem] md:py-5"
              >
                <span className="font-mono text-[12px] text-muted">{number(indexOf(ref))}</span>
                <span className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold leading-none tracking-[-0.045em]">
                  {ref.title}
                </span>
                <span className="hidden text-[15px] text-muted md:block">{ref.client}</span>
                <span className="hidden font-mono text-[12px] uppercase tracking-[0.12em] text-muted md:block">
                  {KIND_LABELS[ref.kind] || 'Klient'}
                </span>
                <span className="font-mono text-[12px] text-muted md:text-right">{ref.year}</span>
                <ArrowDownIcon
                  size={16}
                  weight="bold"
                  className="hidden self-center transition-transform duration-300 group-hover:translate-y-1 md:block"
                />
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* Cursor preview, desktop only. Decorative: the list itself carries all information. */}
      <motion.div
        aria-hidden="true"
        style={{ left: sx, top: sy }}
        className="pointer-events-none fixed z-30 hidden -translate-x-1/2 -translate-y-[115%] [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered.title}
              initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="h-[180px] w-[288px] overflow-hidden rounded-inner border border-fg bg-ink-900 shadow-[8px_8px_0_0_var(--color-fg)]"
            >
              <Shot reference={hovered} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  )
}

function Project({ reference: ref }: { reference: Reference }) {
  const href = hrefOf(ref)
  const frame = (
    <BrowserFrame address={addressOf(ref)} className="aspect-[16/10.6] w-full">
      <Shot reference={ref} />
      {href && (
        <span className="absolute inset-0 flex items-end justify-end p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-[14px] text-ink-950">
            {LINK_TEXT[ref.kind]} <ArrowUpRightIcon size={14} weight="bold" />
          </span>
        </span>
      )}
    </BrowserFrame>
  )

  return (
    <article id={anchor(ref)} className="group scroll-mt-28">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${ref.title}, ${LINK_TEXT[ref.kind].toLowerCase()}`} className="block">
          {frame}
        </a>
      ) : (
        frame
      )}
      <div className="mt-8 flex items-baseline justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
        <span>
          <span className="text-accent">{number(indexOf(ref))}</span> · {ref.client} · {ref.type}
        </span>
        <KindTag kind={ref.kind} />
      </div>
      <h2 className="mt-3 text-[clamp(2rem,3.6vw,2.8rem)] font-extrabold leading-[0.95] tracking-[-0.05em]">{ref.title}</h2>
      <p className="mt-3 max-w-lg leading-relaxed text-muted">{nb(ref.description)}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-[15px] text-accent transition-colors hover:text-fg"
        >
          {LINK_TEXT[ref.kind]} <ArrowUpRightIcon size={15} weight="bold" />
        </a>
      ) : (
        <p className="mt-4 text-[14px] text-muted">{KIND_NOTE[ref.kind]}</p>
      )}
    </article>
  )
}

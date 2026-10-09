import { ArrowDownIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { KIND_LABELS, references, type Reference } from '../data/references'
import { plural } from '../lib/hooks'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

const number = (i: number) => String(i + 1).padStart(2, '0')
const anchor = (i: number) => `projekt-${number(i)}`

export function References() {
  if (references.length === 0) return null

  return (
    <section className="relative pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <SectionLabel>Práce</SectionLabel>
            <h1 className="display-xl">
              Reference<span className="text-accent">.</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {nb(
                'Weby, které jsme navrhli a postavili. U každého poctivě píšeme, co to je: vlastní web, návrh pro skutečný podnik, nebo koncept pro vymyšlenou značku.',
              )}
            </p>
          </div>
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
            {references.length} {plural(references.length, ['projekt', 'projekty', 'projektů'])}
          </p>
        </Reveal>

        {/* A plain index first, the way studios list their work: name, field, kind, year. */}
        <Reveal>
          <ol className="mt-14 border-t border-fg">
            {references.map((ref, i) => (
              <li key={ref.title}>
                <a
                  href={`#${anchor(i)}`}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-line py-4 transition-colors duration-300 hover:border-fg hover:text-accent md:grid-cols-[3rem_1.4fr_1fr_8rem_4rem_1.5rem] md:py-5"
                >
                  <span className="font-mono text-[12px] text-muted">{number(i)}</span>
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
        </Reveal>

        <div className="mt-20 grid gap-x-5 gap-y-14 md:grid-cols-2 lg:gap-x-6 lg:gap-y-20">
          {references.map((ref, i) => (
            <Reveal key={ref.title} delay={(i % 2) * 0.08}>
              <Project reference={ref} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Project({ reference: ref, index }: { reference: Reference; index: number }) {
  const label = KIND_LABELS[ref.kind]
  const href = ref.url && (/^https?:/.test(ref.url) ? ref.url : import.meta.env.BASE_URL + ref.url)
  const image = (
    <img
      src={import.meta.env.BASE_URL + ref.image}
      alt={`Ukázka webu ${ref.title}`}
      loading="lazy"
      className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
    />
  )
  const frame = 'relative block aspect-[16/10] overflow-hidden rounded-card border border-fg bg-ink-800'

  return (
    <article id={anchor(index)} className="group scroll-mt-28">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${ref.title}, otevřít web`} className={frame}>
          {image}
        </a>
      ) : (
        <div className={frame}>{image}</div>
      )}
      <div className="mt-5 flex items-baseline justify-between gap-4 font-mono text-[12px] uppercase tracking-[0.12em] text-muted">
        <span>
          <span className="text-accent">{number(index)}</span> · {ref.client} · {ref.type}
        </span>
        {label && <span className="shrink-0 rounded-full border border-fg px-2.5 py-1 text-fg">{label}</span>}
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
          {ref.kind === 'concept' ? 'Prohlédnout koncept' : 'Otevřít web'} <ArrowUpRightIcon size={15} weight="bold" />
        </a>
      ) : (
        <p className="mt-4 text-[14px] text-muted">Návrh. Ostrý web zatím neběží.</p>
      )}
    </article>
  )
}

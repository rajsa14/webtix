import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { references } from '../data/references'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

export function References() {
  if (references.length === 0) return null
  const hasConcepts = references.some((r) => r.concept)

  return (
    <section id="reference" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <SectionLabel number="04">Práce</SectionLabel>
          <h2 className="display-xl">
            Reference<span className="text-accent">.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {nb(
              hasConcepts
                ? 'Ukázky naší práce. Weby označené jako koncept jsme navrhli pro fiktivní značky, abychom ukázali, co umíme.'
                : 'Weby, které jsme už vytvořili.',
            )}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:gap-5">
          {references.map((ref, i) => (
            <Reveal key={ref.title} delay={i * 0.08}>
              <article
               
                className="group h-full overflow-hidden rounded-card border border-fg bg-ink-900"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-fg bg-ink-800">
                  <img
                    src={ref.image}
                    alt={`Ukázka webu ${ref.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  {ref.concept && (
                    <span className="absolute left-4 top-4 rounded-full bg-fg px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-950">
                      Koncept
                    </span>
                  )}
                </div>
                <div className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
                  <p className="text-[13px] text-muted">
                    {ref.client} <span aria-hidden="true" className="px-1 text-faint">/</span> {ref.type}
                  </p>
                  <h3 className="mt-1 text-[2.2rem] font-extrabold leading-[0.95] tracking-[-0.05em]">{ref.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{nb(ref.description)}</p>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-[15px] text-accent transition-colors hover:text-fg"
                    >
                      {ref.concept ? 'Prohlédnout koncept' : 'Otevřít web'} <ArrowUpRightIcon size={15} weight="bold" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

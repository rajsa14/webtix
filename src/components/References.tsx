import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { references } from '../data/references'
import { spotlightMove } from '../lib/hooks'
import { nb } from '../lib/text'
import { Reveal } from './Reveal'

export function References() {
  if (references.length === 0) return null

  return (
    <section id="reference" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 className="text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">Reference</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{nb('Weby, které jsme už vytvořili.')}</p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:gap-5">
          {references.map((ref, i) => (
            <Reveal key={ref.title} delay={i * 0.08}>
              <article
                onPointerMove={spotlightMove}
                className="spotlight group h-full overflow-hidden rounded-card border border-line bg-ink-900 transition-colors duration-500 hover:border-line-strong"
              >
                <div className="relative m-1.5 aspect-[16/10] overflow-hidden rounded-[15px] bg-ink-800">
                  <img
                    src={ref.image}
                    alt={`Ukázka webu ${ref.title}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  {ref.concept && (
                    <span className="absolute left-4 top-4 rounded-full bg-ink-950/80 px-3 py-1 text-[12.5px] text-fg/90 backdrop-blur">
                      Koncept
                    </span>
                  )}
                </div>
                <div className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
                  <p className="text-[13px] text-muted">
                    {ref.client} <span aria-hidden="true" className="px-1 text-faint">/</span> {ref.type}
                  </p>
                  <h3 className="mt-1 text-[1.6rem] font-semibold leading-tight tracking-[-0.025em]">{ref.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{nb(ref.description)}</p>
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-[15px] text-accent-soft transition-colors hover:text-fg"
                    >
                      Otevřít web <ArrowUpRightIcon size={15} weight="bold" />
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

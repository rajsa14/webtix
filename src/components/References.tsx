import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { references } from '../data/references'
import { useLang, useT } from '../i18n'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

export function References() {
  const t = useT()
  const lang = useLang((s) => s.lang)
  if (references.length === 0) return null
  const hasConcepts = references.some((r) => r.concept)

  return (
    <section id="reference" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <SectionLabel number="04">{t.references.label}</SectionLabel>
          <h2 className="display-xl">
            {t.references.title}
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {nb(hasConcepts ? t.references.leadConcept : t.references.leadReal)}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:gap-5">
          {references.map((ref, i) => {
            const text = lang === 'en' ? ref.en : ref
            const body = (
              <article className="group h-full overflow-hidden rounded-card border border-fg bg-ink-900 transition-shadow duration-500 ease-[var(--ease-out-expo)] hover:shadow-[10px_10px_0_0_var(--color-fg)]">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-fg bg-ink-800">
                  <img
                    src={ref.image}
                    alt={t.references.alt(ref.title)}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                  {ref.concept && (
                    <span className="absolute left-4 top-4 rounded-full bg-fg px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-950">
                      {t.references.concept}
                    </span>
                  )}
                  <span className="absolute right-4 top-4 font-mono text-[12px] text-white mix-blend-difference">
                    {String(i + 1).padStart(2, '0')}/{String(references.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
                  <p className="text-[13px] text-muted">
                    {text.client} <span aria-hidden="true" className="px-1 text-faint">/</span> {text.type}
                  </p>
                  <h3 className="mt-1 text-[2.2rem] font-extrabold leading-[0.95] tracking-[-0.05em]">{ref.title}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-muted">{nb(text.description)}</p>
                  {ref.url && (
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[15px] text-accent transition-colors group-hover:text-fg">
                      {ref.concept ? t.references.openConcept : t.references.openSite}
                      <ArrowUpRightIcon size={15} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </article>
            )
            return (
              <Reveal key={ref.title} delay={i * 0.08}>
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" data-cursor={t.references.cursor} className="block h-full rounded-card">
                    {body}
                  </a>
                ) : (
                  body
                )}
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

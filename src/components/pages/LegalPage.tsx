import { LEGAL, LEGAL_UPDATED, type LegalDoc } from '../../data/legal'
import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { title, intro, sections } = LEGAL[doc]
  usePageMeta({ title, description: intro })

  return (
    <>
      <article className="container-x pb-16 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-[clamp(2.3rem,6vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">{nb(intro)}</p>

          <div className="mt-12 grid gap-10">
            {sections.map((section) => (
              <section key={section.h}>
                <h2 className="text-[1.35rem] font-semibold tracking-[-0.02em]">{section.h}</h2>
                {section.p.map((paragraph) => (
                  <p key={paragraph} className="mt-3 leading-relaxed text-fg/85">
                    {nb(paragraph)}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-3 grid list-disc gap-1.5 pl-5 leading-relaxed text-fg/85 marker:text-accent-soft">
                    {section.list.map((item) => (
                      <li key={item}>{nb(item)}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-line pt-6 text-[14px] text-muted">Poslední aktualizace: {LEGAL_UPDATED}</p>
        </div>
      </article>
    </>
  )
}

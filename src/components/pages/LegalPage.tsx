import { LEGAL, LEGAL_UPDATED, type LegalDoc } from '../../data/legal'
import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { title, intro, sections } = LEGAL[doc]
  usePageMeta({ title, description: intro })

  return (
    <>
      <article className="container-x py-16 sm:py-24">
        <div className="measure">
          <h1 className="text-h1">{title}</h1>
          <p className="mt-6 text-muted">{nb(intro)}</p>

          <div className="mt-12 grid gap-10">
            {sections.map((section) => (
              <section key={section.h}>
                <h2 className="text-h3">{section.h}</h2>
                {section.p.map((paragraph) => (
                  <p key={paragraph} className="mt-3">
                    {nb(paragraph)}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-3 grid list-disc gap-1.5 pl-5 marker:text-brand-text">
                    {section.list.map((item) => (
                      <li key={item}>{nb(item)}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-line pt-6 text-small text-muted">Poslední aktualizace: {LEGAL_UPDATED}</p>
        </div>
      </article>
    </>
  )
}

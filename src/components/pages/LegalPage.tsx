import { LEGAL, LEGAL_UPDATED, type LegalDoc } from '../../data/legal'
import { usePageMeta } from '../../lib/meta'
import { nb } from '../../lib/text'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const { title, intro, sections } = LEGAL[doc]
  usePageMeta({ title, description: intro })

  return (
    <>
      <article className="container-x py-16 sm:py-24">
        <div className="max-w-[65ch]">
          <h1 className="text-[40px] leading-[0.96] tracking-[-0.035em] lg:text-h2">{title}</h1>
          <p className="mt-6 text-muted">{nb(intro)}</p>

          <div className="mt-12 grid gap-10">
            {sections.map((section) => (
              <section key={section.h}>
                <h2 className="text-h3">{section.h}</h2>
                <Paragraphs items={section.p} />
                {section.parts?.map((part) => (
                  <div key={part.h} className="mt-6">
                    <h3 className="m-0 text-[18px] leading-7 lg:text-[20px]">{part.h}</h3>
                    <List items={part.list} />
                  </div>
                ))}
                <List items={section.list} />
                <Paragraphs items={section.after} />
              </section>
            ))}
          </div>

          <p className="mt-12 border-t border-ink/20 pt-6 text-[14px] leading-5 text-muted">Poslední aktualizace: {LEGAL_UPDATED}</p>
        </div>
      </article>
    </>
  )
}

function Paragraphs({ items }: { items?: string[] }) {
  return items?.map((paragraph) => (
    <p key={paragraph} className="mt-3">
      {nb(paragraph)}
    </p>
  ))
}

function List({ items }: { items?: string[] }) {
  if (!items) return null
  return (
    <ul className="mt-3 grid list-disc gap-1.5 pl-5 marker:text-terracotta">
      {items.map((item) => (
        <li key={item}>{nb(item)}</li>
      ))}
    </ul>
  )
}

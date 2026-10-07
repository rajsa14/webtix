import { XIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { SITE } from '../data/site'
import { useT } from '../i18n'
import { nb } from '../lib/text'

export type LegalDoc = 'privacy' | 'terms'

/*
 * Draft legal texts live in i18n (legal). Review them before the site goes
 * live, ideally with someone who knows GDPR and Czech consumer law.
 */
export function LegalDialog({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const t = useT()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (doc && !dialog.open) dialog.showModal()
    if (!doc && dialog.open) dialog.close()
  }, [doc])

  const content = doc ? { title: t.legal[doc].title, sections: t.legal[doc].sections(SITE.email) } : null

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="legal-title"
      className="m-auto w-[calc(100%-24px)] max-w-2xl rounded-card border border-line-strong bg-ink-900 p-0 text-fg backdrop:bg-fg/45 backdrop:backdrop-blur-sm"
    >
      {content && (
        <div className="max-h-[82dvh] overflow-y-auto p-7 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <h2 id="legal-title" className="text-[1.9rem] font-semibold leading-tight tracking-[-0.025em]">
              {content.title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.legal.close}
              autoFocus
              className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
            >
              <XIcon size={18} />
            </button>
          </div>
          <div className="mt-6 grid gap-6">
            {content.sections.map((s) => (
              <section key={s.h}>
                <h3 className="font-sans text-[15px] font-semibold text-fg">{s.h}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{nb(s.p)}</p>
              </section>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-muted">{t.legal.updated(SITE.year)}</p>
        </div>
      )}
    </dialog>
  )
}

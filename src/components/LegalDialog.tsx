import { XIcon } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'
import { SITE } from '../data/site'
import { nb } from '../lib/text'

export type LegalDoc = 'privacy' | 'terms'

/*
 * Draft legal texts. Review them before the site goes live, ideally with
 * someone who knows GDPR and Czech consumer law.
 */
const DOCS: Record<LegalDoc, { title: string; sections: { h: string; p: string }[] }> = {
  privacy: {
    title: 'Ochrana osobních údajů',
    sections: [
      {
        h: 'Kdo údaje zpracovává',
        p: `WebTix, tedy Richard Buchníček a Daniel Švéda. Kontaktovat nás můžete na ${SITE.email}.`,
      },
      {
        h: 'Jaké údaje zpracováváme',
        p: 'Údaje, které vyplníte ve formuláři: jméno, název firmy, e-mail, telefon (pokud ho uvedete), informace o projektu, rozpočet, termín a váš výběr z katalogu.',
      },
      {
        h: 'Proč je zpracováváme',
        p: 'Abychom mohli odpovědět na vaši poptávku, připravit ukázku a nabídku. Údaje nepoužíváme k marketingu a neprodáváme je. Pro doručení zprávy může být použita e-mailová služba, přes kterou formulář odesíláme.',
      },
      {
        h: 'Váš výběr v prohlížeči',
        p: 'Položky, které si v katalogu označíte, se ukládají jen ve vašem prohlížeči (localStorage), aby nezmizely po obnovení stránky. K nám se dostanou až ve chvíli, kdy odešlete formulář. Smazat je můžete tlačítkem Vymazat v panelu Můj výběr.',
      },
      {
        h: 'Vaše práva',
        p: `Můžete nás požádat o přístup k údajům, jejich opravu nebo výmaz. Stačí napsat na ${SITE.email}.`,
      },
    ],
  },
  terms: {
    title: 'Obchodní podmínky',
    sections: [
      {
        h: 'Poptávka je nezávazná',
        p: 'Odesláním výběru a formuláře nevzniká žádná smlouva ani povinnost cokoliv platit.',
      },
      {
        h: 'Cena a rozsah',
        p: 'Cenu, rozsah prací a termín vždy domlouváme individuálně. Před zahájením práce vše potvrdíme písemně.',
      },
      {
        h: 'Ukázka webu',
        p: 'Ukázka připravená podle vašeho výběru slouží k odsouhlasení směru designu. Počet úprav a podmínky předání webu jsou součástí nabídky.',
      },
      {
        h: 'Fotografie v katalogu',
        p: 'Fotografie v katalogu jsou ilustrační a pocházejí z Unsplash. Pro váš web použijeme vlastní nebo řádně licencované snímky.',
      },
    ],
  },
}

export function LegalDialog({ doc, onClose }: { doc: LegalDoc | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (doc && !dialog.open) dialog.showModal()
    if (!doc && dialog.open) dialog.close()
  }, [doc])

  const content = doc ? DOCS[doc] : null

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
              aria-label="Zavřít"
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
          <p className="mt-8 text-[13px] text-muted">Poslední aktualizace: {SITE.year}</p>
        </div>
      )}
    </dialog>
  )
}

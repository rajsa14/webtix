import { MANAGEMENT_CMS_FROM, MANAGEMENT_EDITS_FROM, kc, previewDaysStart } from './site'

/**
 * The four questions in "Cena" (src/components/home/Price.tsx), Dan's text
 * (2026-10-10). The homepage's structured data (src/lib/structuredData.ts)
 * repeats them word for word, so change them only here.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Co když se mi návrh nelíbí?',
    a: 'Návrh je zdarma a nezávazný: dostanete hotovou úvodní stránku svého nového webu. Nic nepodepisujete a nic neplatíte.',
  },
  {
    q: 'Jak dlouho to celé trvá?',
    a: `${previewDaysStart()}, jakmile nám pošlete podklady, třeba odkaz na váš stávající web.`,
  },
  {
    q: 'Můžu si web pak upravovat sám?',
    a: `Ano. S redakčním systémem (CMS) si web upravujete sami a správa stojí od ${kc(MANAGEMENT_CMS_FROM)} měsíčně. Nebo úpravy děláme za vás, od ${kc(MANAGEMENT_EDITS_FROM)} měsíčně.`,
  },
  {
    q: 'Co doména a hosting?',
    a: 'Pokud už je máte, web na ně přesuneme. Pokud ne, zařídíme všechno za vás.',
  },
]

import { previewDaysGenitive } from './site'

/** Pricing FAQ approved by Dan (2026-10-11). Shared with structured data and llms.txt.
 * Supplementary Care, handover and domain wording approved for deployment (2026-10-11).
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'Co když se mi návrh nelíbí?',
    a: 'Návrh je zdarma a nezávazný: dostanete hotovou úvodní stránku svého nového webu. Nic nepodepisujete a nic neplatíte.',
  },
  {
    q: 'Co je v ceně vytvoření webu?',
    a: 'Každý web navrhujeme od začátku. Cena zahrnuje návrh, vývoj, mobilní verzi, základní SEO a spuštění. Podle projektu může zahrnovat také kontaktní formulář, úpravu vašich textů, menu, ceníky nebo základní animace. Fotografie dodáváte vy. Přesný rozsah i cenu si odsouhlasíme předem.',
  },
  {
    q: 'Kdy uvidím první návrh?',
    a: `Návrh úvodní stránky vám ukážeme do ${previewDaysGenitive()} od dodání podkladů. Termín dokončení celého webu domluvíme podle rozsahu.`,
  },
  {
    q: 'Můžu si web upravovat sám?',
    a: 'Pokud chcete, můžeme web postavit s CMS. V něm můžete měnit texty a fotografie, ale ne design nebo rozložení webu. CMS je potřeba zvolit už při přípravě projektu. Care je dostupný i pro web bez CMS. Úpravy obsahu od nás v něm nejsou zahrnuté, ale můžete si je objednat zvlášť.',
  },
  {
    q: 'Co zahrnuje Care+?',
    a: 'Až 30 minut drobných změn obsahu měsíčně, například otevírací dobu, ceny, texty, fotografie, menu nebo kontaktní údaje. Nevyužitý čas se nepřevádí. Nové stránky, funkce nebo větší změny naceníme zvlášť.',
  },
  {
    q: 'Musím platit měsíční správu?',
    a: 'Ne. Web je váš. Pokud správu ukončíte, předáme vám web a doménu pro provoz jinde. Náš hosting, technická péče, podpora a průběžné úpravy tím končí. Web předáváme jako zdrojový kód nebo repozitář. Případné placené služby třetích stran převezmete a hradíte sami, nebo se jejich provoz ukončí.',
  },
  {
    q: 'Jak je to s doménou?',
    a: 'Doména je vždy vaše. Pokud ji už máte, připojíme ji bez samostatného poplatku za připojení. Pokud ne, registraci můžeme zařídit za vás. Registrace a obnova domény se platí zvlášť podle ceny poskytovatele.',
  },
]

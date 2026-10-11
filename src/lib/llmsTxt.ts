import { CASES } from '../data/cases'
import { FAQ } from '../data/faq'
import { ADASTRA_URL, HOME_META, INQUIRY_ANCHOR, MANAGEMENT_CMS_FROM, MANAGEMENT_EDITS_FROM, PAGES, SITE, kc, previewDaysWords, priceText } from '../data/site'
import { team } from '../data/team'

/*
 * webtix.cz/llms.txt: a plain-text summary of the site for AI assistants
 * (llmstxt.org). Every sentence is the site's own copy (approved by Dan,
 * 2026-10-11); prices, days, questions and bios come from the same data as
 * the page. The process steps and section intros repeat the copy in
 * HowWeWork.tsx, Team.tsx and ContactForm.tsx: change them there and here.
 * scripts/prerender.mjs writes it to dist/llms.txt.
 */

const nbsp = (s: string) => s.replace(/ /g, ' ')

export function llmsTxt() {
  const adastra = CASES.find((c) => c.real)
  const lines = [
    `# ${SITE.name}`,
    '',
    `> Webové studio · Praha. ${HOME_META.description}`,
    '',
    '## Jak to děláme',
    '',
    `Od odkazu k hotovému návrhu za ${previewDaysWords()}. Nepotřebujeme od vás zadání ani schůzku. Stačí odkaz na to, co už máte.`,
    '',
    '1. Pošlete odkaz: Web, Instagram, nebo jen název podniku.',
    '2. Postavíme první stránku: Z vašich fotek, textů a menu. Na vlastní adrese, ne v PDF.',
    '3. Rozhodnete se: Líbí se vám? Domluvíme cenu a dokončíme zbytek. Nelíbí? Nic neplatíte.',
    '',
    '## Cena',
    '',
    `- Web od ${priceText()}. Za hotový web. Přesnou částku znáte dřív, než cokoli podepíšete.`,
    `- Správa webu: S CMS od ${kc(MANAGEMENT_CMS_FROM)} měsíčně · S úpravami od nás od ${kc(MANAGEMENT_EDITS_FROM)} měsíčně`,
    '',
    '## Časté otázky',
    '',
    ...FAQ.map(({ q, a }) => `- ${q} ${a}`),
    '',
    '## Kdo jsme',
    '',
    'Dva lidé. Mluvíte přímo s námi. Žádný account manager. Kdo váš web navrhne, ten vám ho taky ukáže.',
    '',
    ...team.map((person) => `- ${person.name}: ${person.bio}`),
    '',
    '## Návrhy',
    '',
    'Café AdAstra je skutečný návrh. Ostatní podniky jsme si vymysleli, chyby jsou ale skutečné a vídáme je pořád.',
    '',
    ...(adastra ? [`- [${adastra.name}](${ADASTRA_URL}): ${adastra.kind} · ${adastra.city}. ${adastra.fix}`] : []),
    '- Šlapadlo (servis kol v ukázce na úvodní stránce): Podnik jsme si vymysleli, chyby jsou skutečné.',
    '',
    '## Kontakt',
    '',
    `- [Poptávka](${SITE.url}/#${INQUIRY_ANCHOR}): Pošlete odkaz. Zbytek je na nás. Ozveme se do dvou pracovních dnů.`,
    `- E-mail: ${SITE.email}`,
    '',
    '## Další stránky',
    '',
    `- [Ochrana osobních údajů](${SITE.url}${PAGES.privacy})`,
    `- [Obchodní podmínky](${SITE.url}${PAGES.terms})`,
    '',
  ]
  return nbsp(lines.join('\n'))
}

import { CASES } from '../data/cases'
import { FAQ } from '../data/faq'
import { ADASTRA_URL, BUSINESS_PRICE_MIN, BUSINESS_PRICE_MAX, HOME_META, INQUIRY_ANCHOR, CARE_MONTHLY, CARE_PLUS_MONTHLY, PAGES, SITE, kc, previewDaysWords, priceText } from '../data/site'
import { team } from '../data/team'

/*
 * webtix.cz/llms.txt: a plain-text summary of the site for AI assistants
 * (llmstxt.org). Every sentence is the site's own copy (approved by Dan,
 * 2026-10-11); prices, days, questions and responsibilities come from the same data as
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
    `- Běžný firemní web: ${kc(BUSINESS_PRICE_MIN)} až ${kc(BUSINESS_PRICE_MAX)}. Nejčastější cena podle rozsahu, obsahu a funkcí.`,
    `- Jednoduchý jednostránkový web od ${priceText()}. Pro menší web, kde vše důležité funguje na jedné stránce.`,
    '- Složitější weby a funkce naceníme individuálně. Přesnou cenu znáte předem. Návrh úvodní stránky je zdarma a k ničemu vás nezavazuje.',
    '- První měsíc se o web staráme my. Zdarma. Hosting, technická péče, podpora a drobné úpravy jsou první měsíc na nás.',
    `- Webtix Care: ${kc(CARE_MONTHLY)} / měsíc. Hosting, technická péče, opravy chyb a podpora. Pokud má web CMS, texty a fotky si můžete upravovat sami.`,
    `- Webtix Care+: ${kc(CARE_PLUS_MONTHLY)} / měsíc. Všechno z Care + až 30 minut drobných úprav obsahu každý měsíc.`,
    '- Nechcete měsíční správu? Nemusíte. Web je váš. Nezamykáme vás u nás. Předáme vám web i doménu pro provoz jinde. Náš hosting, technická péče a podpora tím končí.',
    '- Registrace a obnova domény se platí zvlášť.',
    '',
    '## Časté otázky',
    '',
    ...FAQ.map(({ q, a }) => `- ${q} ${a}`),
    '',
    '## Kdo jsme',
    '',
    'Dva lidé. Mluvíte přímo s námi. Jsme Daniel a Richard, malé webové studio z Prahy. Váš web navrhujeme a stavíme my dva.',
    '',
    ...team.map((person) => `- ${person.name} — ${person.role}: ${person.responsibilities.join(' ')}`),
    '',
    'Jak může začít naše domluva (ukázkový rozhovor):',
    'Vy: S kým budu řešit svůj web?',
    'Richard: Se mnou. Domluvíme se, co potřebujete, a postarám se o vývoj. Daniel navrhne, jak bude váš web vypadat a působit.',
    '',
    'Dva lidé. Přímá domluva. Bez prostředníků.',
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

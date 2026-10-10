import { OPERATOR } from './site'

export type LegalDoc = 'privacy' | 'terms'

interface LegalSection {
  h: string
  /** Paragraphs. */
  p: string[]
  /** Optional bullet list shown under the paragraphs. */
  list?: string[]
}

/*
 * Legal texts, describing the site as it runs today: Cloudflare Workers,
 * Cloudflare Web Analytics, enquiries by e-mail through Resend. Review them
 * before relying on them, ideally with someone who knows GDPR and Czech
 * consumer law. The operator is named in OPERATOR (src/data/site.ts); its
 * registration details follow once the company is registered.
 */
export const LEGAL_UPDATED = '10. 10. 2026'

export const LEGAL: Record<LegalDoc, { title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Ochrana osobních údajů',
    intro: 'Stručně a srozumitelně: jaké údaje od vás máme, proč je máme a co s nimi můžete udělat.',
    sections: [
      {
        h: 'Kdo údaje spravuje',
        p: [
          `Správcem údajů je ${OPERATOR.name}, tedy Richard Buchníček a Daniel Švéda. S čímkoliv ohledně vašich údajů nám napište na ${OPERATOR.email}.`,
        ],
      },
      {
        h: 'Jaké údaje zpracováváme',
        p: ['Jen ty, které nám sami pošlete formulářem:'],
        list: [
          'jméno',
          'e-mail',
          'adresu vašeho webu nebo profilu na Instagramu, případně název podniku. Podíváme se jen na to, co je na ní veřejně, abychom vám mohli připravit návrh.',
          'zprávu, pokud ji napíšete',
        ],
      },
      {
        h: 'Proč a na jakém základě',
        p: [
          'Údaje z formuláře potřebujeme, abychom mohli odpovědět na vaši poptávku a připravit ukázku a nabídku. Právním základem je jednání o smlouvě na vaši žádost (čl. 6 odst. 1 písm. b GDPR).',
          'Údaje nepoužíváme k reklamě, neprodáváme je a neposíláme vám nevyžádané zprávy.',
        ],
      },
      {
        h: 'Jak dlouho údaje uchováváme',
        p: [
          'Poptávku uchováváme po dobu, kdy spolu jednáme, a nejdéle dva roky od poslední zprávy. Pokud spolu uzavřeme smlouvu, uchováváme doklady po dobu, kterou ukládá zákon.',
        ],
      },
      {
        h: 'Kdo další údaje vidí',
        p: ['K provozu webu používáme tyto služby. Údaje dostanou jen v rozsahu, který potřebují:'],
        list: [
          'Cloudflare (hosting a doručování webu přes Cloudflare Workers, přes které prochází i odeslaný formulář)',
          `Resend (odeslání poptávky e-mailem do naší schránky ${OPERATOR.email})`,
          'Google (Google Workspace, kde v naší schránce poptávky čteme)',
        ],
      },
      {
        h: 'Cookies a úložiště prohlížeče',
        p: ['Web neukládá do vašeho prohlížeče žádné cookies ani jiné údaje.'],
      },
      {
        h: 'Měření návštěvnosti',
        p: [
          'Návštěvnost měříme nástrojem Cloudflare Web Analytics. Nenastavuje žádné cookies a nevytváří profil návštěvníka. Vidíme jen souhrnné údaje, například počet zobrazení stránek, typ zařízení a web, ze kterého jste přišli.',
        ],
      },
      {
        h: 'Vaše práva',
        p: [`Stačí napsat na ${OPERATOR.email}. Máte právo:`],
        list: [
          'zjistit, jaké údaje o vás máme, a dostat jejich kopii',
          'nechat údaje opravit nebo smazat',
          'omezit zpracování nebo proti němu vznést námitku',
          'podat stížnost u Úřadu pro ochranu osobních údajů (uoou.gov.cz)',
        ],
      },
    ],
  },
  terms: {
    title: 'Obchodní podmínky',
    intro: 'Pravidla, podle kterých funguje tento web a naše spolupráce.',
    sections: [
      {
        h: 'Kdo web provozuje',
        p: [`Web provozuje ${OPERATOR.name}, tedy Richard Buchníček a Daniel Švéda. Kontakt: ${OPERATOR.email}.`],
      },
      {
        h: 'Poptávka je nezávazná',
        p: ['Odesláním formuláře nevzniká žádná smlouva ani povinnost cokoliv platit.'],
      },
      {
        h: 'Cena a rozsah',
        p: [
          'Cenu, rozsah prací a termín vždy domlouváme individuálně. Před zahájením práce vše potvrdíme písemně. Smlouva vzniká až tímto potvrzením.',
        ],
      },
      {
        h: 'Ukázka webu',
        p: [
          'Návrh úvodní stránky, který vám ukážeme, slouží k odsouhlasení směru designu. Počet úprav a podmínky předání webu jsou součástí nabídky.',
        ],
      },
      {
        h: 'Obsah webu',
        p: [
          'Texty, grafika a kód tohoto webu patří Webtix. Bez našeho souhlasu je prosím nekopírujte.',
        ],
      },
      {
        h: 'Změny podmínek',
        p: ['Podmínky můžeme upravit. Platí vždy znění zveřejněné na této stránce.'],
      },
    ],
  },
}

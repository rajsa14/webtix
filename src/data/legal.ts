import { SITE } from './site'

export type LegalDoc = 'privacy' | 'terms'

interface LegalSection {
  h: string
  /** Paragraphs. */
  p: string[]
  /** Optional bullet list shown under the paragraphs. */
  list?: string[]
}

/*
 * Draft legal texts. Review them before relying on them, ideally with someone
 * who knows GDPR and Czech consumer law. Still missing: the operator's
 * identification (IČO and address), which Czech law requires on a business site.
 */
export const LEGAL_UPDATED = '9. 10. 2026'

export const LEGAL: Record<LegalDoc, { title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Ochrana osobních údajů',
    intro: 'Stručně a srozumitelně: jaké údaje od vás máme, proč je máme a co s nimi můžete udělat.',
    sections: [
      {
        h: 'Kdo údaje spravuje',
        p: [
          `Správcem údajů je ${SITE.name}, tedy Richard Buchníček a Daniel Švéda. S čímkoliv ohledně vašich údajů nám napište na ${SITE.email}.`,
        ],
      },
      {
        h: 'Jaké údaje zpracováváme',
        p: ['Jen ty, které nám sami pošlete formulářem:'],
        list: [
          'jméno a název firmy',
          'e-mail a telefon (telefon jen pokud ho uvedete)',
          'informace o projektu, rozpočet, termín a odkazy na inspiraci',
          'váš výběr z katalogu',
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
          'Netlify (hosting webu, příjem formuláře a jeho doručení do naší schránky)',
          'poskytovatel naší e-mailové schránky, kde poptávky čteme',
          'Unsplash (ilustrační fotografie se načítají z jejich serverů, které při tom vidí vaši IP adresu)',
        ],
      },
      {
        h: 'Cookies a úložiště prohlížeče',
        p: [
          'Web nepoužívá reklamní cookies ani nástroje třetích stran. Ve vašem prohlížeči ukládáme jen toto:',
        ],
        list: [
          'váš výběr z katalogu, aby nezmizel po obnovení stránky (nezbytné)',
          'vaši volbu ohledně statistik (nezbytné)',
          'náhodný identifikátor návštěvníka, jen pokud povolíte statistiky',
        ],
      },
      {
        h: 'Měření návštěvnosti',
        p: [
          'Návštěvnost si měříme sami, bez Google Analytics a podobných služeb. Počítáme zobrazení stránek, typ zařízení a web, ze kterého jste přišli. IP adresu neukládáme.',
          'Pokud povolíte statistiky, uložíme ve vašem prohlížeči náhodný identifikátor, podle kterého poznáme opakovanou návštěvu. Nespojujeme ho s vaším jménem ani e-mailem. Souhlas můžete kdykoliv změnit odkazem Nastavení cookies v patičce.',
        ],
      },
      {
        h: 'Vaše práva',
        p: [`Stačí napsat na ${SITE.email}. Máte právo:`],
        list: [
          'zjistit, jaké údaje o vás máme, a dostat jejich kopii',
          'nechat údaje opravit nebo smazat',
          'omezit zpracování nebo proti němu vznést námitku',
          'odvolat souhlas se statistikami',
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
        p: [`Web provozuje ${SITE.name}, tedy Richard Buchníček a Daniel Švéda. Kontakt: ${SITE.email}.`],
      },
      {
        h: 'Poptávka je nezávazná',
        p: ['Odesláním výběru a formuláře nevzniká žádná smlouva ani povinnost cokoliv platit.'],
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
          'Ukázka připravená podle vašeho výběru slouží k odsouhlasení směru designu. Počet úprav a podmínky předání webu jsou součástí nabídky.',
        ],
      },
      {
        h: 'Fotografie v katalogu',
        p: [
          'Fotografie v katalogu jsou ilustrační a pocházejí z Unsplash. Pro váš web použijeme vlastní nebo řádně licencované snímky.',
        ],
      },
      {
        h: 'Obsah webu',
        p: [
          'Texty, grafika a kód tohoto webu patří WebTix. Bez našeho souhlasu je prosím nekopírujte.',
        ],
      },
      {
        h: 'Změny podmínek',
        p: ['Podmínky můžeme upravit. Platí vždy znění zveřejněné na této stránce.'],
      },
    ],
  },
}

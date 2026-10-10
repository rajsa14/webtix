import { OPERATOR, previewDaysGenitive } from './site'

export type LegalDoc = 'privacy' | 'terms'

interface LegalSection {
  h: string
  /** Paragraphs. */
  p?: string[]
  /** Lettered parts (a, b, …), each a heading and a list. Shown after the paragraphs. */
  parts?: { h: string; list: string[] }[]
  /** Optional bullet list shown under the paragraphs. */
  list?: string[]
  /** Paragraphs shown after the list. */
  after?: string[]
}

/*
 * Legal texts from docs/legal-text.md (a draft: a lawyer should review it
 * before launch). The operator and e-mail come from OPERATOR in site.ts.
 *
 * Facts behind section 2b (checked 2026-10-10):
 * - worker/index.ts stores nothing itself (no KV, D1 or other storage). The form
 *   content goes out by e-mail through Resend.
 * - The rate limiter (wrangler.jsonc, INQUIRY_LIMITER) counts submissions per
 *   IP address, 5 per 60 s. Cloudflare keeps the counter only in the location
 *   that handled the request.
 * - observability.enabled = true: Workers Logs store each /api/* request with
 *   its IP address, user agent and IP-based location. Retention: 3 days on
 *   Workers Free, 7 days on Workers Paid (Cloudflare docs, Workers Logs).
 * Transfers (section 3): Cloudflare and Resend DPAs name the EU-US DPF and the
 * EU SCCs; Google LLC is DPF-certified and its Workspace DPA uses the SCCs.
 */
export const LEGAL_UPDATED = '10. 10. 2026'

export const LEGAL: Record<LegalDoc, { title: string; intro: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Ochrana osobních údajů',
    intro: 'Stručně a srozumitelně: jaké údaje od vás máme, proč je máme a co s nimi můžete udělat.',
    sections: [
      {
        h: '1. Kdo vaše údaje spravuje',
        p: [
          `Správcem osobních údajů je ${OPERATOR.name}, tedy Richard Buchníček a Daniel Švéda (dále „my“).`,
          `Kontakt pro všechny dotazy k ochraně údajů: ${OPERATOR.email}.`,
        ],
      },
      {
        h: '2. Jaké údaje zpracováváme, proč a jak dlouho',
        parts: [
          {
            h: 'a) Vaše poptávka a příprava návrhu',
            list: [
              'Údaje: jméno, e-mail, adresa vašeho webu nebo profilu na sociální síti, případně název podniku, a zpráva, pokud ji napíšete.',
              'Účel: odpovědět vám a připravit ukázkový návrh. Podíváme se jen na to, co je na vašem webu nebo profilu veřejně dostupné.',
              'Právní základ: kroky před uzavřením smlouvy na vaši žádost (čl. 6 odst. 1 písm. b) nařízení GDPR).',
              'Doba: nejdéle 12 měsíců od posledního kontaktu, pokud nedojde ke spolupráci. Pak údaje smažeme.',
            ],
          },
          {
            h: 'b) Ochrana webu před zneužitím',
            list: [
              'Údaje: při odeslání formuláře vaše IP adresa, typ prohlížeče, přibližná poloha odvozená z IP adresy (například země a město) a čas odeslání.',
              'Podle IP adresy počítáme, kolikrát byl formulář odeslán (nejvýše pětkrát za minutu). Toto počítadlo vede jen datové centrum Cloudflare, které požadavek zpracovalo, a jinam ho neukládáme.',
              'Technické záznamy o odeslání formuláře se ukládají u Cloudflare a nejpozději po 7 dnech se samy smažou. Obsah formuláře na webu neukládáme, odchází e-mailem.',
              'Účel: zabránit spamu a přetěžování formuláře.',
              'Právní základ: náš oprávněný zájem na bezpečném provozu webu (čl. 6 odst. 1 písm. f) GDPR).',
            ],
          },
          {
            h: 'c) Měření návštěvnosti',
            list: [
              'Nástroj: Cloudflare Web Analytics. Nenastavuje cookies ani neukládá nic do vašeho zařízení a nevytváří profil návštěvníka.',
              'Vidíme jen souhrnné údaje, například počet zobrazení stránek, typ zařízení a web, ze kterého jste přišli.',
              'Právní základ: náš oprávněný zájem zjistit, jak web funguje (čl. 6 odst. 1 písm. f) GDPR). Můžete vznést námitku (viz Vaše práva).',
            ],
          },
          {
            h: 'd) Spolupráce a účetnictví (pokud k ní dojde)',
            list: [
              'Údaje: fakturační a kontaktní údaje, které nám pro spolupráci sdělíte.',
              'Účel: plnění smlouvy, fakturace a splnění zákonných povinností.',
              'Právní základ: plnění smlouvy a zákonná povinnost (čl. 6 odst. 1 písm. b) a c) GDPR).',
              'Doba: po dobu spolupráce a poté po dobu stanovenou zákonem (účetní doklady 10 let).',
            ],
          },
        ],
      },
      {
        h: '3. Komu údaje předáváme',
        p: ['Údaje zpracovávají naši dodavatelé, kteří pro nás zajišťují provoz:'],
        list: [
          'Cloudflare, Inc. (hosting a doručování webu, přes které prochází i odeslaný formulář, a měření návštěvnosti),',
          'Resend, Inc. (odeslání poptávky e-mailem do naší schránky),',
          'Google LLC (Google Workspace, naše e-mailová schránka, kde poptávky čteme).',
        ],
        after: [
          'Tito dodavatelé mohou údaje zpracovávat ve Spojených státech. Všichni tři jsou certifikováni v rámci EU–US Data Privacy Framework, takže předání je zajištěno rozhodnutím Evropské komise o odpovídající ochraně. Jejich smlouvy o zpracování údajů navíc obsahují standardní smluvní doložky.',
          'Údaje neprodáváme a nepředáváme je nikomu dalšímu, pokud nám to neukládá zákon.',
        ],
      },
      {
        h: '4. Musíte nám údaje poskytnout?',
        p: ['Ne, je to dobrovolné. Bez jména a e-mailu vám ale nemůžeme odpovědět.'],
      },
      {
        h: '5. Automatizované rozhodování',
        p: ['Neprovádíme žádné automatizované rozhodování ani profilování.'],
      },
      {
        h: '6. Cookies',
        p: ['Web neukládá do vašeho prohlížeče žádné cookies ani jiné údaje.'],
      },
      {
        h: '7. Vaše práva',
        p: ['Podle GDPR máte právo:'],
        list: [
          'na přístup ke svým údajům,',
          'na opravu nepřesných údajů,',
          'na výmaz,',
          'na omezení zpracování,',
          'na přenositelnost údajů,',
          'vznést námitku proti zpracování založenému na oprávněném zájmu.',
        ],
        after: [`Stačí napsat na ${OPERATOR.email}. Odpovíme nejpozději do jednoho měsíce.`],
      },
      {
        h: '8. Stížnost',
        p: [
          'Pokud se domníváte, že s údaji nakládáme nesprávně, můžete podat stížnost u Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, www.uoou.gov.cz.',
        ],
      },
    ],
  },
  terms: {
    title: 'Obchodní podmínky a podmínky používání webu',
    intro: 'Pravidla, podle kterých funguje tento web a naše spolupráce.',
    sections: [
      {
        h: '1. Kdo web provozuje',
        p: [`Web provozuje ${OPERATOR.name}, tedy Richard Buchníček a Daniel Švéda. Kontakt: ${OPERATOR.email}.`],
      },
      {
        h: '2. Pro koho jsou naše služby',
        p: [
          'Naše služby jsou určeny především podnikatelům a firmám. Pokud jste spotřebitel, nejsou těmito podmínkami dotčena vaše zákonná práva.',
        ],
      },
      {
        h: '3. Poptávka je nezávazná',
        p: ['Odesláním formuláře nevzniká žádná smlouva ani povinnost cokoliv platit. Web sám smlouvu neuzavírá.'],
      },
      {
        h: '4. Návrh zdarma',
        list: [
          'Na základě vaší poptávky vám zdarma a nezávazně připravíme návrh úvodní stránky vašeho nového webu.',
          `Lhůta ${previewDaysGenitive()} začíná běžet, jakmile nám pošlete podklady, například odkaz na váš stávající web.`,
          'Vycházíme jen z veřejně dostupných informací a z podkladů, které nám sami pošlete. Vaše podklady nikomu nepředáváme a nepoužijeme je jinak než pro váš návrh.',
          'Návrh slouží k odsouhlasení směru designu. Autorská práva k návrhu zůstávají nám. Bez uzavření smlouvy a zaplacení ho nesmíte zveřejnit ani používat.',
        ],
      },
      {
        h: '5. Cena',
        p: [
          'Uváděné ceny („od …“) jsou orientační. Přesnou cenu a rozsah práce vám sdělíme v písemné nabídce dříve, než cokoli podepíšete, včetně informace o DPH.',
        ],
      },
      {
        h: '6. Uzavření smlouvy',
        p: [
          'Spolupráce vzniká až samostatnou písemnou smlouvou nebo odsouhlasením naší písemné nabídky. Podmínky konkrétní spolupráce (rozsah, cena, lhůty, předání webu, licence, správa) jsou pak v ní.',
        ],
      },
      {
        h: '7. Ukázky na webu',
        list: [
          'Šlapadlo je vymyšlený podnik. Chyby, které na něm ukazujeme, jsou ale skutečné a typické.',
          'Ukázku Café AdAstra zveřejňujeme s písemným souhlasem majitelky.',
        ],
      },
      {
        h: '8. Obsah webu',
        p: [
          'Texty, grafika a kód tohoto webu jsou naším dílem. Bez našeho souhlasu je nekopírujte. Obsah webu je informativní a snažíme se, aby byl aktuální a přesný.',
        ],
      },
      {
        h: '9. Reklamace a spory',
        p: [
          'Pokud jste spotřebitel, můžete se při sporu obrátit na Českou obchodní inspekci (www.coi.cz, www.adr.coi.cz), která řeší spotřebitelské spory mimosoudně. Naše vztahy se řídí právem České republiky.',
        ],
      },
      {
        h: '10. Změny podmínek',
        p: ['Tyto podmínky můžeme změnit. Platí vždy verze zveřejněná na webu v den odeslání vaší poptávky.'],
      },
    ],
  },
}

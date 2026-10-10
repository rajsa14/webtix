/**
 * The case-study gallery ("Ukázky"): six invented businesses, like Šlapadlo.
 * The page says so ("Podniky jsme si vymysleli"); never present them as
 * clients. Results describe what the new site does, never invented numbers.
 * Draft copy (2026-10-10), waiting for approval.
 */

export interface OldSiteLook {
  title: string
  subtitle: string
  /** Header gradient, top to bottom: old sites loved these. */
  header: [string, string]
  titleColor: string
  titleFont: string
  /** The blinking announcement. */
  shout: string
  body: string
  links: string[]
  /** The broken or outdated bit in the middle. */
  broken: string
  updated: string
}

export interface NewSiteLook {
  bg: string
  fg: string
  accent: string
  /** Text colour on the accent (buttons). */
  onAccent: string
  panel: string
  panelFg: string
  font: 'archivo' | 'serif' | 'sans'
  logo: string
  meta: string
  badge: string
  headline: string
  sub: string
  cta: string
  /** A price list, or three tiles with a label each. */
  bottom: { kind: 'list'; title: string; rows: [string, string][] } | { kind: 'tiles'; title: string; tiles: [string, string][] }
}

export interface CaseStudy {
  id: string
  name: string
  kind: string
  city: string
  /** Red-pen note about the old site. */
  note: string
  /** One line about what the new site does. */
  result: string
  old: OldSiteLook
  new: NewSiteLook
}

export const CASES: CaseStudy[] = [
  {
    id: 'zrnko',
    name: 'Zrnko',
    kind: 'Kavárna',
    city: 'Brno',
    note: 'Menu jako .doc ke stažení.',
    result: 'Dnešní menu a otevírací doba hned nahoře.',
    old: {
      title: 'Kavárna ZRNKO',
      subtitle: '~ vítejte na stránkách naší kavárny ~',
      header: ['#6B3A1E', '#C98B4A'],
      titleColor: '#FFF3C4',
      titleFont: "'Comic Sans MS','Comic Sans',cursive",
      shout: '*** NOVĚ WIFI ZDARMA ***',
      body: 'Nabízíme kávu, čaj, zákusky a příjemné posezení v centru města. Těšíme se na Vaši návštěvu.',
      links: ['Úvod', 'Menu (DOC)', 'Galerie', 'Kontakt'],
      broken: 'jidelni_listek_2017.doc',
      updated: '3. 9. 2017',
    },
    new: {
      bg: '#2B1D16',
      fg: '#F3E6D3',
      accent: '#E3A85B',
      onAccent: '#2B1D16',
      panel: '#F3E6D3',
      panelFg: '#2B1D16',
      font: 'serif',
      logo: 'Zrnko',
      meta: 'Kavárna · Brno',
      badge: 'Otevřeno · do 19:00',
      headline: 'Káva, která vás vzbudí.',
      sub: 'Snídaně do 11:00, zákusky z vlastní pekárny.',
      cta: 'Menu na dnes',
      bottom: {
        kind: 'list',
        title: 'Dnes',
        rows: [
          ['Espresso', '55 Kč'],
          ['Flat white', '79 Kč'],
          ['Croissant', '65 Kč'],
        ],
      },
    },
  },
  {
    id: 'vlnka',
    name: 'Vlnka',
    kind: 'Kadeřnictví',
    city: 'Olomouc',
    note: 'Objednání jen telefonem 8–16.',
    result: 'Volné termíny na první pohled, rezervace na dvě klepnutí.',
    old: {
      title: 'Kadeřnictví VLNKA',
      subtitle: 'Váš salon krásy',
      header: ['#8E2B6E', '#E58CC2'],
      titleColor: '#FFFFFF',
      titleFont: "Georgia,'Times New Roman',serif",
      shout: '!!! AKCE NA MELÍR !!!',
      body: 'Objednávky přijímáme telefonicky v pracovní dny od 8 do 16 hodin. Online objednání není možné.',
      links: ['Úvod', 'Služby', 'Ceník', 'Kontakt'],
      broken: 'salon_foto.bmp',
      updated: '12. 1. 2016',
    },
    new: {
      bg: '#121212',
      fg: '#FFFFFF',
      accent: '#FF6FAE',
      onAccent: '#121212',
      panel: '#FFFFFF',
      panelFg: '#121212',
      font: 'archivo',
      logo: 'vlnka',
      meta: 'Salon · Olomouc',
      badge: 'Dnes 2 volné termíny',
      headline: 'Střih bez čekání.',
      sub: 'Vyberte si čas a kadeřnici. Potvrzení přijde hned.',
      cta: 'Rezervovat termín',
      bottom: {
        kind: 'list',
        title: 'Ceník',
        rows: [
          ['Dámský střih', '650 Kč'],
          ['Pánský střih', '350 Kč'],
          ['Barvení', 'od 1 200 Kč'],
        ],
      },
    },
  },
  {
    id: 'hoblik',
    name: 'Hoblík',
    kind: 'Truhlářství',
    city: 'Jihlava',
    note: 'Galerie: tři fotky z roku 2011.',
    result: 'Hotové kuchyně a skříně místo starých fotek.',
    old: {
      title: 'TRUHLÁŘSTVÍ HOBLÍK',
      subtitle: 'Výroba nábytku na zakázku',
      header: ['#2F4F2F', '#7FA36B'],
      titleColor: '#FFE9A8',
      titleFont: "'Arial Black',Arial,sans-serif",
      shout: '>>> ZAKÁZKY I O VÍKENDU <<<',
      body: 'Provádíme veškeré truhlářské práce. Ceny dohodou. Pro více informací nás kontaktujte.',
      links: ['Úvod', 'Fotogalerie', 'Reference', 'Kontakt'],
      broken: 'kuchyne1_2011.jpg',
      updated: '27. 6. 2013',
    },
    new: {
      bg: '#E9E2D3',
      fg: '#1F2A1E',
      accent: '#3E6B3A',
      onAccent: '#F4EFE4',
      panel: '#1F2A1E',
      panelFg: '#E9E2D3',
      font: 'sans',
      logo: 'Hoblík',
      meta: 'Truhlářství · Jihlava',
      badge: 'Termín od 3 týdnů',
      headline: 'Nábytek na míru, ne z katalogu.',
      sub: 'Kuchyně, vestavné skříně a schody z masivu.',
      cta: 'Poslat rozměry',
      bottom: {
        kind: 'tiles',
        title: 'Hotové práce',
        tiles: [
          ['#B88A5A', 'Kuchyně'],
          ['#8C6A47', 'Skříně'],
          ['#5E7A55', 'Schody'],
        ],
      },
    },
  },
  {
    id: 'buky',
    name: 'U Tří buků',
    kind: 'Penzion',
    city: 'Krkonoše',
    note: 'Ceník z roku 2019, rezervace e-mailem.',
    result: 'Volné pokoje a cena za noc bez psaní e-mailů.',
    old: {
      title: 'Penzion U Tří buků',
      subtitle: 'Ubytování v srdci Krkonoš',
      header: ['#1D3F7A', '#7FB2E8'],
      titleColor: '#FFFFFF',
      titleFont: "'Times New Roman',Times,serif",
      shout: 'VOLNÉ TERMÍNY - PIŠTE !!!',
      body: 'Nabízíme ubytování v útulných pokojích. Rezervace prosím e-mailem, odpovídáme do týdne.',
      links: ['Úvod', 'Pokoje', 'Ceník 2019', 'Kontakt'],
      broken: 'mapa_prijezdu.gif',
      updated: '5. 4. 2019',
    },
    new: {
      bg: '#1E2A44',
      fg: '#F2E9D8',
      accent: '#E2B04A',
      onAccent: '#1E2A44',
      panel: '#F2E9D8',
      panelFg: '#1E2A44',
      font: 'serif',
      logo: 'U Tří buků',
      meta: 'Penzion · Krkonoše',
      badge: 'Volno o víkendu',
      headline: 'Ráno hory, večer sauna.',
      sub: 'Šest pokojů, snídaně v ceně, parkování u domu.',
      cta: 'Volné termíny',
      bottom: {
        kind: 'list',
        title: 'Za noc',
        rows: [
          ['Dvoulůžkový', '1 900 Kč'],
          ['Rodinný', '2 600 Kč'],
          ['Apartmán', '3 200 Kč'],
        ],
      },
    },
  },
  {
    id: 'klic',
    name: 'Klíč',
    kind: 'Autoservis',
    city: 'Ostrava',
    note: 'Na mobilu se nedá nic přečíst.',
    result: 'Objednání auta z mobilu, ceny služeb na jedné obrazovce.',
    old: {
      title: 'AUTOSERVIS KLÍČ',
      subtitle: 'opravy všech značek',
      header: ['#3A3A3A', '#9A9A9A'],
      titleColor: '#FFDD00',
      titleFont: 'Impact,Haettenschweiler,sans-serif',
      shout: '* PNEUSERVIS * STK * ',
      body: 'Provádíme opravy osobních i užitkových vozidel všech značek, pneuservis a přípravu na STK.',
      links: ['Úvod', 'Služby', 'Kde nás najdete', 'Kontakt'],
      broken: 'dilna_panorama.jpg',
      updated: '18. 11. 2015',
    },
    new: {
      bg: '#F4F4F2',
      fg: '#141414',
      accent: '#FF5A1F',
      onAccent: '#141414',
      panel: '#141414',
      panelFg: '#F4F4F2',
      font: 'archivo',
      logo: 'KLÍČ',
      meta: 'Autoservis · Ostrava',
      badge: 'Volno zítra od 7:00',
      headline: 'STK, pneu, opravy.',
      sub: 'Objednejte auto online. Cenu víte předem.',
      cta: 'Objednat auto',
      bottom: {
        kind: 'list',
        title: 'Ceník',
        rows: [
          ['Přezutí', '590 Kč'],
          ['Olej a filtr', 'od 990 Kč'],
          ['Příprava na STK', '790 Kč'],
        ],
      },
    },
  },
  {
    id: 'kopretina',
    name: 'Kopretina',
    kind: 'Květinářství',
    city: 'Plzeň',
    note: 'Žádné ceny, jen „volejte“.',
    result: 'Kytice s cenou a doručením ještě týž den.',
    old: {
      title: 'Květinářství Kopretina',
      subtitle: 'Květiny pro každou příležitost',
      header: ['#3C7A3C', '#B5E3A1'],
      titleColor: '#FFFFFF',
      titleFont: "'Brush Script MT','Comic Sans MS',cursive",
      shout: '~~~ SVATEBNÍ KYTICE ~~~',
      body: 'Vážení zákazníci, pro informace o cenách a dostupnosti květin nás prosím kontaktujte telefonicky.',
      links: ['Úvod', 'O nás', 'Svatby', 'Kontakt'],
      broken: 'kytice_valentyn.jpg',
      updated: '14. 2. 2018',
    },
    new: {
      bg: '#FBF6EE',
      fg: '#23301F',
      accent: '#D4486B',
      onAccent: '#FFFFFF',
      panel: '#23301F',
      panelFg: '#FBF6EE',
      font: 'sans',
      logo: 'Kopretina',
      meta: 'Květiny · Plzeň',
      badge: 'Doručení ještě dnes',
      headline: 'Kytice až ke dveřím.',
      sub: 'Objednávky do 14:00 doručíme po Plzni týž den.',
      cta: 'Vybrat kytici',
      bottom: {
        kind: 'tiles',
        title: 'Oblíbené',
        tiles: [
          ['#E58AA0', '490 Kč'],
          ['#F2C14E', '650 Kč'],
          ['#9CC59A', '890 Kč'],
        ],
      },
    },
  },
]

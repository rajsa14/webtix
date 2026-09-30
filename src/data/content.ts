import { unsplash } from './imageStyles'

/** Example designs in the hero. Each one is a combination of catalog ids. */
export const heroShowcase = [
  {
    address: 'Bodoni Moda / Luxury / Split screen',
    font: 'bodoni',
    palette: 'luxury',
    layout: 'split',
    button: 'sharp',
    images: [unsplash('1600585154340-be6161a56a0c', 700)],
    content: {
      brand: 'Aurum',
      heading: 'Nadčasové bydlení',
      text: 'Architektura, která vydrží generace. Navrhujeme domy s příběhem.',
      cta: 'Prohlédnout',
    },
  },
  {
    address: 'Space Grotesk / Neon / Fullscreen',
    font: 'space-grotesk',
    palette: 'neon',
    layout: 'fullscreen',
    button: 'pill',
    images: [unsplash('1550745165-9bc0b252726f', 900)],
    content: {
      brand: 'Pulse Studio',
      heading: 'Zvuk bez kompromisů',
      text: 'Nahrávací studio pro hudbu, podcasty a reklamu.',
      cta: 'Rezervovat',
    },
  },
  {
    address: 'Fredoka / Nature / Bento',
    font: 'fredoka',
    palette: 'nature',
    layout: 'bento',
    button: 'rounded',
    images: [
      unsplash('1470071459604-3b5ec3a7fe05', 600),
      unsplash('1501785888041-af3ef285b470', 400),
      unsplash('1506905925346-21bda4d32df4', 400),
    ],
    content: {
      brand: 'Chata Lesní',
      heading: 'Klid uprostřed hor',
      text: 'Víkendy v přírodě pro celou rodinu.',
      cta: 'Rezervovat pobyt',
    },
  },
]

export const steps = [
  {
    number: '01',
    title: 'Prohlédnete si katalog',
    text: 'Projdete si různé možnosti designu a zjistíte, co se vám líbí.',
  },
  {
    number: '02',
    title: 'Vyberete si',
    text: 'Vyberete si například písmo, barvy, styl fotografií nebo celkový vzhled.',
  },
  {
    number: '03',
    title: 'Odešlete nám svou představu',
    text: 'Svůj výběr nám jednoduše odešlete přes formulář.',
  },
  {
    number: '04',
    title: 'Vytvoříme ukázku',
    text: 'Podle vaší představy připravíme návrh a následně se domluvíme na ceně a realizaci.',
  },
]

export const reasons = [
  {
    title: 'Design podle vás',
    text: 'Nezačínáme jen prázdnou šablonou. Nejprve zjistíme, jaký styl vám sedí.',
  },
  {
    title: 'Přímá komunikace',
    text: 'Komunikujete přímo s lidmi, kteří váš web tvoří.',
  },
  {
    title: 'Tvorba na míru',
    text: 'Každý projekt přizpůsobujeme konkrétnímu klientovi.',
  },
  {
    title: 'Moderní technologie',
    text: 'Používáme moderní technologie a dbáme na rychlost a responzivitu.',
  },
  {
    title: 'Transparentní proces',
    text: 'Od prvního výběru až po finální web víte, co se děje.',
  },
]

export const faq = [
  {
    q: 'Kolik web stojí?',
    a: 'Cena závisí na rozsahu a funkcích projektu. Po odeslání vaší představy vám připravíme individuální nabídku.',
  },
  {
    q: 'Musím přesně vědět, jak má web vypadat?',
    a: 'Ne. Právě proto jsme vytvořili katalog. Můžete si pouze označit prvky, které se vám líbí.',
  },
  {
    q: 'Můžu poslat vlastní inspiraci?',
    a: 'Ano. Do formuláře můžete přidat odkaz nebo popsat další představy.',
  },
  {
    q: 'Jak dlouho tvorba webu trvá?',
    a: 'Záleží na rozsahu projektu. Konkrétní termín domluvíme po úvodní komunikaci.',
  },
  {
    q: 'Komunikujeme spolu přímo?',
    a: 'Ano. Na projektech pracujeme sami a komunikujete přímo s námi.',
  },
]

export const aboutParagraphs = [
  'WebTix vznikl jako projekt dvou kamarádů, Richarda Buchníčka a Daniela Švédy. Baví nás tvorba webů, design a technologie a rozhodli jsme se tyto věci spojit do jednoho projektu.',
  'Nejsme velká agentura s desítkami lidí. Na projektech pracujeme sami, takže máme kontrolu nad celým procesem od prvního nápadu až po finální web.',
  'S klienty komunikujeme přímo a každý projekt řešíme individuálně. Nechceme vytvářet jen další stejný web podle šablony. Chceme vytvořit web, který bude odpovídat konkrétnímu projektu a jeho cíli.',
]

export const WEB_TYPES = ['Firemní web', 'Portfolio', 'E-shop', 'Landing page', 'Osobní web', 'Blog', 'Jiný'] as const

export const BUDGETS = [
  'Ještě nevím',
  'Do 10 000 Kč',
  '10 000–20 000 Kč',
  '20 000–40 000 Kč',
  '40 000 Kč+',
] as const

export const DEADLINES = ['Ještě nevím', 'Co nejdříve', 'Do 1 měsíce', 'Do 3 měsíců', 'Nespěchá'] as const

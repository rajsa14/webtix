/**
 * Projects shown on the "Reference" page, in this order. The first one is featured large.
 * The page and its nav link stay hidden while this list is empty.
 *
 * Put screenshots in public/references/ and set e.g. `image: 'references/kavarna.jpg'`
 * (16:10 works best). `kind` says honestly what the project is:
 *  - 'client'    a site built for a paying client
 *  - 'own'       a site we built for ourselves
 *  - 'proposal'  a design made for a real business that is not live yet;
 *                keep its contact details out of the screenshot
 *  - 'concept'   a design for a made-up brand
 */
export type ReferenceKind = 'client' | 'own' | 'proposal' | 'concept'

export interface Reference {
  title: string
  client: string
  type: string
  year: number
  description: string
  /** Screenshot in public/references/. Without one the card shows a typographic cover instead. */
  image?: string
  url?: string
  kind: ReferenceKind
}

/** Tag on the card and in the index. Client work needs no tag. */
export const KIND_LABELS: Record<ReferenceKind, string> = {
  client: '',
  own: 'Vlastní web',
  proposal: 'Návrh',
  concept: 'Koncept',
}

export const references: Reference[] = [
  {
    title: 'Restaurace Merkur',
    client: 'Restaurace',
    type: 'Web podniku',
    year: 2026,
    description:
      'Návrh webu pro restauraci s tradicí. Kondenzované písmo jako z vývěsního štítu, polední menu na jedno kliknutí a rezervace vždy po ruce.',
    image: 'references/restaurace.jpg',
    url: 'https://restauracemerkur.webtix.workers.dev/',
    kind: 'proposal',
  },
  {
    title: 'Café AdAstra',
    client: 'Kavárna a bistro',
    type: 'Web podniku',
    year: 2026,
    description:
      'Návrh webu pro kavárnu s večerním programem. Fotka interiéru přes celou obrazovku, dnešní menu a program hned na očích.',
    image: 'references/kavarna.jpg',
    url: 'https://adastra-kavarna.webtix.workers.dev/',
    kind: 'proposal',
  },
  {
    title: 'Pension Milada',
    client: 'Rodinný pension',
    type: 'Web ubytování',
    year: 2026,
    description:
      'Návrh webu pro malý pension kousek za Prahou. Česky i anglicky, pokoje a ceník přehledně, poptávka pobytu přímo z webu.',
    url: 'https://pension-milada.webtix.workers.dev/',
    kind: 'proposal',
  },
  {
    title: 'Hostinec U Kamenné kašny',
    client: 'Tradiční hospoda',
    type: 'Web restaurace',
    year: 2026,
    description:
      'Hospoda s tradicí. Polední menu podle dne v týdnu, pivo na čepu jako tabule za výčepem a salonek na oslavy s jasnými podmínkami.',
    image: 'references/hostinec.jpg',
    url: 'koncepty/hostinec/index.html',
    kind: 'concept',
  },
  {
    title: 'Vinárna Sklípek 14',
    client: 'Vinárna a vinotéka',
    type: 'Web podniku',
    year: 2026,
    description:
      'Gotický sklep. Velká serifová typografie na tmavém plátně, vinný lístek filtrovaný podle oblasti a degustace jako vstupenky.',
    image: 'references/sklipek.jpg',
    url: 'koncepty/sklipek/index.html',
    kind: 'concept',
  },
  {
    title: 'Forno 400',
    client: 'Pizzerie',
    type: 'Web s rozvozem',
    year: 2026,
    description:
      'Neapolská pizzerie. Kondenzované písmo, výrazná červená, menu s přepínáním velikosti a rozvozové zóny na jednom místě.',
    image: 'references/forno.jpg',
    url: 'koncepty/forno/index.html',
    kind: 'concept',
  },
  {
    title: 'Ranní ptáče',
    client: 'Snídaňové bistro',
    type: 'Web podniku',
    year: 2026,
    description:
      'Bistro se snídaněmi celý den. Hravé tvary, živé barvy, menu filtrované na slané a sladké a víkendové akce.',
    image: 'references/ranni-ptace.jpg',
    url: 'koncepty/ranni-ptace/index.html',
    kind: 'concept',
  },
  {
    title: 'Pekárna Kvásek',
    client: 'Řemeslná pekárna',
    type: 'Web s předobjednávkou',
    year: 2026,
    description:
      'Kvasová pekárna. Časová osa dnešní pece, která ukazuje, co se právě peče, a předobjednávka pečiva na ráno.',
    image: 'references/kvasek.jpg',
    url: 'koncepty/kvasek/index.html',
    kind: 'concept',
  },
  {
    title: 'Pražírna Lampa',
    client: 'Pražírna kávy',
    type: 'Web s e-shopem',
    year: 2026,
    description:
      'Výběrová pražírna kávy. Redakční styl s velkou serifovou typografií, teplými barvami a nabídkou káv, která se mění podle sklizně.',
    image: 'references/lampa.jpg',
    url: 'koncepty/lampa/index.html',
    kind: 'concept',
  },
  {
    title: 'Výška Boulder',
    client: 'Lezecká hala',
    type: 'Firemní web',
    year: 2026,
    description:
      'Boulderová hala. Výrazná kondenzovaná typografie, neonové barvy chytů, bento přehled haly a jasný ceník.',
    image: 'references/vyska.jpg',
    url: 'koncepty/vyska/index.html',
    kind: 'concept',
  },
  {
    title: 'Richard Buchníček',
    client: 'Osobní web',
    type: 'Portfolio',
    year: 2026,
    description:
      'Portfolio postavené od nuly, bez šablony. Jméno složené z částic, které reagují na myš, galerie webů a rychlé menu z klávesnice.',
    image: 'references/richard-buchnicek.jpg',
    url: 'https://richard-buchnicek.netlify.app/',
    kind: 'own',
  },
  {
    title: 'Daniel Švéda',
    client: 'Osobní web',
    type: 'Portfolio',
    year: 2026,
    description:
      'Osobní web jednoho z nás. Obří typografie, tmavé plátno, dvě jazykové verze a detaily, které reagují na pohyb i zvuk.',
    image: 'references/daniel-sveda.jpg',
    url: 'https://danielsveda.cz/',
    kind: 'own',
  },
]

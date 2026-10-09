/**
 * Projects shown on the "Reference" page, in this order.
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
  image: string
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
]

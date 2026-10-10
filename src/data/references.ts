/**
 * Projects shown on the "Reference" page, in this order.
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

/**
 * Only proposals the business agreed to show. Merkur has not agreed yet:
 * do not add it until it has.
 */
export const references: Reference[] = [
  {
    title: 'Café AdAstra',
    client: 'Kavárna a bistro',
    type: 'Web podniku',
    year: 2026,
    description:
      'Návrh webu pro kavárnu s večerním programem. Fotka interiéru přes celou obrazovku, dnešní menu a program hned na očích.',
    image: 'references/kavarna.jpg',
    url: 'https://adastra.webtix.cz/',
    kind: 'proposal',
  },
]

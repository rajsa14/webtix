/**
 * Finished projects shown in the "Reference" section.
 * The section and its nav link stay hidden while this list is empty.
 *
 * Put screenshots in public/references/ and set e.g. `image: 'references/kavarna.jpg'`
 * (16:10 works best). Set `concept: true` for a redesign you made on your own,
 * without a client, so the card says so honestly. English texts go in `en`.
 */
interface ReferenceText {
  client: string
  type: string
  description: string
}

export interface Reference extends ReferenceText {
  title: string
  image: string
  url?: string
  concept?: boolean
  en: ReferenceText
}

export const references: Reference[] = [
  {
    title: 'Pražírna Lampa',
    client: 'Pražírna kávy',
    type: 'Web s e-shopem',
    description:
      'Výběrová pražírna kávy. Redakční styl s velkou serifovou typografií, teplými barvami a nabídkou káv, která se mění podle sklizně.',
    image: 'references/lampa.jpg',
    url: 'koncepty/lampa/index.html',
    concept: true,
    en: {
      client: 'Coffee roastery',
      type: 'Website with online store',
      description:
        'A specialty coffee roastery. Editorial style with large serif type, warm colors and a coffee menu that changes with each harvest.',
    },
  },
  {
    title: 'Výška Boulder',
    client: 'Lezecká hala',
    type: 'Firemní web',
    description:
      'Boulderová hala. Výrazná kondenzovaná typografie, neonové barvy chytů, bento přehled haly a jasný ceník.',
    image: 'references/vyska.jpg',
    url: 'koncepty/vyska/index.html',
    concept: true,
    en: {
      client: 'Climbing gym',
      type: 'Business website',
      description: 'A bouldering gym. Bold condensed type, neon hold colors, a bento overview of the gym and a clear price list.',
    },
  },
]

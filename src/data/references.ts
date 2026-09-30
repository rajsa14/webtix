/**
 * Finished projects shown in the "Reference" section.
 * The section and its nav link stay hidden while this list is empty.
 *
 * Put screenshots in /public/references/ and set e.g. `image: '/references/kavarna.jpg'`
 * (16:10 works best). Set `concept: true` for a redesign you made on your own,
 * without a client, so the card says so honestly.
 */
export interface Reference {
  title: string
  client: string
  type: string
  description: string
  image: string
  url?: string
  concept?: boolean
}

export const references: Reference[] = [
  {
    title: 'Pražírna Lampa',
    client: 'Pražírna kávy',
    type: 'Web s e-shopem',
    description:
      'Výběrová pražírna kávy. Redakční styl s velkou serifovou typografií, teplými barvami a nabídkou káv, která se mění podle sklizně.',
    image: '/references/lampa.jpg',
    url: '/koncepty/lampa/',
    concept: true,
  },
  {
    title: 'Výška Boulder',
    client: 'Lezecká hala',
    type: 'Firemní web',
    description:
      'Boulderová hala. Výrazná kondenzovaná typografie, neonové barvy chytů, bento přehled haly a jasný ceník.',
    image: '/references/vyska.jpg',
    url: '/koncepty/vyska/',
    concept: true,
  },
]

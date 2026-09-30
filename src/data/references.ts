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

export const references: Reference[] = []

import { references } from './references'

/** Global WebTix facts. Change them here and they update everywhere. */
export const SITE = {
  name: 'WebTix',
  tagline: 'Weby podle vašich představ.',
  email: 'webtixx1@gmail.com',
  year: 2026,
  /**
   * Legal identity shown in the footer, e.g. 'IČO: 12345678'. One line per
   * person or company. Leave empty and the footer line is hidden.
   */
  legal: [] as string[],
} as const

export const NAV_LINKS = [
  { id: 'domu', label: 'Domů' },
  { id: 'katalog', label: 'Katalog' },
  { id: 'jak-to-funguje', label: 'Jak to funguje' },
  ...(references.length > 0 ? [{ id: 'reference', label: 'Reference' }] : []),
  { id: 'o-nas', label: 'O nás' },
  { id: 'kontakt', label: 'Kontakt' },
]

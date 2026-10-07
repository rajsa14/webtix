import { references } from './references'

/** Global WebTix facts. Change them here and they update everywhere. */
export const SITE = {
  name: 'WebTix',
  email: 'webtixx1@gmail.com',
  year: 2026,
  /**
   * Legal identity shown in the footer, e.g. 'IČO: 12345678'. One line per
   * person or company. Leave empty and the footer line is hidden.
   */
  legal: [] as string[],
} as const

/** Section ids in the navigation. Labels are in i18n (nav.links). */
export const NAV_LINKS = [
  'domu',
  'katalog',
  'jak-to-funguje',
  ...(references.length > 0 ? ['reference'] : []),
  'sluzby',
  'o-nas',
  'kontakt',
]

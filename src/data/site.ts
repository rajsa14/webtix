import { references } from './references'

/** Global WebTix facts. Change them here and they update everywhere. */
export const SITE = {
  name: 'WebTix',
  tagline: 'Weby podle vašich představ.',
  email: 'info@webtix.cz',
  url: 'https://webtix.cz',
  /** Browser title and description of the homepage. Keep in sync with index.html. */
  title: 'WebTix — Weby podle vašich představ',
  description:
    'Vyberte si styl, barvy, písmo a další prvky vašeho webu. WebTix z vaší představy vytvoří konkrétní návrh na míru.',
  year: 2026,
  /**
   * Legal identity shown in the footer, e.g. 'IČO: 12345678'. One line per
   * person or company. Leave empty and the footer line is hidden.
   */
  legal: [] as string[],
} as const

/**
 * Addresses of the pages. When you add one, add it to netlify.toml (redirect
 * and headers), public/sitemap.xml and PAGES in netlify/functions/track.mts too.
 */
export const PAGES = {
  home: '/',
  catalog: '/katalog',
  process: '/jak-to-funguje',
  references: '/reference',
  about: '/o-nas',
  contact: '/kontakt',
  privacy: '/ochrana-osobnich-udaju',
  terms: '/obchodni-podminky',
  admin: '/admin',
} as const

export const NAV_LINKS = [
  { href: PAGES.home, label: 'Domů' },
  { href: PAGES.catalog, label: 'Katalog' },
  { href: PAGES.process, label: 'Jak to funguje' },
  ...(references.length > 0 ? [{ href: PAGES.references, label: 'Reference' }] : []),
  { href: PAGES.about, label: 'O nás' },
  { href: PAGES.contact, label: 'Kontakt' },
]

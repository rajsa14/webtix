/** Global Webtix facts. Change them here and they update everywhere. */
export const SITE = {
  name: 'Webtix',
  tagline: 'Weby podle vašich představ.',
  email: 'info@webtix.cz',
  url: 'https://webtix.cz',
  /** Browser title and description of the homepage. Keep in sync with index.html. */
  title: 'Webtix — Weby podle vašich představ',
  description:
    'Vyberte si styl, barvy, písmo a další prvky vašeho webu. Webtix z vaší představy vytvoří konkrétní návrh na míru.',
  year: 2026,
  /**
   * Legal identity shown in the footer, e.g. 'IČO: 12345678'. One line per
   * person or company. Leave empty and the footer line is hidden.
   */
  legal: [] as string[],
} as const

/** Every price and day count on the site comes from these values. */
export const PRICE_FROM = 9990
export const PREVIEW_DAYS = 5

/**
 * Not known yet. While it is null, `npm run build` fails on purpose (see
 * vite.config.ts); `npm run build:draft` builds anyway for local review.
 */
export const ICO = null as string | null

/** "9 990 Kč" with Czech non-breaking spaces. */
export const priceText = () => `${PRICE_FROM.toLocaleString('cs-CZ')} Kč`

/**
 * The cookie banner stays in the code for Google Ads later. Until then the
 * site stores nothing that needs consent, so the banner and its footer link stay hidden.
 */
export const CONSENT_NEEDED = false

/**
 * Addresses of the pages. When you add one, add it to public/sitemap.xml too.
 * The homepage is the only marketing page; the rest are legal and system pages.
 */
export const PAGES = {
  home: '/',
  inquirySent: '/poptavka-odeslana',
  privacy: '/ochrana-osobnich-udaju',
  terms: '/obchodni-podminky',
} as const

/** Anchor of the enquiry form on the homepage. */
export const INQUIRY_ANCHOR = 'kontakt'

/** Top navigation: anchors on the homepage, from the design. */
export const NAV_LINKS = [
  { href: '/#jak-to-delame', label: 'Jak to děláme' },
  { href: '/#navrhy', label: 'Návrhy' },
  { href: '/#kdo-jsme', label: 'Kdo jsme' },
  { href: `/#${INQUIRY_ANCHOR}`, label: 'Kontakt' },
] as const

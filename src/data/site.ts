/** Global Webtix facts. Change them here and they update everywhere. */
export const SITE = {
  name: 'Webtix',
  email: 'info@webtix.cz',
  url: 'https://webtix.cz',
  year: 2026,
} as const

/** Every price and day count on the site comes from these values. */
export const PRICE_FROM = 9990
export const PREVIEW_DAYS = 5

/** Monthly web care: with a CMS (the client edits the site) and with edits made by us. */
export const MANAGEMENT_CMS_FROM = 790
export const MANAGEMENT_EDITS_FROM = 1490

/** The company ID (IČO). While it is null, the footer hides the IČO line. */
export const ICO = null as string | null

/**
 * Café AdAstra ("Skutečný návrh") is a real client. The owner's written
 * permission is in. Set this back to false and `npm run build` refuses to
 * run, should the permission ever be withdrawn.
 */
export const ADASTRA_WRITTEN_OK = true as boolean

/** The AdAstra proposal itself, linked from the "Skutečný návrh" section. */
export const ADASTRA_URL = 'https://adastra.webtix.cz/'

const NUMBER_WORDS = ['nula', 'jeden', 'dva', 'tři', 'čtyři', 'pět', 'šest', 'sedm', 'osm', 'devět', 'deset']

/** PREVIEW_DAYS in words, as after "za": "pět pracovních dnů". */
export function previewDaysWords(n: number = PREVIEW_DAYS) {
  const word = NUMBER_WORDS[n] ?? String(n)
  if (n === 1) return `${word} pracovní den`
  if (n >= 2 && n <= 4) return `${word} pracovní dny`
  return `${word} pracovních dnů`
}

const NUMBER_WORDS_GENITIVE = ['nula', 'jednoho', 'dvou', 'tří', 'čtyř', 'pěti', 'šesti', 'sedmi', 'osmi', 'devíti', 'deseti']

/** PREVIEW_DAYS in words, as after "do": "pěti pracovních dnů". */
export function previewDaysGenitive(n: number = PREVIEW_DAYS) {
  const word = NUMBER_WORDS_GENITIVE[n] ?? String(n)
  return n === 1 ? `${word} pracovního dne` : `${word} pracovních dnů`
}

/** "Pět pracovních dnů začíná běžet", with the verb agreeing with the number. */
export function previewDaysStart(n: number = PREVIEW_DAYS) {
  const words = previewDaysWords(n)
  const verb = n >= 2 && n <= 4 ? 'začínají' : 'začíná'
  return `${words[0].toUpperCase()}${words.slice(1)} ${verb} běžet`
}

/** "1 490 Kč" with Czech non-breaking spaces. */
export const kc = (amount: number) => `${amount.toLocaleString('cs-CZ')}\u00a0Kč`

/** "9 990 Kč": the starting price of a site. */
export const priceText = () => kc(PRICE_FROM)

/**
 * Browser title and description of the homepage. The one place they are
 * written: vite.config.ts puts them into index.html (title, description,
 * Open Graph, structured data), src/lib/meta.ts uses them in the app.
 */
export const HOME_META = {
  title: 'Webtix: nový web pro váš podnik, návrh zdarma',
  description: `Podíváme se na váš web a do ${previewDaysGenitive()} vám ukážeme lepší. Návrh úvodní stránky je zdarma a nezávazný. Weby od ${priceText()}.`,
}

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

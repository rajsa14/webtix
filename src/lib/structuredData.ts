import { FAQ } from '../data/faq'
import { HOME_META, CARE_MONTHLY, CARE_PLUS_MONTHLY, PAGES, PRICE_FROM, SITE } from '../data/site'
import { team } from '../data/team'

/*
 * Structured data (schema.org JSON-LD) for search engines and AI assistants.
 * Only facts and wording that are already on the page: the description, the
 * prices, the founders, Praha and the pricing questions. scripts/prerender.mjs
 * writes it into each indexed page.
 */

const ID = `${SITE.url}/#webtix`
const CZK = 'CZK'
const nbsp = (s: string) => s.replace(/ /g, ' ')

const business = {
  '@type': 'ProfessionalService',
  '@id': ID,
  name: SITE.name,
  description: nbsp(HOME_META.description),
  url: `${SITE.url}/`,
  logo: `${SITE.url}/apple-touch-icon.png`,
  image: `${SITE.url}/og.png`,
  email: SITE.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Praha', addressCountry: 'CZ' },
  founder: team.map((person) => ({ '@type': 'Person', name: person.name })),
  makesOffer: [
    {
      '@type': 'Offer',
      name: 'Návrh úvodní stránky',
      description: 'Návrh úvodní stránky je zdarma a nezávazný.',
      price: 0,
      priceCurrency: CZK,
    },
    {
      '@type': 'Offer',
      name: 'Jednoduchý jednostránkový web',
      priceSpecification: { '@type': 'PriceSpecification', minPrice: PRICE_FROM, priceCurrency: CZK },
    },
    {
      '@type': 'Offer',
      name: 'Webtix Care',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: CARE_MONTHLY, priceCurrency: CZK, unitCode: 'MON' },
    },
    {
      '@type': 'Offer',
      name: 'Webtix Care+',
      priceSpecification: { '@type': 'UnitPriceSpecification', price: CARE_PLUS_MONTHLY, priceCurrency: CZK, unitCode: 'MON' },
    },
  ],
}

const website = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#web`,
  name: SITE.name,
  url: `${SITE.url}/`,
  inLanguage: 'cs',
  publisher: { '@id': ID },
}

const faqPage = {
  '@type': 'FAQPage',
  '@id': `${SITE.url}/#otazky`,
  inLanguage: 'cs',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: nbsp(q),
    acceptedAnswer: { '@type': 'Answer', text: nbsp(a) },
  })),
}

/** The JSON-LD for one page: the business and the site everywhere, the questions on the homepage. */
export function structuredData(path: string) {
  const graph: object[] = [business, website]
  if (path === PAGES.home) graph.push(faqPage)
  return { '@context': 'https://schema.org', '@graph': graph }
}

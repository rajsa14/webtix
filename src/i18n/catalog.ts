import { catalog, type CatalogCategoryConfig } from '../data/catalog'
import type { CatalogItem, CategoryId } from '../data/types'
import { useLang, type Lang } from './lang'

/**
 * English overrides for the catalog. The Czech text lives in the data files
 * themselves; anything not listed here (font and palette names, hex codes)
 * is the same in both languages.
 */
type ItemText = Partial<Pick<CatalogItem, 'name' | 'tag' | 'description'>> & {
  sample?: string
  heading?: string
  alt?: string
}

const CATEGORY_EN: Record<CategoryId, Pick<CatalogCategoryConfig, 'title' | 'label' | 'intro'>> = {
  fonts: { title: 'Fonts', label: 'Font', intro: 'A font sets the character of a website before anyone reads the first sentence.' },
  palettes: { title: 'Color palettes', label: 'Colors', intro: 'Pick a mood. We fine-tune the exact shades to your brand later.' },
  photos: { title: 'Photo style', label: 'Photos', intro: 'Which kind of photos do you like? You can pick a mix.' },
  webStyles: { title: 'Website style', label: 'Website style', intro: 'The overall feel, where color, type, space and detail meet.' },
  buttons: { title: 'Buttons', label: 'Buttons', intro: 'A small detail with a big effect. Hover over them to try.' },
  layouts: { title: 'Layout', label: 'Layout', intro: 'How the first screen and the page content are arranged.' },
}

const ITEMS_EN: Record<CategoryId, Record<string, ItemText>> = {
  fonts: {
    manrope: { sample: 'We build things that work.', description: 'A modern grotesque with clean shapes. Confident and easy to read.' },
    inter: { sample: 'Less is sometimes more.', description: 'A neutral typeface designed for screens. Lets the content shine.' },
    playfair: { sample: 'Elegance in every detail.', description: 'A high-contrast serif for cafés, restaurants and personal brands.' },
    anton: { sample: 'A brand you’ll notice.', description: 'Narrow and loud. For bold headlines, sport and events.' },
    'space-grotesk': { sample: 'Technology with a human face.', description: 'Technical character with friendly details. Suits apps and startups.' },
    bodoni: { sample: 'Luxury that needn’t shout.', description: 'A classic high-contrast fashion serif. For premium brands.' },
    syne: { sample: 'Creativity without limits.', description: 'Unusual proportions and striking width. For artists, studios and festivals.' },
    fredoka: { sample: 'Hi there, come on in!', description: 'Rounded and playful. Good for kids, leisure and food.' },
    outfit: { sample: 'Simple and clear.', description: 'A geometric typeface with a soft expression. A versatile pick for services.' },
    bricolage: { sample: 'Character in every letter.', description: 'A grotesque with distinctive details. The WebTix site is set in it.' },
  },
  palettes: {
    midnight: { tag: 'Dark', description: 'Black, deep blue and light blue. Calm and technological.' },
    luxury: { tag: 'Premium', description: 'Black, cream and gold. For brands that want to feel exclusive.' },
    ocean: { tag: 'Fresh', description: 'Blue, turquoise and white. Clean and trustworthy.' },
    nature: { tag: 'Natural', description: 'Green, beige and white. Natural, calm and friendly.' },
    neon: { tag: 'Bold', description: 'Black with a neon accent. Energetic and impossible to miss.' },
    minimal: { tag: 'Clean', description: 'White, black and grey. A timeless choice that never gets old.' },
    sunset: { tag: 'Warm', description: 'Orange, pink and purple. Playful and full of energy.' },
    purple: { tag: 'Creative', description: 'Deep purple, light purple and white. Creative and modern.' },
    terracotta: { tag: 'Earthy', description: 'Brick, slate and sandy grey. An honest, crafted feel.' },
    pastel: { tag: 'Soft', description: 'Powder pink, mint and sky. Light and welcoming.' },
  },
  photos: {
    minimal: { name: 'Minimal', tag: 'Clean', description: 'Lots of space, light tones and one clear subject.', alt: 'Bright minimalist living room with a blue sofa' },
    lifestyle: { tag: 'Authentic', description: 'Real people in natural situations. Emotion and atmosphere.', alt: 'Group of friends laughing outside at sunset' },
    business: { tag: 'Professional', description: 'Teams, offices and collaboration. A trustworthy corporate feel.', alt: 'Team of people working at a table with laptops' },
    product: { name: 'Product', tag: 'Detailed', description: 'The product in the lead role. Clean background, focus on detail.', alt: 'White smartwatch on a light grey background' },
    luxury: { tag: 'Premium', description: 'Warm light, quality materials and exclusive settings.', alt: 'Modern luxury house at dusk with lit windows' },
    dark: { tag: 'High contrast', description: 'Dark scenes, colored light and strong contrast.', alt: 'Retro computer gear in pink and blue light' },
    nature: { tag: 'Natural', description: 'Landscape, light and calm. Natural colors without filters.', alt: 'Green mountain landscape with mist at sunrise' },
    creative: { tag: 'Artistic', description: 'Abstraction, color and texture. For daring brands.', alt: 'Abstract blue and orange paint spreading in water' },
    architecture: { tag: 'Structured', description: 'Lines, geometry and perspective. For buildings, real estate and design.', alt: 'Looking up at dark glass skyscrapers' },
  },
  webStyles: {
    minimal: { tag: 'Clean', description: 'White space, light typography and nothing extra.', heading: 'Less. Better.' },
    modern: { tag: 'Current', description: 'Rounded elements, a fresh accent and clear structure.', heading: 'Growing with you.' },
    luxury: { tag: 'Exclusive', description: 'Dark tones, a gold detail and a classic serif.', heading: 'Timeless elegance' },
    dark: { tag: 'Dark', description: 'A dark background, contrast and one striking accent.', heading: 'Step out of the dark.' },
    corporate: { tag: 'Corporate', description: 'Trustworthy, clear and professional.', heading: 'A partner for your growth' },
    creative: { tag: 'Daring', description: 'Unusual shapes, saturated color and a playful composition.', heading: 'Create out loud.' },
    futuristic: { tag: 'Tech', description: 'Grids, technical details and cold light.', heading: 'The future is now' },
    editorial: { tag: 'Magazine', description: 'Big type, columns and the feel of a magazine.', heading: 'Stories worth reading' },
    glass: { tag: 'Airy', description: 'Translucent layers, blurred backgrounds and soft colors.', heading: 'Lightness in every layer' },
    bold: { tag: 'Loud', description: 'Huge headlines, strong colors and a confident look.', heading: 'Play it loud' },
  },
  buttons: {
    rounded: { tag: 'Versatile', description: 'A filled button with softly rounded corners. The safe choice.' },
    sharp: { tag: 'Strict', description: 'Sharp corners and capitals. Decisive and architectural.' },
    pill: { tag: 'Friendly', description: 'Fully rounded. Soft, modern and easy to tap.' },
    minimal: { tag: 'Subtle', description: 'Text with a line and an arrow. For clean, elegant websites.' },
    outline: { tag: 'Light', description: 'An outline without fill. Great as a secondary button.' },
    filled: { tag: 'Striking', description: 'A rich fill with a shadow. A button nobody misses.' },
    gradient: { tag: 'Lively', description: 'A two-tone gradient. Modern and energetic.' },
    soft: { tag: 'Gentle', description: 'A tinted background in your brand color. Calm but readable.' },
    brutal: { tag: 'Daring', description: 'A heavy outline and offset shadow. Playful and impossible to miss.' },
  },
  layouts: {
    centered: { tag: 'Balanced', description: 'Everything centered. A clear message and calm symmetry.' },
    left: { tag: 'Natural', description: 'Text aligned left, the way we read. Feels natural.' },
    split: { tag: 'Dynamic', description: 'Content on one side, image on the other. A strong first impression.' },
    fullscreen: { tag: 'Atmospheric', description: 'A full-screen photo with the text right on top.' },
    grid: { tag: 'Organized', description: 'A grid of tiles. Ideal for portfolios and products.' },
    editorial: { tag: 'Magazine', description: 'A big headline, text columns and a tall photo.' },
    cards: { tag: 'Modular', description: 'Content in cards. Clear services, products and articles.' },
    bento: { tag: 'Asymmetric', description: 'Tiles of different sizes. A modern, playful arrangement.' },
  },
}

const english: CatalogCategoryConfig[] = catalog.map((category) => ({
  ...category,
  ...CATEGORY_EN[category.id],
  items: category.items.map((item) => ({ ...item, ...ITEMS_EN[category.id][item.id] }) as CatalogItem),
}))

const byLang: Record<Lang, CatalogCategoryConfig[]> = { cs: catalog, en: english }

/** The catalog in the visitor's language. Ids, limits and order are shared. */
export function useCatalog() {
  return byLang[useLang((s) => s.lang)]
}

export function localizedCategory(lang: Lang, id: CategoryId) {
  return byLang[lang].find((c) => c.id === id)!
}

export function localizedItem<T extends CatalogItem = CatalogItem>(lang: Lang, category: CategoryId, id: string) {
  return localizedCategory(lang, category).items.find((item) => item.id === id) as T | undefined
}

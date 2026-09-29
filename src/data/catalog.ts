import { buttonStyles } from './buttonStyles'
import { colorPalettes } from './colorPalettes'
import { fonts } from './fonts'
import { imageStyles } from './imageStyles'
import { layouts } from './layouts'
import type { CatalogItem, CategoryId } from './types'
import { webStyles } from './webStyles'

export interface CatalogCategoryConfig {
  id: CategoryId
  /** Section heading in the catalog. */
  title: string
  /** Short label used in "Můj výběr", the summary and the e-mail. */
  label: string
  intro: string
  /** How many items can be selected. 1 = single-select. */
  max: number
  /** How many cards are shown before "Zobrazit vše". */
  initialVisible: number
  /** Card density: wide previews get 3 columns, compact ones 4. */
  density: 'wide' | 'compact'
  items: CatalogItem[]
}

export const catalog: CatalogCategoryConfig[] = [
  {
    id: 'fonts',
    title: 'Písma',
    label: 'Písmo',
    intro: 'Písmo určuje charakter webu dřív, než si někdo přečte první větu.',
    max: 2,
    initialVisible: 6,
    density: 'wide',
    items: fonts,
  },
  {
    id: 'palettes',
    title: 'Barevné palety',
    label: 'Barvy',
    intro: 'Vyberte náladu. Přesné odstíny pak doladíme podle vaší značky.',
    max: 1,
    initialVisible: 8,
    density: 'compact',
    items: colorPalettes,
  },
  {
    id: 'photos',
    title: 'Styl fotografií',
    label: 'Fotografie',
    intro: 'Jaké snímky se vám líbí? Můžete zvolit i kombinaci.',
    max: 3,
    initialVisible: 6,
    density: 'wide',
    items: imageStyles,
  },
  {
    id: 'webStyles',
    title: 'Styl webu',
    label: 'Styl webu',
    intro: 'Celkový dojem. Tady se potkává barva, písmo, prostor a detail.',
    max: 1,
    initialVisible: 6,
    density: 'wide',
    items: webStyles,
  },
  {
    id: 'buttons',
    title: 'Tlačítka',
    label: 'Tlačítka',
    intro: 'Malý detail s velkým vlivem. Vyzkoušejte si je najetím myši.',
    max: 1,
    initialVisible: 8,
    density: 'compact',
    items: buttonStyles,
  },
  {
    id: 'layouts',
    title: 'Layout',
    label: 'Layout',
    intro: 'Jak bude rozložena úvodní obrazovka a obsah stránky.',
    max: 1,
    initialVisible: 8,
    density: 'compact',
    items: layouts,
  },
]

export const categoryById = Object.fromEntries(catalog.map((c) => [c.id, c])) as Record<
  CategoryId,
  CatalogCategoryConfig
>

export function findItem<T extends CatalogItem = CatalogItem>(category: CategoryId, id: string) {
  return categoryById[category].items.find((item) => item.id === id) as T | undefined
}

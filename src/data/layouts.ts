import type { LayoutItem } from './types'

/**
 * Each layout is a CSS grid. `cells` say what sits in each named area:
 *  copy     = heading + text + button
 *  image    = photo
 *  overlay  = full photo with copy on top
 *  tile     = small photo tile
 *  headline = large heading only
 *  text     = paragraph lines
 *  card     = card with photo and text
 * The same definition renders the wireframe in the catalog and the live preview.
 */
export const layouts: LayoutItem[] = [
  {
    id: 'centered',
    name: 'Centered',
    tag: 'Vyvážený',
    description: 'Vše na středu. Jasné sdělení a klidná symetrie.',
    columns: '1fr',
    rows: 'auto 1fr',
    areas: '"c" "i"',
    cells: [
      { area: 'c', kind: 'copy', align: 'center' },
      { area: 'i', kind: 'image' },
    ],
  },
  {
    id: 'left',
    name: 'Left aligned',
    tag: 'Přirozený',
    description: 'Text zarovnaný vlevo, jak ho čteme. Působí přirozeně.',
    columns: '1.35fr 1fr',
    rows: 'auto 1fr',
    areas: '"c ." "i i"',
    cells: [
      { area: 'c', kind: 'copy', align: 'start' },
      { area: 'i', kind: 'image' },
    ],
  },
  {
    id: 'split',
    name: 'Split screen',
    tag: 'Dynamický',
    description: 'Obsah na jedné straně, obraz na druhé. Silný první dojem.',
    columns: '1fr 1fr',
    rows: '1fr',
    areas: '"c i"',
    cells: [
      { area: 'c', kind: 'copy', align: 'start' },
      { area: 'i', kind: 'image' },
    ],
  },
  {
    id: 'fullscreen',
    name: 'Fullscreen image',
    tag: 'Atmosférický',
    description: 'Fotografie přes celou obrazovku a text přímo na ní.',
    columns: '1fr',
    rows: '1fr',
    areas: '"i"',
    cells: [{ area: 'i', kind: 'overlay', align: 'center' }],
  },
  {
    id: 'grid',
    name: 'Grid',
    tag: 'Přehledný',
    description: 'Mřížka dlaždic. Ideální pro portfolio a produkty.',
    columns: '1fr 1fr 1fr',
    rows: 'auto 1fr 1fr',
    areas: '"c c c" "a b d" "e f g"',
    cells: [
      { area: 'c', kind: 'headline', align: 'start' },
      { area: 'a', kind: 'tile' },
      { area: 'b', kind: 'tile' },
      { area: 'd', kind: 'tile' },
      { area: 'e', kind: 'tile' },
      { area: 'f', kind: 'tile' },
      { area: 'g', kind: 'tile' },
    ],
  },
  {
    id: 'editorial',
    name: 'Editorial',
    tag: 'Magazínový',
    description: 'Velký nadpis, textové sloupce a výška fotografie.',
    columns: '1fr 1fr 1.1fr',
    rows: 'auto 1fr',
    areas: '"h h i" "t u i"',
    cells: [
      { area: 'h', kind: 'headline', align: 'start' },
      { area: 't', kind: 'text' },
      { area: 'u', kind: 'text' },
      { area: 'i', kind: 'image' },
    ],
  },
  {
    id: 'cards',
    name: 'Card based',
    tag: 'Modulární',
    description: 'Obsah v kartách. Přehledné služby, produkty a články.',
    columns: '1fr 1fr 1fr',
    rows: 'auto 1fr',
    areas: '"c c c" "a b d"',
    cells: [
      { area: 'c', kind: 'copy', align: 'center' },
      { area: 'a', kind: 'card' },
      { area: 'b', kind: 'card' },
      { area: 'd', kind: 'card' },
    ],
  },
  {
    id: 'bento',
    name: 'Bento',
    tag: 'Asymetrický',
    description: 'Dlaždice různých velikostí. Moderní a hravé rozložení.',
    columns: '1.3fr 1fr 1fr',
    rows: '1fr 1fr',
    areas: '"i c c" "i a b"',
    cells: [
      { area: 'i', kind: 'image' },
      { area: 'c', kind: 'copy', align: 'start' },
      { area: 'a', kind: 'tile' },
      { area: 'b', kind: 'card' },
    ],
  },
]

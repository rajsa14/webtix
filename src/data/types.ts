/**
 * Shared catalog types. Every catalog file (fonts.ts, colorPalettes.ts, ...)
 * exports a plain array of items, so new options are added by appending
 * an object. No component needs to change.
 */

export type CategoryId = 'fonts' | 'palettes' | 'photos' | 'webStyles' | 'buttons' | 'layouts'

export interface CatalogItemBase {
  id: string
  name: string
  /** Short style label shown on the card, e.g. "Modern" or "Luxury". */
  tag: string
  description: string
}

export interface FontItem extends CatalogItemBase {
  family: string
  weight: number
  sample: string
  uppercase?: boolean
  /** Visual size tweak for fonts that run narrow or wide (1 = default). */
  scale?: number
}

export interface ThemeRoles {
  bg: string
  surface: string
  text: string
  muted: string
  accent: string
  onAccent: string
  /** Optional second accent, used by gradient buttons and decorations. */
  accent2?: string
}

export interface PaletteItem extends CatalogItemBase {
  colors: { name: string; hex: string }[]
  roles: ThemeRoles
}

export interface PhotoItem extends CatalogItemBase {
  image: string
  alt: string
}

export type WebStyleEffect = 'none' | 'glass' | 'grid' | 'rules' | 'shapes' | 'glow'

export interface WebStyleItem extends CatalogItemBase {
  roles: ThemeRoles
  fontFamily: string
  headingWeight: number
  uppercase?: boolean
  /** Corner radius of surfaces in the mini preview, in container-width units. */
  radius: number
  effect: WebStyleEffect
  /** Id from layouts.ts used for the mini preview. */
  layout: string
  heading: string
  image?: string
}

export type ButtonVariant = 'filled' | 'outline' | 'link' | 'gradient' | 'soft' | 'brutal'

export interface ButtonItem extends CatalogItemBase {
  variant: ButtonVariant
  /** CSS border-radius, in em so it scales with the button size. */
  radius: string
  uppercase?: boolean
  shadow?: boolean
}

export type LayoutCellKind = 'copy' | 'image' | 'overlay' | 'tile' | 'headline' | 'text' | 'card'

export interface LayoutCell {
  area: string
  kind: LayoutCellKind
  align?: 'start' | 'center'
}

export interface LayoutItem extends CatalogItemBase {
  columns: string
  rows: string
  /** CSS grid-template-areas value. */
  areas: string
  cells: LayoutCell[]
}

export type CatalogItem = FontItem | PaletteItem | PhotoItem | WebStyleItem | ButtonItem | LayoutItem

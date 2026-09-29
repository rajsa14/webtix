import { findItem } from '../data/catalog'
import { layouts } from '../data/layouts'
import type { ButtonItem, FontItem, LayoutItem, PaletteItem, PhotoItem, WebStyleItem } from '../data/types'
import type { MiniSiteProps } from '../components/previews/MiniSite'
import type { Selection } from '../store/selection'

/**
 * Turns the client's selection into props for <MiniSite mode="live" />.
 * Missing choices fall back to sensible defaults: palette → web style colors → neutral.
 */
export function resolveDesign(selected: Selection): Omit<MiniSiteProps, 'mode'> {
  const palette = selected.palettes[0] ? findItem<PaletteItem>('palettes', selected.palettes[0]) : undefined
  const style = selected.webStyles[0] ? findItem<WebStyleItem>('webStyles', selected.webStyles[0]) : undefined
  const font = selected.fonts[0] ? findItem<FontItem>('fonts', selected.fonts[0]) : undefined
  const button = selected.buttons[0] ? findItem<ButtonItem>('buttons', selected.buttons[0]) : undefined
  const layout = selected.layouts[0] ? findItem<LayoutItem>('layouts', selected.layouts[0]) : undefined
  const photos = selected.photos
    .map((id) => findItem<PhotoItem>('photos', id))
    .filter((p): p is PhotoItem => Boolean(p))

  const styleLayout = style ? layouts.find((l) => l.id === style.layout) : undefined

  return {
    layout: layout ?? styleLayout ?? layouts.find((l) => l.id === 'split')!,
    theme: palette?.roles ?? style?.roles,
    font: font
      ? { family: font.family, weight: font.weight, uppercase: font.uppercase, scale: font.scale }
      : style
        ? { family: style.fontFamily, weight: style.headingWeight, uppercase: style.uppercase }
        : undefined,
    button,
    images: photos.map((p) => p.image),
    effect: style?.effect ?? 'none',
    radius: style ? Math.max(style.radius, 0.4) : 1.2,
  }
}

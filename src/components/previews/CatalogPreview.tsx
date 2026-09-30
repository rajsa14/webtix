import { layouts } from '../../data/layouts'
import { FONT_PANGRAM } from '../../data/fonts'
import type {
  ButtonItem,
  CatalogItem,
  CategoryId,
  FontItem,
  LayoutItem,
  PaletteItem,
  PhotoItem,
  WebStyleItem,
} from '../../data/types'
import { ButtonSample } from './ButtonSample'
import { MiniSite } from './MiniSite'
import { nb } from '../../lib/text'

/** Picks the visual preview for a catalog card based on its category. */
export function CatalogPreview({ category, item }: { category: CategoryId; item: CatalogItem }) {
  switch (category) {
    case 'fonts':
      return <FontPreview item={item as FontItem} />
    case 'palettes':
      return <PalettePreview item={item as PaletteItem} />
    case 'photos':
      return <PhotoPreview item={item as PhotoItem} />
    case 'webStyles':
      return <WebStylePreview item={item as WebStyleItem} />
    case 'buttons':
      return <ButtonPreview item={item as ButtonItem} />
    case 'layouts':
      return <LayoutPreview item={item as LayoutItem} />
  }
}

function FontPreview({ item }: { item: FontItem }) {
  return (
    <div className="relative flex aspect-[16/9] flex-col justify-between overflow-hidden bg-ink-850 p-5">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 select-none text-[7.5rem] leading-none text-white/[0.045] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-x-2"
        style={{ fontFamily: item.family, fontWeight: item.weight }}
      >
        Aa
      </span>
      <p
        className="relative max-w-[16ch] text-[1.85rem] leading-[1.05] text-fg"
        style={{
          fontFamily: item.family,
          fontWeight: item.weight,
          textTransform: item.uppercase ? 'uppercase' : undefined,
          letterSpacing: item.uppercase ? '0.01em' : '-0.02em',
          fontSize: item.scale ? `${1.85 * item.scale}rem` : undefined,
        }}
      >
        {nb(item.sample)}
      </p>
      <p className="relative text-[13px] leading-snug text-muted" style={{ fontFamily: item.family }}>
        {FONT_PANGRAM}
      </p>
    </div>
  )
}

function PalettePreview({ item }: { item: PaletteItem }) {
  return (
    <div className="flex aspect-[5/4] overflow-hidden">
      {item.colors.map((color) => (
        <div
          key={color.hex}
          className="group/swatch relative flex flex-1 items-end p-2 transition-[flex-grow] duration-500 ease-[var(--ease-out-expo)] hover:flex-[2.2]"
          style={{ background: color.hex }}
        >
          <span
            className="pointer-events-none translate-y-1 whitespace-nowrap font-mono text-[10px] uppercase opacity-0 transition-all duration-300 group-hover/swatch:translate-y-0 group-hover/swatch:opacity-100"
            style={{ color: readableOn(color.hex) }}
          >
            {color.hex}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Black or white text depending on the swatch brightness. */
function readableOn(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#111' : '#fff'
}

function PhotoPreview({ item }: { item: PhotoItem }) {
  return (
    <div className="aspect-[4/3] overflow-hidden bg-ink-800">
      <img
        src={item.image}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
      />
    </div>
  )
}

function WebStylePreview({ item }: { item: WebStyleItem }) {
  const layout = layouts.find((l) => l.id === item.layout) ?? layouts[0]
  return (
    <div className="aspect-[16/11] overflow-hidden">
      <MiniSite
        layout={layout}
        mode="live"
        theme={item.roles}
        font={{ family: item.fontFamily, weight: item.headingWeight, uppercase: item.uppercase }}
        button={{
          id: item.id,
          name: '',
          tag: '',
          description: '',
          variant: 'filled',
          radius: item.radius === 0 ? '0' : item.radius >= 4 ? '999px' : '0.55em',
          uppercase: item.uppercase,
        }}
        images={item.image ? [item.image] : []}
        content={{ brand: item.name, heading: item.heading, text: item.description, cta: 'Více' }}
        radius={item.radius}
        effect={item.effect}
      />
    </div>
  )
}

function ButtonPreview({ item }: { item: ButtonItem }) {
  return (
    <div className="wbtn-host grid aspect-[5/4] place-items-center bg-ink-850 px-3">
      <ButtonSample item={item} label="Začít projekt" className="text-[14px]" />
    </div>
  )
}

function LayoutPreview({ item }: { item: LayoutItem }) {
  return (
    <div className="aspect-[5/4] overflow-hidden">
      <MiniSite layout={item} mode="wireframe" />
    </div>
  )
}

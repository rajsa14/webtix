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
import { MiniSite } from './MiniSite'

/** Small visual chip for an item, used in "Můj výběr" and the summary. */
export function ItemToken({ category, item }: { category: CategoryId; item: CatalogItem }) {
  const box = 'grid size-10 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-line bg-ink-800'

  switch (category) {
    case 'fonts': {
      const f = item as FontItem
      return (
        <span className={box} style={{ fontFamily: f.family, fontWeight: f.weight }}>
          <span className="text-[17px] leading-none text-fg">Aa</span>
        </span>
      )
    }
    case 'palettes': {
      const p = item as PaletteItem
      return (
        <span className={`${box} !grid-cols-2 !place-items-stretch`}>
          {p.colors.map((c) => (
            <span key={c.hex} style={{ background: c.hex }} />
          ))}
        </span>
      )
    }
    case 'photos':
      return (
        <span className={box}>
          <img src={(item as PhotoItem).image.replace('w=900', 'w=120')} alt="" className="h-full w-full object-cover" />
        </span>
      )
    case 'webStyles': {
      const w = item as WebStyleItem
      return (
        <span className={box} style={{ background: w.roles.bg }}>
          <span
            className="text-[15px] leading-none"
            style={{ fontFamily: w.fontFamily, color: w.roles.text, fontWeight: w.headingWeight }}
          >
            Aa
          </span>
        </span>
      )
    }
    case 'buttons': {
      const b = item as ButtonItem
      return (
        <span className={box}>
          <span
            className="h-3 w-6"
            style={{
              borderRadius: b.radius === '999px' ? '99px' : b.radius === '0' ? 0 : 3,
              background: b.variant === 'outline' || b.variant === 'link' ? 'transparent' : '#2433ff',
              boxShadow:
                b.variant === 'outline'
                  ? 'inset 0 0 0 1.5px #eef0f5'
                  : b.variant === 'link'
                    ? 'inset 0 -1.5px 0 #eef0f5'
                    : b.variant === 'brutal'
                      ? '2px 2px 0 #eef0f5'
                      : undefined,
            }}
          />
        </span>
      )
    }
    case 'layouts':
      return (
        <span className={box}>
          <span className="block h-full w-full">
            <MiniSite layout={item as LayoutItem} mode="wireframe" />
          </span>
        </span>
      )
  }
}

import { CaretDownIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import type { CatalogCategoryConfig } from '../data/catalog'
import { cx, nb } from '../lib/text'
import { useSelection } from '../store/selection'
import { DesignCard } from './DesignCard'
import { Reveal } from './Reveal'

export function CatalogCategory({ category }: { category: CatalogCategoryConfig }) {
  const selectedIds = useSelection((s) => s.selected[category.id])
  const [expanded, setExpanded] = useState(false)
  const compact = category.density === 'compact'
  const visible = expanded ? category.items : category.items.slice(0, category.initialVisible)
  const hiddenCount = category.items.length - category.initialVisible
  const rule = category.max === 1 ? 'Vyberte jednu možnost' : `Vyberte až ${category.max} možnosti`

  return (
    <div id={`kategorie-${category.id}`} className="scroll-mt-[152px]">
      <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <h3 className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-extrabold leading-none tracking-[-0.05em]">
            {category.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted">{nb(category.intro)}</p>
        </div>
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-fg/[0.02] py-1.5 pl-3 pr-1.5 text-[13px] text-muted">
          {rule}
          <span
            className={cx(
              'rounded-full px-2 py-0.5 font-mono text-[12px] transition-colors',
              selectedIds.length ? 'bg-accent-strong text-white' : 'bg-fg/[0.06] text-muted',
            )}
          >
            {selectedIds.length}/{category.max}
          </span>
        </p>
      </Reveal>

      <div
        className={cx(
          'mt-8 grid gap-3 sm:gap-4',
          compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {visible.map((item) => (
          <DesignCard
            key={item.id}
            category={category.id}
            item={item}
            selected={selectedIds.includes(item.id)}
            compact={compact}
          />
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-5 text-sm text-fg transition-colors hover:bg-fg/[0.06]"
          >
            {expanded ? 'Zobrazit méně' : `Zobrazit všech ${category.items.length}`}
            <CaretDownIcon
              size={14}
              weight="bold"
              className={cx('transition-transform duration-300', expanded && 'rotate-180')}
            />
          </button>
        </div>
      )}
    </div>
  )
}

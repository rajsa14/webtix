import { CheckIcon, PlusIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import type { MouseEvent } from 'react'
import { catalog, categoryById } from '../data/catalog'
import type { CatalogItem, CategoryId } from '../data/types'
import { cx, nb } from '../lib/text'
import { resetNote, unlockedCount, useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { CatalogPreview } from './previews/CatalogPreview'

export function DesignCard({
  category,
  item,
  selected,
  compact,
}: {
  category: CategoryId
  item: CatalogItem
  selected: boolean
  compact: boolean
}) {
  const toggle = useSelection((s) => s.toggle)
  const toast = useUi((s) => s.toast)

  const handle = () => {
    const cat = categoryById[category]
    const before = unlockedCount(useSelection.getState().selected)
    const result = toggle(category, item.id)
    const unlocked = unlockedCount(useSelection.getState().selected) > before ? catalog[before] : undefined
    switch (result.type) {
      case 'added':
        toast(`${cat.label}: ${item.name} je ve výběru${unlocked ? `. Odemkli jsme další krok: ${unlocked.label}` : ''}`)
        break
      case 'replaced': {
        const prev = cat.items.find((i) => i.id === result.previousId)?.name
        toast(`${cat.label}: ${prev} nahrazeno za ${item.name}${resetNote(result.reset)}`, 'info')
        break
      }
      case 'removed':
        toast(`${item.name} odebráno z výběru${resetNote(result.reset)}`, 'info')
        break
      case 'limit':
        toast(`${cat.label}: vybrat můžete nejvýše ${result.max} možnosti. Nejdřív některou odeberte.`, 'error')
        break
    }
  }

  const onButton = (e: MouseEvent) => {
    e.stopPropagation()
    handle()
  }

  return (
    <article
      onClick={handle}
      data-cursor={selected ? 'Odebrat' : 'Vybrat'}
      data-selected={selected || undefined}
      className={cx(
        'wbtn-host group relative flex cursor-pointer flex-col rounded-card border bg-ink-900 transition-[border-color,background-color,box-shadow,transform] duration-300 ease-[var(--ease-out-expo)]',
        selected
          ? 'border-accent/80 bg-accent-tint '
          : 'border-line hover:-translate-y-0.5 hover:border-fg',
      )}
    >
      <div className="relative m-1.5 overflow-hidden rounded-[15px] border border-fg/[0.06]">
        <CatalogPreview category={category} item={item} />
        <AnimatePresence>
          {selected && (
            <motion.span
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 26 }}
              className="absolute right-2.5 top-2.5 z-10 grid size-7 place-items-center rounded-full bg-accent-strong text-white shadow-[0_6px_16px_-4px_rgb(17_17_16/0.18)] ring-2 ring-ink-900"
              aria-hidden="true"
            >
              <CheckIcon size={15} weight="bold" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className={cx('flex flex-1 flex-col px-4 pb-4 pt-2.5', !compact && 'sm:px-5 sm:pb-5')}>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <h4 className="font-display text-[1.08rem] font-semibold leading-tight tracking-[-0.015em] sm:text-[1.15rem]">
            {item.name}
          </h4>
          <span className="rounded-full border border-line px-2 py-0.5 text-[11px] leading-4 text-muted">{item.tag}</span>
        </div>
        <p className={cx('mt-1.5 text-[13.5px] leading-snug text-muted', compact && 'hidden sm:block')}>{nb(item.description)}</p>
        <button
          type="button"
          onClick={onButton}
          aria-pressed={selected}
          className={cx(
            'mt-4 inline-flex h-9 w-fit items-center gap-1.5 self-start rounded-full px-3.5 text-[13.5px] font-medium transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.96]',
            selected
              ? 'bg-accent-strong text-white hover:bg-accent'
              : 'border border-line-strong bg-fg/[0.03] text-fg group-hover:border-fg/25 group-hover:bg-fg/[0.08]',
          )}
        >
          {selected ? <CheckIcon size={14} weight="bold" /> : <PlusIcon size={14} weight="bold" />}
          {selected ? 'Vybráno' : 'Vybrat'}
          <span className="sr-only">: {item.name}</span>
        </button>
      </div>
    </article>
  )
}

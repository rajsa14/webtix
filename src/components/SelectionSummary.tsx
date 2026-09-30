import { PencilSimpleIcon } from '@phosphor-icons/react'
import { catalog } from '../data/catalog'
import { cx } from '../lib/text'
import { useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { ItemToken } from './previews/ItemToken'

/** "Váš výběr" list shown right before the form is sent. */
export function SelectionSummary({ invalid }: { invalid?: boolean }) {
  const selected = useSelection((s) => s.selected)
  const openPanel = useUi((s) => s.setPanelOpen)

  return (
    <section
      aria-labelledby="summary-title"
      className={cx(
        'rounded-[16px] border bg-ink-850 p-4 transition-colors sm:p-5',
        invalid ? 'border-danger/60' : 'border-line',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id="summary-title" className="text-lg font-semibold tracking-[-0.015em]">
          Váš výběr
        </h3>
        <button
          type="button"
          onClick={() => openPanel(true)}
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] text-accent transition-colors hover:bg-accent/10 hover:text-fg"
        >
          <PencilSimpleIcon size={14} />
          Upravit
        </button>
      </div>
      <dl className="mt-3 divide-y divide-line">
        {catalog.map((cat) => {
          const items = selected[cat.id]
            .map((id) => cat.items.find((i) => i.id === id))
            .filter((i) => i !== undefined)
          return (
            <div key={cat.id} className="flex min-h-12 items-center justify-between gap-4 py-2">
              <dt className="text-[14px] text-muted">{cat.label}</dt>
              <dd className="flex min-w-0 items-center justify-end gap-2 text-right text-[14.5px]">
                {items.length ? (
                  <>
                    <span className="hidden sm:inline-flex">
                      <span className="scale-[0.8]">
                        <ItemToken category={cat.id} item={items[0]} />
                      </span>
                    </span>
                    <span className="truncate font-medium text-fg">{items.map((i) => i.name).join(', ')}</span>
                  </>
                ) : (
                  <span className="text-muted/70">nevybráno</span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

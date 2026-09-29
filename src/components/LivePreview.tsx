import { useMemo } from 'react'
import { resolveDesign } from '../lib/resolveDesign'
import { cx } from '../lib/text'
import { countSelected, useSelection } from '../store/selection'
import { BrowserFrame } from './BrowserFrame'
import { MiniSite } from './previews/MiniSite'

/** Sketch of a website built from the current selection. Updates instantly. */
export function LivePreview({ className, showNote = true }: { className?: string; showNote?: boolean }) {
  const selected = useSelection((s) => s.selected)
  const design = useMemo(() => resolveDesign(selected), [selected])
  const empty = countSelected(selected) === 0

  return (
    <figure className={cx('m-0', className)}>
      <BrowserFrame address="vas-novy-web.cz" className="aspect-[16/11.5]">
        <div className={cx('absolute inset-0 transition-opacity duration-500', empty && 'opacity-45 grayscale')}>
          <MiniSite mode="live" {...design} />
        </div>
      </BrowserFrame>
      {showNote && (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-muted">
          {empty
            ? 'Začněte vybírat v katalogu a náhled se bude měnit s každou volbou.'
            : 'Orientační skica z vašeho výběru. Skutečný návrh připravíme na míru.'}
        </figcaption>
      )}
    </figure>
  )
}

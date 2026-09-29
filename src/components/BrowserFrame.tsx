import type { ReactNode } from 'react'
import { cx } from '../lib/text'

/** Minimal browser window chrome around a mini website. */
export function BrowserFrame({
  address,
  children,
  className,
}: {
  address: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cx(
        'flex flex-col overflow-hidden rounded-[14px] border border-white/12 bg-ink-800 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8),0_0_0_1px_rgb(0_0_0/0.4)]',
        className,
      )}
    >
      <div className="flex h-7 shrink-0 items-center gap-3 border-b border-white/[0.07] px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-white/[0.06] px-3 py-0.5 font-mono text-[10px] text-muted">
          {address}
        </span>
        <span className="w-9" aria-hidden="true" />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  )
}

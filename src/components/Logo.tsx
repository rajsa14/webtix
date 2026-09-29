import { cx } from '../lib/text'

const RIBBON =
  'M3 0H16L29 27C31.5 32 36 36.5 44 38C40 43 35 45.5 29.5 45.5C24.5 45.5 21 42.5 19 38Z'
const TRIANGLE = 'M49 0H70L62.6 13.2C61.4 15.3 58.6 15.3 57.4 13.2Z'

/** The WebTix "W" ribbon mark, simplified from the original logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="-3 0 75 48" className={className} aria-hidden="true">
      <g fill="#24309a" transform="translate(-2.4 2)">
        <path d={RIBBON} />
        <path d={RIBBON} transform="translate(23 0)" />
      </g>
      <g fill="#4f6bff">
        <path d={RIBBON} />
        <path d={RIBBON} transform="translate(23 0)" />
        <path d={TRIANGLE} />
      </g>
    </svg>
  )
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-[22px] w-auto" />
      {!compact && (
        <span className="font-display text-[1.28rem] font-bold leading-none tracking-[-0.03em] text-fg">
          WebTix
        </span>
      )}
    </span>
  )
}

import { cx } from '../lib/text'

/**
 * The Webtix wordmark, straight from public/brand/ (never redrawn).
 * Brand rule: the master cut only from 32px tall; 16–31px uses the small cut.
 */
export function Wordmark({ height, className }: { height: number; className?: string }) {
  const file = height >= 32 ? 'webtix-wordmark-ink.svg' : 'webtix-wordmark-small-ink.svg'
  // Both files share the viewBox 3125 × 751.
  const width = Math.round((height * 3125) / 751)
  return (
    <img
      src={import.meta.env.BASE_URL + 'brand/wordmark/' + file}
      alt="webtix"
      width={width}
      height={height}
      className={cx('block', className)}
      style={{ height, width: 'auto' }}
    />
  )
}

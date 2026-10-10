import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../lib/text'

type Variant = 'primary' | 'secondary'
type Size = 'md' | 'lg'

const base =
  'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-card font-semibold disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-terracotta',
  secondary: 'border-2 border-ink text-ink hover:bg-ink hover:text-paper',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[14px] leading-5',
  lg: 'h-12 px-6 text-body',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  arrow?: boolean
  children: ReactNode
  className?: string
}

/** Plain arrow, drawn in the current text colour. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cx('size-4', className)} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 8h11M9 4l4 4-4 4" />
    </svg>
  )
}

function Inner({ children, arrow }: Pick<CommonProps, 'children' | 'arrow'>) {
  return (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  )
}

export function CtaLink({
  variant = 'primary',
  size = 'md',
  arrow,
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  )
}

export function CtaButton({
  variant = 'primary',
  size = 'md',
  arrow,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  )
}

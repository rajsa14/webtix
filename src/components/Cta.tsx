import { ArrowRightIcon } from '@phosphor-icons/react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PointerEvent, ReactNode } from 'react'
import { cx } from '../lib/text'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'group/cta relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,translate,scale,background-color,border-color,color,box-shadow] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary:
    'bg-fg text-ink-950 hover:bg-accent hover:text-white',
  secondary:
    'border border-fg text-fg hover:bg-fg hover:text-ink-950',
  ghost: 'text-muted hover:text-fg',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  arrow?: boolean
  icon?: ReactNode
  children: ReactNode
  className?: string
}

function Inner({ children, arrow, icon }: Pick<CommonProps, 'children' | 'arrow' | 'icon'>) {
  return (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRightIcon
          weight="bold"
          className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover/cta:translate-x-0.5"
        />
      )}
    </>
  )
}

/**
 * Large buttons lean a little toward the mouse. Uses the CSS `translate`
 * property, so it never fights the `scale` used for the pressed state.
 */
const magnet = {
  onPointerMove(e: PointerEvent<HTMLElement>) {
    if (e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * 0.22
    const y = (e.clientY - r.top - r.height / 2) * 0.35
    e.currentTarget.style.translate = `${x}px ${y}px`
  },
  onPointerLeave(e: PointerEvent<HTMLElement>) {
    e.currentTarget.style.translate = ''
  },
}

export function CtaLink({
  variant = 'primary',
  size = 'md',
  arrow,
  icon,
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cx(base, variants[variant], sizes[size], className)} {...(size === 'lg' ? magnet : {})} {...rest}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </a>
  )
}

export function CtaButton({
  variant = 'primary',
  size = 'md',
  arrow,
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </button>
  )
}

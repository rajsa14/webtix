import { ArrowRightIcon } from '@phosphor-icons/react'
import type { CSSProperties } from 'react'
import type { ButtonItem, ThemeRoles } from '../../data/types'
import { cx } from '../../lib/text'

/** WebTix colors used when a button sample is shown in the catalog. */
export const CATALOG_BUTTON_COLORS: ThemeRoles = {
  bg: '#0f1217',
  surface: '#14181f',
  text: '#eef0f5',
  muted: '#a0a7b6',
  accent: '#4460f5',
  onAccent: '#ffffff',
  accent2: '#0e9fb8',
}

export const DEFAULT_BUTTON: ButtonItem = {
  id: 'default',
  name: 'Pill',
  tag: '',
  description: '',
  variant: 'filled',
  radius: '999px',
}

/** Renders a button style as a non-interactive <span>, so it can sit inside clickable cards. */
export function ButtonSample({
  item = DEFAULT_BUTTON,
  colors = CATALOG_BUTTON_COLORS,
  label = 'Začít projekt',
  className,
  style,
}: {
  item?: ButtonItem
  colors?: ThemeRoles
  label?: string
  className?: string
  style?: CSSProperties
}) {
  const vars = {
    '--b-accent': colors.accent,
    '--b-on': colors.onAccent,
    '--b-text': colors.text,
    '--b-bg': colors.bg,
    '--b-accent2': colors.accent2 ?? colors.accent,
    '--b-radius': item.radius,
    '--b-soft-text': colors === CATALOG_BUTTON_COLORS ? '#a9b6ff' : undefined,
    ...style,
  } as CSSProperties

  return (
    <span
      className={cx('wbtn', `wbtn--${item.variant}`, className)}
      data-upper={item.uppercase ? '' : undefined}
      data-shadow={item.shadow ? '' : undefined}
      style={vars}
    >
      {label}
      {item.variant === 'link' && <ArrowRightIcon weight="bold" className="wbtn-arrow size-[1em]" />}
    </span>
  )
}

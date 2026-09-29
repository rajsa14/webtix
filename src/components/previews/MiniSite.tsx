import { ImageIcon } from '@phosphor-icons/react'
import type { CSSProperties, ReactNode } from 'react'
import type { ButtonItem, LayoutCell, LayoutItem, ThemeRoles, WebStyleEffect } from '../../data/types'
import { cx, nb } from '../../lib/text'
import { ButtonSample, DEFAULT_BUTTON } from './ButtonSample'

/**
 * A tiny website rendered from catalog data. Sizes use container query units
 * (cqw), so the same markup scales from a catalog card to a hero mockup.
 *  - mode "wireframe": neutral blocks, used for layout cards
 *  - mode "live": real type, colors, photos and buttons
 */

export interface FontSpec {
  family: string
  weight: number
  uppercase?: boolean
  scale?: number
}

export interface MiniContent {
  brand: string
  heading: string
  text: string
  cta: string
}

export const DEFAULT_THEME: ThemeRoles = {
  bg: '#f4f5f8',
  surface: '#ffffff',
  text: '#14161c',
  muted: '#6b7080',
  accent: '#4460f5',
  onAccent: '#ffffff',
  accent2: '#0e9fb8',
}

export const DEFAULT_FONT: FontSpec = { family: "'Manrope Variable', sans-serif", weight: 700 }

export const DEFAULT_CONTENT: MiniContent = {
  brand: 'Vaše značka',
  heading: 'Váš nový web',
  text: 'Krátký úvod, který návštěvníkům řekne, co děláte a proč právě vy.',
  cta: 'Zjistit více',
}

const WIRE: ThemeRoles = {
  bg: '#0f1217',
  surface: 'rgba(255,255,255,0.05)',
  text: 'rgba(238,240,245,0.78)',
  muted: 'rgba(238,240,245,0.22)',
  accent: '#4f6bff',
  onAccent: '#ffffff',
}

const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`

export interface MiniSiteProps {
  layout: LayoutItem
  mode: 'wireframe' | 'live'
  theme?: ThemeRoles
  font?: FontSpec
  button?: ButtonItem
  images?: string[]
  content?: MiniContent
  /** Surface corner radius in cqw. */
  radius?: number
  effect?: WebStyleEffect
  className?: string
  eager?: boolean
}

interface Ctx {
  live: boolean
  t: ThemeRoles
  f: FontSpec
  c: MiniContent
  button: ButtonItem
  radius: number
  effect: WebStyleEffect
  eager: boolean
}

/** Share of the total width an area spans, used to size headings per layout. */
function areaFraction(layout: LayoutItem, area: string) {
  const firstRow = layout.areas.match(/"([^"]+)"/g)?.map((r) => r.replace(/"/g, '').trim().split(/\s+/)) ?? []
  const row = firstRow.find((r) => r.includes(area)) ?? firstRow[0] ?? []
  const fr = layout.columns.split(/\s+/).map((v) => parseFloat(v) || 1)
  const total = fr.reduce((a, b) => a + b, 0)
  const spanned = row.reduce((sum, name, i) => (name === area ? sum + (fr[i] ?? 1) : sum), 0)
  return spanned / total || 1
}

export function MiniSite({
  layout,
  mode,
  theme,
  font,
  button,
  images = [],
  content,
  radius = 1.2,
  effect = 'none',
  className,
  eager = false,
}: MiniSiteProps) {
  const live = mode === 'live'
  const ctx: Ctx = {
    live,
    t: live ? (theme ?? DEFAULT_THEME) : WIRE,
    f: font ?? DEFAULT_FONT,
    c: content ?? DEFAULT_CONTENT,
    button: button ?? DEFAULT_BUTTON,
    radius,
    effect: live ? effect : 'none',
    eager,
  }
  let imageIndex = 0
  const nextImage = () => (images.length ? images[imageIndex++ % images.length] : undefined)

  return (
    <div
      className={cx('relative h-full w-full overflow-hidden', className)}
      style={{ containerType: 'inline-size', background: ctx.t.bg }}
      aria-hidden="true"
    >
      <Decor ctx={ctx} />
      <div className="relative flex h-full flex-col">
        <Nav ctx={ctx} />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layout.columns,
            gridTemplateRows: layout.rows,
            gridTemplateAreas: layout.areas,
            gap: '2.2cqw',
            padding: '0.8cqw 4cqw 4cqw',
            flex: 1,
            minHeight: 0,
          }}
        >
          {layout.cells.map((cell) => (
            <Cell
              key={cell.area}
              cell={cell}
              ctx={ctx}
              fraction={areaFraction(layout, cell.area)}
              image={['image', 'tile', 'overlay', 'card'].includes(cell.kind) ? nextImage() : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Bar({ w, h = '1cqw', color, radius = '99px' }: { w: string; h?: string; color: string; radius?: string }) {
  return <span style={{ display: 'block', width: w, height: h, borderRadius: radius, background: color }} />
}

function Nav({ ctx }: { ctx: Ctx }) {
  const { live, t, f, c, effect } = ctx
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2.6cqw 4cqw',
        borderBottom: effect === 'rules' ? `1px solid ${mix(t.text, 25)}` : undefined,
        marginBottom: effect === 'rules' ? '1.6cqw' : undefined,
      }}
    >
      {live ? (
        <span
          style={{
            fontFamily: f.family,
            fontWeight: Math.max(f.weight, 600),
            fontSize: '2.1cqw',
            color: t.text,
            textTransform: f.uppercase ? 'uppercase' : undefined,
            letterSpacing: f.uppercase ? '0.04em' : '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          {c.brand}
        </span>
      ) : (
        <Bar w="11cqw" h="1.5cqw" color={t.text} />
      )}
      <span style={{ display: 'flex', gap: '2.4cqw', alignItems: 'center' }}>
        {[5, 6, 4.5].map((w, i) => (
          <Bar key={i} w={`${w}cqw`} h="0.8cqw" color={mix(t.text, live ? 35 : 45)} />
        ))}
      </span>
    </div>
  )
}

function Heading({ ctx, size, align }: { ctx: Ctx; size: number; align?: 'start' | 'center' }) {
  const { live, t, f, c } = ctx
  if (!live) {
    return (
      <span style={{ display: 'grid', gap: '1.1cqw', justifyItems: align === 'center' ? 'center' : 'start', width: '100%' }}>
        <Bar w="88%" h="2.3cqw" color={t.text} />
        <Bar w="58%" h="2.3cqw" color={t.text} />
      </span>
    )
  }
  return (
    <span
      style={{
        display: 'block',
        fontFamily: f.family,
        fontWeight: f.weight,
        fontSize: `${size * (f.scale ?? 1)}cqw`,
        lineHeight: f.uppercase ? 0.98 : 1.04,
        letterSpacing: f.uppercase ? '0.005em' : '-0.025em',
        textTransform: f.uppercase ? 'uppercase' : undefined,
        color: t.text,
        textWrap: 'balance',
      }}
    >
      {nb(c.heading)}
    </span>
  )
}

function Lines({ ctx, count = 3, align }: { ctx: Ctx; count?: number; align?: 'start' | 'center' }) {
  const widths = ['100%', '92%', '97%', '84%', '64%']
  return (
    <span style={{ display: 'grid', gap: '0.9cqw', justifyItems: align === 'center' ? 'center' : 'start', width: '100%' }}>
      {Array.from({ length: count }, (_, i) => (
        <Bar key={i} w={i === count - 1 ? '58%' : widths[i % widths.length]} h="0.85cqw" color={mix(ctx.t.muted, ctx.live ? 55 : 100)} />
      ))}
    </span>
  )
}

function Copy({ ctx, align = 'start', size }: { ctx: Ctx; align?: 'start' | 'center'; size: number }) {
  const { live, t, c } = ctx
  const center = align === 'center'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left',
        gap: '1.8cqw',
        height: '100%',
        minHeight: 0,
        padding: center ? '1.5cqw 6cqw 0.5cqw' : '0.5cqw 0',
      }}
    >
      <Heading ctx={ctx} size={size} align={align} />
      {live ? (
        <span style={{ display: 'block', fontSize: '1.55cqw', lineHeight: 1.5, color: t.muted, maxWidth: '38cqw' }}>
          {c.text}
        </span>
      ) : (
        <span style={{ width: center ? '60%' : '80%' }}>
          <Lines ctx={ctx} count={2} align={align} />
        </span>
      )}
      {live ? (
        <ButtonSample item={ctx.button} colors={t} label={c.cta} style={{ fontSize: '1.45cqw' }} />
      ) : (
        <Bar w="13cqw" h="3.6cqw" color={t.accent} />
      )}
    </div>
  )
}

function Picture({ ctx, src, style, children }: { ctx: Ctx; src?: string; style: CSSProperties; children?: ReactNode }) {
  const { live, t, radius, effect, eager } = ctx
  const round = `${radius}cqw`
  let fill: ReactNode

  if (!live) {
    fill = (
      <span
        className="absolute inset-0 grid place-items-center"
        style={{ background: mix(t.text, 7), borderRadius: round, color: mix(t.text, 40) }}
      >
        <span style={{ width: '4.5cqw', height: '4.5cqw', display: 'block' }}>
          <ImageIcon size="100%" weight="duotone" />
        </span>
      </span>
    )
  } else if (src) {
    fill = (
      <img
        src={src}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ borderRadius: round }}
      />
    )
  } else if (effect === 'glass') {
    fill = (
      <span
        className="absolute inset-0"
        style={{
          borderRadius: round,
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.28)',
          backdropFilter: 'blur(6px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
        }}
      />
    )
  } else {
    fill = (
      <span
        className="absolute inset-0"
        style={{
          borderRadius: round,
          background: `linear-gradient(135deg, ${mix(t.accent, 70)}, ${mix(t.accent2 ?? t.text, 30)})`,
        }}
      />
    )
  }

  return (
    <div style={{ ...style, position: 'relative', minHeight: 0, minWidth: 0 }}>
      {fill}
      {children}
    </div>
  )
}

function Cell({ cell, ctx, fraction, image }: { cell: LayoutCell; ctx: Ctx; fraction: number; image?: string }) {
  const style: CSSProperties = { gridArea: cell.area, minHeight: 0, minWidth: 0 }
  const headingSize = Math.min(6, Math.max(3.6, 2.9 + 3.3 * fraction))

  switch (cell.kind) {
    case 'copy':
      return (
        <div style={style}>
          <Copy ctx={ctx} align={cell.align} size={headingSize} />
        </div>
      )
    case 'headline':
      return (
        <div style={{ ...style, display: 'flex', alignItems: 'flex-end', paddingBottom: '0.6cqw' }}>
          <Heading ctx={ctx} size={headingSize + 0.6} />
        </div>
      )
    case 'text':
      return (
        <div style={{ ...style, paddingTop: '0.6cqw', borderTop: ctx.effect === 'rules' ? `1px solid ${mix(ctx.t.text, 25)}` : undefined }}>
          <Lines ctx={ctx} count={5} />
        </div>
      )
    case 'image':
    case 'tile':
      return <Picture ctx={ctx} src={image} style={style} />
    case 'overlay': {
      const overlayCtx: Ctx = ctx.live
        ? { ...ctx, t: { ...ctx.t, text: '#ffffff', muted: 'rgba(255,255,255,0.82)' } }
        : ctx
      return (
        <Picture ctx={ctx} src={image} style={style}>
          {ctx.live && (
            <span
              className="absolute inset-0"
              style={{
                borderRadius: `${ctx.radius}cqw`,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.58))',
              }}
            />
          )}
          <div className="relative h-full">
            <Copy ctx={overlayCtx} align={cell.align} size={headingSize} />
          </div>
        </Picture>
      )
    }
    case 'card':
      return (
        <div
          style={{
            ...style,
            display: 'grid',
            gridTemplateRows: '1fr auto',
            gap: '1.2cqw',
            padding: '1cqw',
            borderRadius: `${ctx.radius}cqw`,
            background: ctx.effect === 'glass' ? 'rgba(255,255,255,0.12)' : ctx.live ? ctx.t.surface : mix(ctx.t.text, 5),
            border: `1px solid ${mix(ctx.t.text, ctx.live ? 10 : 12)}`,
          }}
        >
          <Picture ctx={{ ...ctx, radius: Math.max(0, ctx.radius - 0.4) }} src={image} style={{}} />
          <span style={{ display: 'grid', gap: '0.8cqw', padding: '0 0.4cqw 0.4cqw' }}>
            <Bar w="70%" h="1.1cqw" color={mix(ctx.t.text, ctx.live ? 80 : 70)} />
            <Bar w="45%" h="0.8cqw" color={mix(ctx.t.muted, ctx.live ? 60 : 100)} />
          </span>
        </div>
      )
  }
}

function Decor({ ctx }: { ctx: Ctx }) {
  const { effect, t } = ctx
  if (effect === 'glass') {
    return (
      <span
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 18% 28%, #7a5cff 0, transparent 42%), radial-gradient(circle at 82% 18%, ${t.accent2 ?? '#ff7ac6'} 0, transparent 38%), radial-gradient(circle at 62% 92%, #36c8ff 0, transparent 44%)`,
          filter: 'blur(4px)',
        }}
      />
    )
  }
  if (effect === 'grid') {
    return (
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${mix(t.accent, 14)} 1px, transparent 1px), linear-gradient(90deg, ${mix(t.accent, 14)} 1px, transparent 1px)`,
          backgroundSize: '5cqw 5cqw',
          maskImage: 'radial-gradient(circle at 70% 40%, black, transparent 75%)',
        }}
      />
    )
  }
  if (effect === 'glow') {
    return (
      <span
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 85% 10%, ${mix(t.accent, 38)}, transparent 50%)` }}
      />
    )
  }
  if (effect === 'shapes') {
    return (
      <>
        <span
          className="absolute rounded-full"
          style={{ width: '22cqw', height: '22cqw', left: '-6cqw', bottom: '-8cqw', border: `0.7cqw solid ${t.text}` }}
        />
        <span
          className="absolute"
          style={{ width: '9cqw', height: '9cqw', right: '5cqw', top: '16%', background: t.text, transform: 'rotate(18deg)', borderRadius: '1.5cqw' }}
        />
      </>
    )
  }
  return null
}

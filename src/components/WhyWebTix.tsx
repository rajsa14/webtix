import { CheckIcon, PathIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { colorPalettes } from '../data/colorPalettes'
import { reasons } from '../data/content'
import { fonts } from '../data/fonts'
import { SITE } from '../data/site'
import { team } from '../data/team'
import { spotlightMove } from '../lib/hooks'
import { cx, nb } from '../lib/text'
import { Reveal } from './Reveal'

export function WhyWebTix() {
  const [design, direct, custom, tech, process] = reasons
  return (
    <section id="proc-webtix" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 className="text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">Proč WebTix</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {nb('Pět věcí, na kterých si u každého projektu zakládáme.')}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          <Cell className="md:col-span-2 lg:col-span-3" title={design.title} text={design.text} delay={0}>
            <DesignVisual />
          </Cell>
          <Cell className="lg:col-span-3" title={direct.title} text={direct.text} delay={0.06}>
            <DirectVisual />
          </Cell>
          <Cell className="lg:col-span-2" title={custom.title} text={custom.text} delay={0.12} tone="accent">
            <PathIcon size={44} weight="duotone" className="text-white" />
          </Cell>
          <Cell className="lg:col-span-2" title={tech.title} text={tech.text} delay={0.18}>
            <ul className="flex flex-wrap gap-2" aria-label="Technologie">
              {['React', 'TypeScript', 'Vite', 'Tailwind CSS'].map((t) => (
                <li key={t} className="rounded-full border border-line-strong bg-ink-850 px-3 py-1.5 font-mono text-[12.5px] text-fg/90">
                  {t}
                </li>
              ))}
            </ul>
          </Cell>
          <Cell className="md:col-span-2 lg:col-span-2" title={process.title} text={process.text} delay={0.24}>
            <ProcessVisual />
          </Cell>
        </div>
      </div>
    </section>
  )
}

function Cell({
  title,
  text,
  children,
  className,
  delay,
  tone = 'default',
}: {
  title: string
  text: string
  children: ReactNode
  className?: string
  delay: number
  tone?: 'default' | 'accent'
}) {
  return (
    <Reveal delay={delay} className={cx('min-w-0', className)}>
      <article
        onPointerMove={spotlightMove}
        className={cx(
          'spotlight flex h-full flex-col justify-between gap-10 overflow-hidden rounded-card border p-6 sm:p-8',
          tone === 'accent'
            ? 'border-accent/60 bg-[linear-gradient(145deg,#4460f5,#2a3cc4_60%,#1b2a93)]'
            : 'border-line bg-ink-900',
        )}
      >
        <div>{children}</div>
        <div>
          <h3 className="text-[1.45rem] font-semibold leading-tight tracking-[-0.02em]">{title}</h3>
          <p className={cx('mt-2.5 max-w-md leading-relaxed', tone === 'accent' ? 'text-white/85' : 'text-muted')}>
            {nb(text)}
          </p>
        </div>
      </article>
    </Reveal>
  )
}

function DesignVisual() {
  const sample = [fonts[2], fonts[3], fonts[6]]
  const palettes = [colorPalettes[1], colorPalettes[4], colorPalettes[6]]
  return (
    <div className="flex flex-wrap items-center gap-2.5" aria-hidden="true">
      {sample.map((f) => (
        <span
          key={f.id}
          className="grid size-14 place-items-center rounded-[14px] border border-line bg-ink-850 text-2xl text-fg"
          style={{ fontFamily: f.family, fontWeight: f.weight }}
        >
          Aa
        </span>
      ))}
      {palettes.map((p) => (
        <span key={p.id} className="flex h-14 w-20 overflow-hidden rounded-[14px] border border-line">
          {p.colors.map((c) => (
            <span key={c.hex} className="flex-1" style={{ background: c.hex }} />
          ))}
        </span>
      ))}
    </div>
  )
}

function DirectVisual() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="flex -space-x-3" aria-hidden="true">
        {team.map((m, i) => (
          <span
            key={m.name}
            className={cx(
              'grid size-14 place-items-center rounded-full border-2 border-ink-900 font-display text-lg font-bold',
              i === 0 ? 'bg-accent-strong text-white' : 'bg-fg text-ink-950',
            )}
          >
            {m.initials}
          </span>
        ))}
      </span>
      <a
        href={`mailto:${SITE.email}`}
        className="rounded-full border border-line-strong bg-ink-850 px-4 py-2 font-mono text-[13px] text-fg transition-colors hover:border-accent hover:text-accent-soft"
      >
        {SITE.email}
      </a>
    </div>
  )
}

function ProcessVisual() {
  const stages = ['Výběr', 'Ukázka', 'Cena', 'Web']
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label="Průběh projektu">
      {stages.map((s, i) => (
        <li key={s} className="flex items-center gap-1.5">
          <span
            className={cx(
              'inline-flex h-8 items-center gap-1 rounded-full px-3 text-[12.5px]',
              i < 2 ? 'bg-accent-strong text-white' : 'border border-line-strong text-muted',
            )}
          >
            {i < 2 && <CheckIcon size={12} weight="bold" />}
            {s}
          </span>
          {i < stages.length - 1 && <span className="h-px w-2 bg-line-strong" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  )
}

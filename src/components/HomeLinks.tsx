import { ArrowUpRightIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { catalog } from '../data/catalog'
import { steps } from '../data/content'
import { references } from '../data/references'
import { PAGES, SITE } from '../data/site'
import { team } from '../data/team'
import { cx } from '../lib/text'
import { Reveal } from './Reveal'

/** The homepage signpost: a few large tiles, each leading to its own page. */
export function HomeLinks() {
  const reference = references[0]

  return (
    <section aria-labelledby="rozcestnik" className="relative py-20 sm:py-28">
      <div className="container-x">
        <h2 id="rozcestnik" className="sr-only">
          Kam dál
        </h2>
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          <Tile
            href={PAGES.catalog}
            label={`${catalog.length} kroků`}
            title="Katalog"
            text="Písmo, barvy, fotky, styl, tlačítka a layout. Naklikejte si, co se vám líbí."
            className="bg-accent text-white shadow-[10px_10px_0_0_var(--color-fg)] hover:shadow-[14px_14px_0_0_var(--color-fg)] lg:min-h-[440px]"
            span="lg:col-span-8"
            titleClassName="text-[clamp(4rem,11vw,9.5rem)]"
            arrowClassName="bg-white text-fg"
          />

          <Tile
            href={PAGES.process}
            label="Postup"
            title="Jak to funguje"
            className="bg-fg text-ink-950"
            span="lg:col-span-4"
            arrowClassName="bg-ink-950 text-fg"
          >
            <ol className="mt-6 grid gap-2.5 text-[15px]">
              {steps.map((step) => (
                <li key={step.number} className="flex gap-3 border-t border-ink-950/20 pt-2.5">
                  <span className="font-mono text-[12px] text-ink-950/60">{step.number}</span>
                  {step.title}
                </li>
              ))}
            </ol>
          </Tile>

          {reference && (
            <Tile
              href={PAGES.references}
              label="Práce"
              title="Reference"
              className="min-h-[340px] border border-fg bg-ink-800 text-white"
              span="lg:col-span-5"
              arrowClassName="bg-white text-fg"
              background={
                <>
                  <img
                    src={import.meta.env.BASE_URL + reference.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  />
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-fg/95 via-fg/65 to-fg/55" />
                </>
              }
            />
          )}

          <Tile
            href={PAGES.about}
            label="Studio"
            title="O nás"
            text={team.map((member) => member.name).join(' a ')}
            className="border border-fg bg-ink-900"
            span={reference ? 'lg:col-span-4' : 'lg:col-span-7'}
            arrowClassName="bg-fg text-ink-950"
            background={
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-1 top-16 -z-10 font-display text-[9rem] font-extrabold leading-none tracking-[-0.07em] text-fg/[0.07] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2"
            >
              {team.map((member) => member.initials[0]).join('&')}
            </span>
            }
          />

          <Tile
            href={PAGES.contact}
            label="Poptávka"
            title="Kontakt"
            text={SITE.email}
            className="bg-accent-tint"
            span={reference ? 'lg:col-span-3' : 'lg:col-span-5'}
            arrowClassName="bg-accent text-white"
          />
        </div>
      </div>
    </section>
  )
}

function Tile({
  href,
  label,
  title,
  text,
  className,
  span,
  titleClassName = 'text-[clamp(2.4rem,4.4vw,3.6rem)]',
  arrowClassName,
  background,
  children,
}: {
  href: string
  label: string
  title: string
  text?: string
  className?: string
  /** Grid columns the tile takes on desktop. */
  span: string
  titleClassName?: string
  arrowClassName?: string
  /** Decoration behind the text, positioned against the whole tile. */
  background?: ReactNode
  children?: ReactNode
}) {
  return (
    <Reveal className={cx('flex', span)}>
      <a
        href={href}
        data-cursor="Otevřít"
        className={cx(
          'group relative isolate flex min-h-[260px] w-full flex-col justify-between overflow-hidden rounded-card p-6 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-8',
          className,
        )}
      >
        {background}
        <span className="flex items-start justify-between gap-4">
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] opacity-75">{label}</span>
          <span
            className={cx(
              'grid size-11 shrink-0 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45',
              arrowClassName,
            )}
          >
            <ArrowUpRightIcon size={18} weight="bold" />
          </span>
        </span>
        <span className="relative mt-10 block">
          <span className={cx('block font-display font-extrabold leading-[0.9] tracking-[-0.055em]', titleClassName)}>
            {title}
          </span>
          {text && <span className="mt-3 block max-w-md text-[15px] leading-relaxed opacity-80">{text}</span>}
          {children}
        </span>
      </a>
    </Reveal>
  )
}

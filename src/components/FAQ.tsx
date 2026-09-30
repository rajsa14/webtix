import { PlusIcon } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { faq } from '../data/content'
import { SITE } from '../data/site'
import { cx, nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal className="self-start lg:sticky lg:top-28">
          <SectionLabel number="07">FAQ</SectionLabel>
          <h2 className="display-xl">Časté otázky</h2>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">
            Nenašli jste odpověď? Napište nám na{' '}
            <a href={`mailto:${SITE.email}`} className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              {SITE.email}
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-t border-line">
            {faq.map((item, i) => (
              <FaqItem key={item.q} q={item.q} a={item.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div className="border-b border-line">
      <h3 className="font-sans">
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-[1.2rem] font-medium tracking-[-0.015em] transition-colors group-hover:text-accent sm:text-[1.4rem]">
            {q}
          </span>
          <span
            className={cx(
              'grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]',
              open ? 'rotate-45 border-accent bg-accent-strong text-white' : 'border-line-strong text-muted group-hover:border-fg/25',
            )}
          >
            <PlusIcon size={16} weight="bold" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={cx(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-7 pr-14 text-[1.05rem] leading-relaxed text-muted">{nb(a)}</p>
        </div>
      </div>
    </div>
  )
}

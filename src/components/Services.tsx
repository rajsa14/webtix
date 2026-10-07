import { ArrowRightIcon } from '@phosphor-icons/react'
import { useReducedMotion } from 'motion/react'
import { SITE } from '../data/site'
import { useT } from '../i18n'
import { nb } from '../lib/text'
import { useUi } from '../store/ui'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

/**
 * What the studio builds, on an ink band for contrast. "Poptat" pre-fills
 * the web type in the inquiry form and scrolls there.
 */
export function Services() {
  const t = useT()
  const s = t.services
  const reduce = useReducedMotion()

  const ask = (webType: string, label: string) => {
    const ui = useUi.getState()
    ui.setPresetWebType(webType)
    ui.toast(t.form.presetToast(label), 'info')
    document.getElementById('poptavka')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="sluzby" className="relative bg-fg py-24 text-ink-950 sm:py-32">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="max-w-4xl">
            <SectionLabel number="05" inverted>
              {s.label}
            </SectionLabel>
            <h2 className="display-xl">
              {s.title}
              <span className="text-accent">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-ink-950/70">{nb(s.lead)}</p>
        </Reveal>

        <ol className="mt-16 grid border-t border-ink-950/25 sm:mt-20 md:grid-cols-2 xl:grid-cols-4">
          {s.items.map((item, i) => {
            const label = t.form.webTypes.find((o) => o.value === item.webType)?.label ?? item.title
            return (
              <li
                key={item.id}
                className="group border-b border-ink-950/25 md:odd:border-r xl:border-r xl:last:border-r-0"
              >
                <Reveal delay={i * 0.06} className="flex h-full flex-col px-1 py-8 transition-colors duration-500 group-hover:bg-ink-950/[0.04] md:px-7 md:py-10">
                  <span className="font-mono text-sm text-ink-950/55">0{i + 1}</span>
                  <h3 className="mt-6 text-[clamp(2rem,3vw,2.6rem)] font-extrabold leading-[0.95] tracking-[-0.05em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-ink-950/70">{nb(item.text)}</p>
                  <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-950/50">{s.includes}</p>
                  <ul className="mt-3 grid gap-2 text-[15px]">
                    {item.includes.map((inc) => (
                      <li key={inc} className="flex items-baseline gap-2.5">
                        <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-accent" aria-hidden="true" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-10">
                    <button
                      type="button"
                      onClick={() => ask(item.webType, label)}
                      className="group/b inline-flex h-11 items-center gap-2 rounded-full border border-ink-950/60 px-5 text-[14.5px] font-medium transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-white"
                    >
                      {s.cta}
                      <span className="sr-only">: {item.title}</span>
                      <ArrowRightIcon size={15} weight="bold" className="transition-transform duration-300 group-hover/b:translate-x-0.5" />
                    </button>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>

        <Reveal className="mt-10">
          <p className="text-ink-950/70">
            {nb(s.footnote)}{' '}
            <a href={`mailto:${SITE.email}`} className="text-ink-950 underline decoration-ink-950/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">
              {SITE.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

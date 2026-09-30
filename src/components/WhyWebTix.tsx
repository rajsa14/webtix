import { motion } from 'motion/react'
import { reasons } from '../data/content'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { EASE, Reveal } from './Reveal'

export function WhyWebTix() {
  return (
    <section id="proc-webtix" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <SectionLabel number="06">Proč my</SectionLabel>
          <h2 className="display-xl max-w-5xl">
            Dva lidi. Žádná agentura<span className="text-accent">.</span>
          </h2>
        </Reveal>

        <ol className="mt-16 border-t border-fg sm:mt-20">
          {reasons.map((reason, i) => (
            <motion.li
              key={reason.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.04, ease: EASE }}
              className="group grid gap-3 border-b border-fg py-7 transition-colors duration-500 hover:bg-fg hover:text-ink-950 sm:grid-cols-[5rem_1fr_1.1fr] sm:items-baseline sm:gap-8 sm:px-4 sm:py-9">
                <span className="font-mono text-sm text-accent transition-colors group-hover:text-ink-950/60">
                  0{i + 1}
                </span>
                <h3 className="text-[clamp(1.9rem,3.6vw,3rem)] font-extrabold leading-[0.95] tracking-[-0.045em] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                  {reason.title}
                </h3>
                <p className="max-w-md text-[1.05rem] leading-relaxed text-muted transition-colors group-hover:text-ink-950/75">
                  {nb(reason.text)}
                </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

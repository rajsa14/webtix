import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { useT } from '../i18n'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'
import { Team } from './Team'

export function About() {
  const t = useT()
  return (
    <section id="o-nas" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <SectionLabel number="06">{t.about.label}</SectionLabel>
          <h2 className="display-xl">
            {t.about.title}
            <span className="text-accent">.</span>
          </h2>
        </Reveal>

        {/* key: restart the word animation when the language changes */}
        <WordReveal
          key={t.about.statement}
          text={t.about.statement}
          className="mt-10 max-w-[1100px] font-display text-[clamp(1.45rem,3.1vw,2.6rem)] font-medium leading-[1.22] tracking-[-0.022em] sm:mt-14"
        />

        <div className="mt-12 grid max-w-[1100px] gap-6 text-[1.075rem] leading-relaxed text-muted md:grid-cols-2 md:gap-12">
          {t.about.paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{nb(p)}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 sm:mt-28">
          <Reveal>
            <h3 className="font-mono text-[12px] font-normal uppercase tracking-[0.14em] text-muted">{t.about.principlesTitle}</h3>
          </Reveal>
          <ol className="mt-6 grid border-t border-fg md:grid-cols-3">
            {t.about.principles.map((item, i) => (
              <li
                key={i}
                className="border-b border-fg py-7 md:border-b-0 md:border-r md:px-7 md:py-9 md:first:pl-0 md:last:border-r-0"
              >
                <Reveal delay={i * 0.08}>
                  <span className="font-mono text-sm text-accent">0{i + 1}</span>
                  <h4 className="mt-4 text-[clamp(1.6rem,2.6vw,2.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">{item.title}</h4>
                  <p className="mt-3 max-w-sm leading-relaxed text-muted">{nb(item.text)}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Team />
      </div>
    </section>
  )
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
function WordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 50%'] })
  const words = nb(text).split(' ')

  if (reduce) return <p className={className}>{nb(text)}</p>

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {word}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </>
  )
}

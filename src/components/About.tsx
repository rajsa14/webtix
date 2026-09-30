import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { aboutParagraphs } from '../data/content'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'
import { Team } from './Team'

export function About() {
  return (
    <section id="o-nas" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <SectionLabel number="05">O nás</SectionLabel>
          <h2 className="display-xl">
            Kdo stojí za WebTix?
          </h2>
        </Reveal>

        <WordReveal
          text={aboutParagraphs[0]}
          className="mt-10 max-w-[1100px] font-display text-[clamp(1.45rem,3.1vw,2.6rem)] font-medium leading-[1.22] tracking-[-0.022em] sm:mt-14"
        />

        <div className="mt-12 grid max-w-[1100px] gap-6 text-[1.075rem] leading-relaxed text-muted md:grid-cols-2 md:gap-12">
          {aboutParagraphs.slice(1).map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p>{nb(p)}</p>
            </Reveal>
          ))}
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

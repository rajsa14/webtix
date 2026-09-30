import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { steps } from '../data/content'
import { nb } from '../lib/text'
import { SectionLabel } from './Decor'
import { Reveal } from './Reveal'

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })

  return (
    <section id="jak-to-funguje" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <SectionLabel number="01">Postup</SectionLabel>
          <h2 className="display-xl">
            Jak to funguje<span className="text-accent">.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {nb('Od první inspirace po hotový web. Bez složitých briefů a technického žargonu.')}
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14 sm:mt-20">
          
          <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, i) => {
            return (
              <li key={step.number} className="relative flex flex-col">
                <StepNode number={step.number} progress={progress} at={i / (steps.length - 1)} />
                <Reveal delay={i * 0.08} className="flex-1 lg:mt-4">
                  <div className="group flex h-full flex-col border-t border-fg pt-5">
                    <span className="font-display text-[4.5rem] font-extrabold leading-none tracking-[-0.06em] text-accent lg:hidden" aria-hidden="true">
                      {step.number}
                    </span>
                    <h3 className="mt-6 text-[1.6rem] font-extrabold leading-[1.02] tracking-[-0.04em] lg:mt-2">
                      <span className="sr-only">Krok {step.number}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{nb(step.text)}</p>
                  </div>
                </Reveal>
              </li>
            )
          })}
          </ol>
        </div>
      </div>
    </section>
  )
}

function StepNode({ number, progress, at }: { number: string; progress: MotionValue<number>; at: number }) {
  const lit = useTransform(progress, [Math.max(0, at - 0.08), at], [0, 1])
  return (
    <div aria-hidden="true" className="relative z-[1] hidden lg:block">
      <span className="relative inline-block font-display text-[6.5rem] font-extrabold leading-[0.9] tracking-[-0.07em] text-fg/15">
        {number}
        <motion.span style={{ opacity: lit }} className="absolute inset-0 text-accent">
          {number}
        </motion.span>
      </span>
    </div>
  )
}

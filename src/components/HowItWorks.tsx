import { CursorClickIcon, MagnifyingGlassIcon, PaperPlaneTiltIcon, SparkleIcon } from '@phosphor-icons/react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { steps } from '../data/content'
import { spotlightMove } from '../lib/hooks'
import { nb } from '../lib/text'
import { Reveal } from './Reveal'

const ICONS = [MagnifyingGlassIcon, CursorClickIcon, PaperPlaneTiltIcon, SparkleIcon]

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })

  return (
    <section id="jak-to-funguje" className="relative py-24 sm:py-32">
      <div className="container-x">
        <Reveal className="max-w-2xl">
          <h2 className="text-[clamp(2.3rem,5vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
            Jak to funguje
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {nb('Od první inspirace po hotový web. Bez složitých briefů a technického žargonu.')}
          </p>
        </Reveal>

        <div ref={ref} className="relative mt-14 sm:mt-20">
          <div aria-hidden="true" className="absolute inset-x-0 top-[15px] hidden h-px bg-line lg:block">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-accent" />
          </div>

          <ol className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, i) => {
            const Icon = ICONS[i]
            return (
              <li key={step.number} className="relative flex flex-col">
                <StepNode number={step.number} progress={progress} at={i / (steps.length - 1)} />
                <Reveal delay={i * 0.08} className="flex-1 lg:mt-8">
                  <div
                    onPointerMove={spotlightMove}
                    className="spotlight group flex h-full flex-col rounded-card border border-line bg-ink-900 p-6 transition-colors duration-500 hover:border-line-strong sm:p-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-[14px] border border-line bg-ink-800 text-accent-soft transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-105">
                        <Icon size={22} weight="duotone" />
                      </span>
                      <span className="font-mono text-sm text-faint lg:hidden" aria-hidden="true">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="mt-8 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em]">
                      <span className="sr-only">Krok {step.number}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-muted">{nb(`„${step.text}“`)}</p>
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
      <span className="relative inline-grid h-8 place-items-center overflow-hidden rounded-full border border-line-strong bg-ink-950 px-3 font-mono text-[12px] text-muted">
        <motion.span style={{ opacity: lit }} className="absolute inset-0 bg-accent" />
        <span className="relative text-fg">{number}</span>
      </span>
    </div>
  )
}

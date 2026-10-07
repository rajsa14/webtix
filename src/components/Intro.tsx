import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { useT } from '../i18n'
import { INTRO_HOLD, INTRO_PLAYS } from '../lib/intro'
import { EASE } from './Reveal'

/** A short ink curtain with the wordmark and a counter, lifted on first load. */
export function Intro() {
  const [show, setShow] = useState(INTRO_PLAYS)
  const t = useT()
  const count = useMotionValue(0)
  const label = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))

  useEffect(() => {
    if (!show) return
    const controls = animate(count, 100, { duration: INTRO_HOLD * 0.9, ease: [0.65, 0, 0.35, 1] })
    const timer = window.setTimeout(() => setShow(false), INTRO_HOLD * 1000)
    return () => {
      controls.stop()
      window.clearTimeout(timer)
    }
  }, [show, count])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden="true"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-fg p-5 text-ink-950 sm:p-8"
        >
          <div className="flex justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-ink-950/60">
            <span>{t.hero.meta[0]}</span>
            <span>{t.intro.loading}</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.8, ease: EASE }}
                className="block font-display text-[clamp(4rem,17vw,15rem)] font-extrabold leading-[0.85] tracking-[-0.07em]"
              >
                WebTix<span className="text-accent">.</span>
              </motion.span>
            </span>
            <motion.span className="pb-2 font-mono text-[clamp(1rem,2vw,1.4rem)] tabular-nums">{label}</motion.span>
          </div>
          <motion.span
            className="absolute inset-x-0 bottom-0 h-1 origin-left bg-accent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: INTRO_HOLD * 0.9, ease: [0.65, 0, 0.35, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

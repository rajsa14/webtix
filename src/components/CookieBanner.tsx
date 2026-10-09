import { AnimatePresence, motion } from 'motion/react'
import { PAGES } from '../data/site'
import { nb } from '../lib/text'
import { useConsent } from '../store/consent'
import { EASE } from './Reveal'

/** Both answers are one click and the same size, so declining is as easy as agreeing. */
export function CookieBanner() {
  const open = useConsent((s) => s.bannerOpen)
  const decide = useConsent((s) => s.decide)
  const choice = 'h-11 flex-1 rounded-full px-5 text-[14.5px] font-medium transition-colors duration-300'

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          aria-labelledby="cookies-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: EASE }}
          // Bottom right on desktop, above the "Můj výběr" button, so it never covers the hero buttons.
          className="fixed inset-x-3 bottom-3 z-[58] rounded-card border border-fg bg-ink-900 p-5 shadow-[0_24px_50px_-28px_rgb(18_18_16/0.55)] sm:inset-x-auto sm:bottom-24 sm:right-5 sm:w-[380px] sm:p-6"
        >
          <h2 id="cookies-title" className="font-display text-[1.25rem] font-extrabold leading-tight tracking-[-0.03em]">
            Můžeme počítat návštěvy?
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {nb('Měříme si je sami, bez reklam a třetích stran. Když to povolíte, poznáme i opakovanou návštěvu.')}{' '}
            <a href={PAGES.privacy} className="text-fg underline underline-offset-2 hover:text-accent">
              Více informací
            </a>
          </p>
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={() => decide('necessary')}
              className={`${choice} border border-fg text-fg hover:bg-fg hover:text-ink-950`}
            >
              Jen nezbytné
            </button>
            <button
              type="button"
              onClick={() => decide('all')}
              className={`${choice} bg-fg text-ink-950 hover:bg-accent hover:text-white`}
            >
              Povolit
            </button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}

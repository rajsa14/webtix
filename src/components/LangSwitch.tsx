import { motion } from 'motion/react'
import { useLang, useT, type Lang } from '../i18n'
import { cx } from '../lib/text'

const OPTIONS: { lang: Lang; label: string }[] = [
  { lang: 'cs', label: 'CZ' },
  { lang: 'en', label: 'EN' },
]

/** CZ / EN toggle. The active language sits on a sliding ink pill. */
export function LangSwitch({ className, id = 'lang' }: { className?: string; id?: string }) {
  const lang = useLang((s) => s.lang)
  const setLang = useLang((s) => s.setLang)
  const t = useT()

  return (
    <div
      role="group"
      aria-label={t.lang.label}
      className={cx('relative flex h-11 items-center rounded-full border border-fg p-1 font-mono text-[12px] tracking-[0.1em]', className)}
    >
      {OPTIONS.map((o) => {
        const active = o.lang === lang
        return (
          <button
            key={o.lang}
            type="button"
            lang={o.lang}
            onClick={() => setLang(o.lang)}
            aria-pressed={active}
            title={active ? undefined : t.lang.switchTo}
            className={cx(
              'relative grid h-full w-9 place-items-center rounded-full transition-colors duration-300',
              active ? 'text-ink-950' : 'text-muted hover:text-fg',
            )}
          >
            {active && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

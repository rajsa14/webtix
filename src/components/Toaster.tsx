import { CheckCircleIcon, InfoIcon, WarningCircleIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { cx } from '../lib/text'
import { useUi } from '../store/ui'

const ICON = { success: CheckCircleIcon, info: InfoIcon, error: WarningCircleIcon }

export function Toaster() {
  const toasts = useUi((s) => s.toasts)
  const dismiss = useUi((s) => s.dismissToast)

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-[60] flex flex-col items-center gap-2 px-3 sm:bottom-6 sm:left-6 sm:right-auto sm:top-auto sm:items-start"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const Icon = ICON[t.tone]
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              role={t.tone === 'error' ? 'alert' : 'status'}
              onClick={() => dismiss(t.id)}
              className="pointer-events-auto flex max-w-[min(420px,calc(100vw-24px))] cursor-pointer items-center gap-2.5 rounded-full border border-line-strong bg-ink-800/95 py-2.5 pl-3 pr-4 text-[14px] shadow-[0_20px_40px_-20px_rgb(17_17_16/0.22)] backdrop-blur-xl"
            >
              <Icon
                size={18}
                weight="fill"
                className={cx(
                  'shrink-0',
                  t.tone === 'success' && 'text-success',
                  t.tone === 'info' && 'text-accent',
                  t.tone === 'error' && 'text-danger',
                )}
              />
              <span className="text-fg">{t.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

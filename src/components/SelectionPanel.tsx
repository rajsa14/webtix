import { ArrowRightIcon, SquaresFourIcon, TrashIcon, XIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type Ref, type RefObject } from 'react'
import { catalog } from '../data/catalog'
import { plural, useEscape, useFocusTrap, useScrollLock } from '../lib/hooks'
import { cx, scrollToId } from '../lib/text'
import { countCategoriesDone, countSelected, isUnlocked, nextOpenCategory, resetNote, useSelection } from '../store/selection'
import { useUi } from '../store/ui'
import { LivePreview } from './LivePreview'
import { ItemToken } from './previews/ItemToken'
import { EASE } from './Reveal'

export function SelectionPanel() {
  const open = useUi((s) => s.panelOpen)
  const setOpen = useUi((s) => s.setPanelOpen)
  const selected = useSelection((s) => s.selected)
  const total = countSelected(selected)
  const done = countCategoriesDone(selected)
  const fabRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <SelectionFab ref={fabRef} total={total} done={done} onOpen={() => setOpen(true)} hidden={open} />
      <SelectionDrawer open={open} onClose={() => setOpen(false)} returnFocus={fabRef} />
    </>
  )
}

function SelectionFab({
  total,
  done,
  onOpen,
  hidden,
  ref,
}: {
  total: number
  done: number
  onOpen: () => void
  hidden: boolean
  ref: Ref<HTMLButtonElement>
}) {
  const circumference = 2 * Math.PI * 15
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: hidden ? 80 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: hidden ? 0 : 0.2 }}
      className="fixed inset-x-3 bottom-3 z-[45] sm:inset-x-auto sm:bottom-5 sm:right-5"
    >
      <button
        ref={ref}
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Můj výběr, ${total} ${plural(total, ['položka', 'položky', 'položek'])}`}
        tabIndex={hidden ? -1 : 0}
        className="group flex h-14 w-full items-center gap-3 rounded-full bg-fg pl-2 pr-2 text-ink-950 shadow-[0_18px_40px_-18px_rgb(18_18_16/0.5)] transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.98] sm:w-auto"
      >
        <span className="relative grid size-10 place-items-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(239 238 232 / 0.2)" strokeWidth="2.5" />
            <circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="#2433ff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - done / catalog.length)}
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1)' }}
            />
          </svg>
          <SquaresFourIcon size={17} weight="duotone" className="text-ink-950" />
        </span>
        <span className="flex flex-1 flex-col items-start leading-tight">
          <span className="text-[14.5px] font-medium">Můj výběr</span>
          <span className="text-[12px] text-ink-950/60">
            {done}/{catalog.length} kategorií
          </span>
        </span>
        <motion.span
          key={total}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18 }}
          className={cx(
            'ml-2 grid h-7 min-w-7 place-items-center rounded-full px-2 font-mono text-[13px] font-medium',
            total ? 'bg-accent text-white' : 'bg-ink-950/15 text-ink-950/70',
          )}
        >
          {total}
        </motion.span>
      </button>
    </motion.div>
  )
}

function SelectionDrawer({
  open,
  onClose,
  returnFocus,
}: {
  open: boolean
  onClose: () => void
  returnFocus: RefObject<HTMLButtonElement | null>
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const dragControls = useDragControls()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const close = useCallback(() => onClose(), [onClose])
  useScrollLock(open)
  useEscape(open, close)
  useFocusTrap(open, panelRef)

  const wasOpen = useRef(false)
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      closeRef.current?.focus()
    } else if (wasOpen.current) {
      wasOpen.current = false
      returnFocus.current?.focus({ preventScroll: true })
    }
  }, [open, returnFocus])

  const goTo = (id: string) => {
    onClose()
    useUi.getState().openCatalog()
    window.setTimeout(() => scrollToId(id), 60)
  }

  const hidden = isMobile ? { y: '100%' } : { x: '105%' }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-fg/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="selection-title"
            initial={hidden}
            animate={{ x: 0, y: 0 }}
            exit={hidden}
            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 36 }}
            drag={isMobile ? 'y' : false}
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) close()
            }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90dvh] flex-col rounded-t-[24px] border border-line-strong bg-ink-900 shadow-[0_-30px_80px_-30px_rgb(17_17_16/0.22)] sm:inset-y-3 sm:left-auto sm:right-3 sm:max-h-none sm:w-[440px] sm:rounded-card"
          >
            <div
              className="flex cursor-grab touch-none justify-center pb-1 pt-3 sm:hidden"
              aria-hidden="true"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <span className="h-1.5 w-11 rounded-full bg-fg/20" />
            </div>
            <DrawerBody onClose={close} closeRef={closeRef} goTo={goTo} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function DrawerBody({
  onClose,
  closeRef,
  goTo,
}: {
  onClose: () => void
  closeRef: RefObject<HTMLButtonElement | null>
  goTo: (id: string) => void
}) {
  const selected = useSelection((s) => s.selected)
  const remove = useSelection((s) => s.remove)
  const clear = useSelection((s) => s.clear)
  const toast = useUi((s) => s.toast)
  const [confirmClear, setConfirmClear] = useState(false)
  const total = countSelected(selected)

  useEffect(() => {
    if (!confirmClear) return
    const t = window.setTimeout(() => setConfirmClear(false), 3500)
    return () => window.clearTimeout(t)
  }, [confirmClear])

  return (
    <>
      <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-3 sm:px-6 sm:pt-6">
        <div>
          <h2 id="selection-title" className="text-2xl font-semibold tracking-[-0.02em]">
            Můj výběr
          </h2>
          <p className="mt-0.5 text-sm text-muted" aria-live="polite">
            {total === 0 ? 'Zatím nic vybráno' : `${total} ${plural(total, ['položka', 'položky', 'položek'])}`}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Zavřít výběr"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:bg-fg/[0.06] hover:text-fg"
        >
          <XIcon size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-6">
        <LivePreview />

        <ul className="mt-6 grid gap-2.5">
          {catalog.map((cat) => {
            const ids = selected[cat.id]
            return (
              <li key={cat.id} className="rounded-[16px] border border-line bg-ink-850 p-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-sans text-[13px] font-medium text-muted">{cat.label}</h3>
                  <button
                    type="button"
                    // A locked category is not on the page yet, so go to the step that opens it.
                    onClick={() => goTo(`kategorie-${isUnlocked(selected, cat.id) ? cat.id : nextOpenCategory(selected)?.id}`)}
                    className="rounded-full px-2 py-1 text-[12.5px] text-accent transition-colors hover:bg-accent/10 hover:text-fg"
                  >
                    {ids.length ? 'Upravit' : 'Vybrat'}
                    <span className="sr-only">: {cat.label}</span>
                  </button>
                </div>
                {ids.length > 0 && (
                  <ul className="mt-2 grid gap-1.5">
                    <AnimatePresence initial={false}>
                      {ids.map((id) => {
                        const item = cat.items.find((i) => i.id === id)
                        if (!item) return null
                        return (
                          <motion.li
                            key={id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center gap-3 rounded-[12px] bg-fg/[0.03] p-1.5 pr-1">
                              <ItemToken category={cat.id} item={item} />
                              <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium">{item.name}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const cleared = remove(cat.id, id)
                                  toast(`${item.name} odebráno z výběru${resetNote(cleared)}`, 'info')
                                }}
                                aria-label={`Odebrat ${item.name}`}
                                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                              >
                                <XIcon size={15} weight="bold" />
                              </button>
                            </div>
                          </motion.li>
                        )
                      })}
                    </AnimatePresence>
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex items-center gap-2 border-t border-line p-4 sm:px-6">
        <button
          type="button"
          disabled={total === 0}
          onClick={() => {
            if (!confirmClear) return setConfirmClear(true)
            clear()
            setConfirmClear(false)
            toast('Výběr byl vymazán', 'info')
          }}
          className={cx(
            'inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm transition-colors disabled:pointer-events-none disabled:opacity-40',
            confirmClear ? 'bg-danger/15 text-danger' : 'text-muted hover:bg-fg/[0.06] hover:text-fg',
          )}
        >
          <TrashIcon size={16} />
          {confirmClear ? 'Opravdu vymazat?' : 'Vymazat'}
        </button>
        <button
          type="button"
          onClick={() => goTo(total ? 'poptavka' : 'katalog')}
          className="group/cta ml-auto inline-flex h-11 items-center gap-2 rounded-full bg-accent-strong px-5 text-[14.5px] font-medium text-white  transition-[background-color,transform] hover:bg-accent active:scale-[0.98]"
        >
          {total ? 'Pokračovat k odeslání' : 'Otevřít katalog'}
          <ArrowRightIcon size={16} weight="bold" className="transition-transform group-hover/cta:translate-x-0.5" />
        </button>
      </div>
    </>
  )
}

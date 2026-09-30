import { create } from 'zustand'

export type ToastTone = 'success' | 'info' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface UiState {
  panelOpen: boolean
  /** The catalog stays behind its big button until the visitor opens it. */
  catalogOpen: boolean
  openCatalog: () => void
  setPanelOpen: (open: boolean) => void
  toasts: Toast[]
  toast: (message: string, tone?: ToastTone) => void
  dismissToast: (id: number) => void
}

let toastId = 0

/** Open straight away for deep links and for visitors with a saved selection. */
const initialCatalogOpen = () => {
  try {
    const hash = window.location.hash
    if (hash === '#katalog' || hash.startsWith('#kategorie-')) return true
    const saved = JSON.parse(localStorage.getItem('webtix-vyber') ?? 'null')
    return Object.values(saved?.state?.selected ?? {}).some((ids) => Array.isArray(ids) && ids.length > 0)
  } catch {
    return false
  }
}

export const useUi = create<UiState>((set, get) => ({
  panelOpen: false,
  catalogOpen: initialCatalogOpen(),
  openCatalog: () => set({ catalogOpen: true }),
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  toasts: [],
  toast: (message, tone = 'success') => {
    const id = ++toastId
    // Keep at most three toasts on screen.
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, tone }] }))
    window.setTimeout(() => get().dismissToast(id), tone === 'error' ? 4200 : 2600)
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

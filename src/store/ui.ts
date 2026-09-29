import { create } from 'zustand'

export type ToastTone = 'success' | 'info' | 'error'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
}

interface UiState {
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
  toasts: Toast[]
  toast: (message: string, tone?: ToastTone) => void
  dismissToast: (id: number) => void
}

let toastId = 0

export const useUi = create<UiState>((set, get) => ({
  panelOpen: false,
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

import { create } from 'zustand'

/** What the visitor just sent, so the thank-you page can show where we will reply. Kept only in memory. */
export interface SentInquiry {
  name: string
  email: string
  currentSite: string
}

interface UiState {
  /** Address typed into the hero box; the enquiry form starts with it filled in. */
  heroSite: string
  setHeroSite: (site: string) => void
  lastInquiry: SentInquiry | null
  setLastInquiry: (inquiry: SentInquiry) => void
}

export const useUi = create<UiState>((set) => ({
  heroSite: '',
  setHeroSite: (heroSite) => set({ heroSite }),
  lastInquiry: null,
  setLastInquiry: (lastInquiry) => set({ lastInquiry }),
}))

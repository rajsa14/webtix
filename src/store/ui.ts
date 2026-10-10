import { create } from 'zustand'

interface UiState {
  /** Who sent the last inquiry, so the thank-you page can greet them. Kept only in memory. */
  lastInquiry: { name: string; email: string } | null
  setLastInquiry: (inquiry: { name: string; email: string }) => void
  /** Address typed into the hero box; the enquiry form starts with it filled in. */
  heroSite: string
  setHeroSite: (site: string) => void
}

export const useUi = create<UiState>((set) => ({
  lastInquiry: null,
  setLastInquiry: (lastInquiry) => set({ lastInquiry }),
  heroSite: '',
  setHeroSite: (heroSite) => set({ heroSite }),
}))

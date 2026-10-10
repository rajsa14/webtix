import { create } from 'zustand'

interface UiState {
  /** Address typed into the hero box; the enquiry form starts with it filled in. */
  heroSite: string
  setHeroSite: (site: string) => void
}

export const useUi = create<UiState>((set) => ({
  heroSite: '',
  setHeroSite: (heroSite) => set({ heroSite }),
}))

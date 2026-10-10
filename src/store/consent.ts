import { create } from 'zustand'
import { CONSENT_NEEDED } from '../data/site'

/** 'all' allows the optional tracking the banner asks about; 'necessary' declines it. */
export type Consent = 'all' | 'necessary'

const KEY = 'webtix-souhlas'

function stored(): Consent | null {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'all' || value === 'necessary' ? value : null
  } catch {
    return null
  }
}

interface ConsentState {
  consent: Consent | null
  bannerOpen: boolean
  decide: (consent: Consent) => void
  openBanner: () => void
}

export const useConsent = create<ConsentState>((set) => ({
  consent: stored(),
  bannerOpen: CONSENT_NEEDED && stored() === null,
  decide: (consent) => {
    try {
      localStorage.setItem(KEY, consent)
    } catch {
      // Private mode: the choice lasts for this visit only.
    }
    set({ consent, bannerOpen: false })
  },
  openBanner: () => set({ bannerOpen: CONSENT_NEEDED }),
}))

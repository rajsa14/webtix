import { create } from 'zustand'
import { onConsentChange } from '../lib/analytics'

/** 'all' also allows the visitor id used for counting returning visitors. */
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

export const useConsent = create<ConsentState>((set, get) => ({
  consent: stored(),
  bannerOpen: stored() === null,
  decide: (consent) => {
    const changed = consent !== get().consent
    try {
      localStorage.setItem(KEY, consent)
    } catch {
      // Private mode: the choice lasts for this visit only.
    }
    set({ consent, bannerOpen: false })
    if (changed) onConsentChange(consent)
  },
  openBanner: () => set({ bannerOpen: true }),
}))

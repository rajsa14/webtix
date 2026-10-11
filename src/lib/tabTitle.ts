import { useEffect } from 'react'

// Tab-away copy approved by Dan (2026-10-11).
const AWAY_TITLE = 'Váš web ještě čeká 👀'
let originalTitle: string | null = null

/** Route metadata can change while hidden; retain the latest real page title. */
export function setPageTitle(title: string) {
  if (originalTitle !== null) originalTitle = title
  else document.title = title
}

/** A single app-level listener; initial HTML and SEO metadata remain unchanged. */
export function useTabTitle() {
  useEffect(() => {
    const restore = () => {
      if (originalTitle === null) return
      document.title = originalTitle
      originalTitle = null
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (originalTitle !== null) return
        originalTitle = document.title
        document.title = AWAY_TITLE
      } else {
        restore()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      restore()
    }
  }, [])
}

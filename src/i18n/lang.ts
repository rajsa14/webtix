import { create } from 'zustand'

export type Lang = 'cs' | 'en'

const STORAGE_KEY = 'webtix-lang'

/**
 * Czech is the default. English comes from `?lang=en` (shareable link) or
 * from the visitor's last choice. Storage can be blocked (private mode,
 * file://), so every access is guarded and the site still works without it.
 */
function initialLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl === 'en' || fromUrl === 'cs') return fromUrl
  } catch {
    // Ignore malformed URLs.
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'cs') return saved
  } catch {
    // Storage blocked.
  }
  return 'cs'
}

function reflect(lang: Lang) {
  document.documentElement.lang = lang
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Storage blocked.
  }
  try {
    const url = new URL(window.location.href)
    if (lang === 'en') url.searchParams.set('lang', 'en')
    else url.searchParams.delete('lang')
    window.history.replaceState(window.history.state, '', url)
  } catch {
    // Some browsers refuse history changes on file:// pages.
  }
}

interface LangState {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const useLang = create<LangState>((set) => ({
  lang: initialLang(),
  setLang: (lang) => {
    reflect(lang)
    set({ lang })
  },
}))

document.documentElement.lang = useLang.getState().lang

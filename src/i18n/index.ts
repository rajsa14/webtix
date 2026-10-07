import { cs, type Dict } from './cs'
import { en } from './en'
import { useLang, type Lang } from './lang'

export { useLang, type Lang } from './lang'
export { useCatalog, localizedCategory, localizedItem } from './catalog'

export const dictionaries: Record<Lang, Dict> = { cs, en }

/** Texts in the current language. Components re-render when it changes. */
export function useT() {
  return dictionaries[useLang((s) => s.lang)]
}

/** For code outside React (toasts fired from handlers, store helpers). */
export const getT = () => dictionaries[useLang.getState().lang]

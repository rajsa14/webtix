import { useSyncExternalStore } from 'react'

/*
 * A page is an address; ordinary <a href="/katalog"> links switch pages without
 * reloading. The offline copy is one file opened from disk, so there the page
 * lives in the hash instead (#/katalog).
 */
const offline = import.meta.env.MODE === 'offline'
const listeners = new Set<() => void>()

function read() {
  if (!offline) return window.location.pathname.replace(/(.)\/$/, '$1')
  return window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : null
}

let path = read() ?? '/'

function sync() {
  const next = read()
  if (next === null || next === path) return
  path = next
  listeners.forEach((listener) => listener())
}

/** Goes to a page, optionally to an element on it: navigate('/katalog#kategorie-fonts'). */
export function navigate(to: string) {
  const [pathname, id] = to.split('#')
  if (pathname !== path) {
    if (offline) window.location.hash = pathname
    else window.history.pushState(null, '', to)
    sync()
  }
  // Wait for the new page to render before scrolling.
  window.setTimeout(() => {
    const target = id ? document.getElementById(id) : null
    if (target) target.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
    if (!id) document.getElementById('obsah')?.focus({ preventScroll: true })
  }, 60)
}

export function usePath() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    () => path,
  )
}

/** Links to pages, not to files (/og.png), brand or reference images, or the API. */
const PAGE_LINK = /^\/(?!brand\/|references\/|api\/)[^.]*$/

window.addEventListener('popstate', sync)
window.addEventListener('hashchange', sync)
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = (event.target as Element).closest?.('a')
  const href = link?.getAttribute('href')
  if (!link || !href || link.target || link.hasAttribute('download') || !PAGE_LINK.test(href)) return
  event.preventDefault()
  navigate(href)
})

import { useSyncExternalStore } from 'react'
import { scrollToTarget } from './smoothScroll'

/*
 * A page is an address; ordinary <a href="/obchodni-podminky"> links switch pages without
 * reloading. The offline copy is one file opened from disk, so there the page
 * lives in the hash instead (#/obchodni-podminky).
 */
const offline = import.meta.env.MODE === 'offline'
/** False while pages are pre-rendered at build time (scripts/prerender.mjs). */
const browser = typeof window !== 'undefined'
const listeners = new Set<() => void>()

function read() {
  if (!browser) return null
  if (!offline) return window.location.pathname.replace(/(.)\/$/, '$1')
  return window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : null
}

let path = read() ?? '/'

/** The page being pre-rendered. */
export function setServerPath(to: string) {
  path = to
}

function sync() {
  const next = read()
  if (next === null || next === path) return
  path = next
  listeners.forEach((listener) => listener())
}

/** Goes to a page, optionally to an element on it: navigate('/#kontakt'). */
export function navigate(to: string) {
  const [pathname, id] = to.split('#')
  const samePage = pathname === path
  if (!samePage) {
    if (offline) window.location.hash = pathname
    else window.history.pushState(null, '', to)
    sync()
  }
  // Wait for the new page to render before scrolling. On the same page, glide there.
  window.setTimeout(() => {
    const target = id ? document.getElementById(id) : null
    if (target) {
      if (samePage) scrollToTarget(target)
      else target.scrollIntoView()
    } else if (samePage) scrollToTarget(null)
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
    () => path,
  )
}

/** Links to pages, not to files (/og.png), brand images, or the API. */
const PAGE_LINK = /^\/(?!brand\/|api\/)[^.]*$/

if (browser) {
  window.addEventListener('popstate', sync)
  window.addEventListener('hashchange', sync)
  document.addEventListener('click', onLinkClick)
}

function onLinkClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = (event.target as Element).closest?.('a')
  const href = link?.getAttribute('href')
  if (!link || !href || link.target || link.hasAttribute('download') || !PAGE_LINK.test(href)) return
  event.preventDefault()
  navigate(href)
}

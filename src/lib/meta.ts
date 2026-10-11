import { createContext, useContext, useEffect } from 'react'
import { HOME_META, SITE } from '../data/site'

function setMeta(name: string, content: string | null) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (content === null) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = name
    document.head.append(tag)
  }
  tag.content = content
}

/** `npm run build:staging`: no page of a staging copy may be indexed. */
const STAGING = import.meta.env.MODE === 'staging'

export interface PageMeta {
  title: string
  description: string
  noindex: boolean
}

/**
 * Only while pages are pre-rendered (src/entry-server.tsx): receives what the
 * page asked for, which scripts/prerender.mjs writes into the page's HTML.
 */
export const MetaSink = createContext<((meta: PageMeta) => void) | null>(null)

/** Title, description, canonical address and indexing of the current page. Without a title it is the homepage. */
export function usePageMeta({ title, description, noindex: pageNoindex }: { title?: string; description?: string; noindex?: boolean } = {}) {
  const noindex = !!(STAGING || pageNoindex)
  const fullTitle = title ? `${title} | ${SITE.name}` : HOME_META.title
  const fullDescription = description ?? HOME_META.description
  useContext(MetaSink)?.({ title: fullTitle, description: fullDescription, noindex })
  useEffect(() => {
    document.title = fullTitle
    setMeta('description', fullDescription)
    setMeta('robots', noindex ? 'noindex, nofollow' : null)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (noindex) {
      canonical?.remove()
      return
    }
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = SITE.url + window.location.pathname
  }, [fullTitle, fullDescription, noindex])
}

import { useEffect } from 'react'
import { SITE } from '../data/site'

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

/** Title, description, canonical address and indexing for pages other than the homepage. */
export function usePageMeta({ title, description, noindex }: { title: string; description?: string; noindex?: boolean }) {
  useEffect(() => {
    document.title = `${title} | ${SITE.name}`
    if (description) setMeta('description', description)
    setMeta('robots', noindex ? 'noindex, nofollow' : null)
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (noindex) canonical?.remove()
    else if (canonical) canonical.href = SITE.url + window.location.pathname
  }, [title, description, noindex])
}

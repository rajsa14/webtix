import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { PAGES } from './data/site'
import { MetaSink, type PageMeta } from './lib/meta'
export { llmsTxt } from './lib/llmsTxt'
import { setServerPath } from './lib/router'
import { structuredData } from './lib/structuredData'

/** Every page that gets its own HTML file at build time, plus the 404 page. */
export const PRERENDER: { path: string; file: string }[] = [
  ...Object.values(PAGES).map((path) => ({ path, file: path === '/' ? 'index.html' : `${path.slice(1)}.html` })),
  { path: '/404', file: '404.html' },
]

/** The HTML of one page, its title, description and indexing, and its structured data, for scripts/prerender.mjs. */
export function render(path: string): { html: string; meta: PageMeta; jsonLd: object } {
  setServerPath(path)
  let meta: PageMeta | null = null
  const html = renderToString(
    <StrictMode>
      <MetaSink value={(m) => (meta = m)}>
        <App />
      </MetaSink>
    </StrictMode>,
  )
  if (!meta) throw new Error(`Page ${path} set no title (usePageMeta)`)
  return { html, meta, jsonLd: structuredData(path) }
}

/*
 * Pre-renders every page into dist/ after `vite build`, so crawlers (search
 * engines and AI assistants that do not run JavaScript) get the full text,
 * plus each page's own title, description, canonical address and structured
 * data. In the browser React takes over the same HTML (hydrateRoot in
 * src/main.tsx). Also writes dist/sitemap.xml with every indexed page, and
 * dist/llms.txt (src/lib/llmsTxt.ts).
 *
 *   node scripts/prerender.mjs [--mode draft|staging]
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { build } from 'vite'

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const out = resolve(root, 'node_modules/.prerender')
const modeFlag = process.argv.indexOf('--mode')
const mode = modeFlag > -1 ? process.argv[modeFlag + 1] : 'production'

await build({
  root,
  mode,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: out,
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
})

const { render, llmsTxt, PRERENDER } = await import(pathToFileURL(resolve(out, 'entry-server.mjs')).href)
const template = readFileSync(resolve(dist, 'index.html'), 'utf8')
const SITE_URL = 'https://webtix.cz'
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Replaces exactly one match, so a changed index.html fails the build instead of shipping wrong tags. */
function swap(html, pattern, replacement) {
  const matches = html.match(new RegExp(pattern, 'g'))
  if (matches?.length !== 1) throw new Error(`prerender: expected one ${pattern} in dist/index.html, found ${matches?.length ?? 0}`)
  return html.replace(pattern, replacement)
}

const indexed = []
for (const { path, file } of PRERENDER) {
  const { html, meta, jsonLd } = render(path)
  const title = attr(meta.title)
  const description = attr(meta.description)
  const url = SITE_URL + (path === '/' ? '/' : path)
  let page = template
  page = swap(page, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  page = swap(page, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
  page = swap(page, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
  page = swap(page, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
  page = swap(page, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
  if (meta.noindex) {
    page = swap(page, /\s*<link rel="canonical" href="[^"]*" \/>/, '')
    if (!page.includes('<meta name="robots"')) page = page.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>')
  } else {
    page = swap(page, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
  }
  if (!meta.noindex) {
    // "<" escaped, so no text in the data can close the script tag.
    const json = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
    page = swap(page, /<\/head>/, `  <script type="application/ld+json">${json}</script>\n  </head>`)
    indexed.push({ url, sources: path === '/' ? [] : ['src/data/legal.ts'] })
  }
  page = swap(page, /<div id="root"><\/div>/, `<div id="root">${html}</div>`)
  writeFileSync(resolve(dist, file), page)
  console.log(`prerender: ${path} -> dist/${file}${meta.noindex ? ' (noindex)' : ''}`)
}

/** Day of the last commit (touching `sources`, if given); null without git history. */
function lastChanged(sources) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...sources], { cwd: root, encoding: 'utf8' }).trim() || null
  } catch {
    return null
  }
}

const sitemap = indexed.map(({ url, sources }) => {
  const day = lastChanged(sources) ?? lastChanged([])
  return `  <url><loc>${url}</loc>${day ? `<lastmod>${day}</lastmod>` : ''}</url>`
})
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.join('\n')}\n</urlset>\n`,
)
console.log(`prerender: dist/sitemap.xml (${indexed.length} pages)`)

writeFileSync(resolve(dist, 'llms.txt'), llmsTxt())
console.log('prerender: dist/llms.txt')

rmSync(out, { recursive: true, force: true })

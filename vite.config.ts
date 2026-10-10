import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { ADASTRA_WRITTEN_OK, HOME_META } from './src/data/site.ts'

/**
 * Dev-only mock of the inquiry endpoint. It never sends e-mail: it only prints
 * the request to the terminal so the form flow can be tested locally.
 * Enable it with VITE_INQUIRY_ENDPOINT=/api/dev-inquiry in .env.local.
 */
function devInquiryMock(): Plugin {
  return {
    name: 'webtix-dev-inquiry-mock',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/dev-inquiry', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }
        let body = ''
        req.on('data', (chunk) => (body += chunk))
        req.on('end', () => {
          console.log('\n[dev-inquiry] Poptávka přijata (NEODESLÁNO e-mailem):\n', body)
          setTimeout(() => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          }, 900)
        })
      })
    },
  }
}

/**
 * Values that must be decided before the site goes live. Today that is the
 * written permission to show Café AdAstra: a real build refuses to run while
 * ADASTRA_WRITTEN_OK is false in src/data/site.ts. `npm run build:draft` builds
 * anyway for local review. (The IČO may stay null: the footer then hides its line.)
 */
function decidedValues(): Plugin {
  return {
    name: 'webtix-decided-values',
    apply: 'build',
    configResolved(config) {
      if (config.mode === 'draft') return
      const open: string[] = []
      if (!ADASTRA_WRITTEN_OK) {
        open.push(
          "ADASTRA_WRITTEN_OK is false: the Café AdAstra section must not go live without the owner's written permission. Set it to true once Dan has it in writing.",
        )
      }
      if (open.length) {
        throw new Error(`Production build blocked by src/data/site.ts:\n- ${open.join('\n- ')}\nRun \`npm run build:draft\` for a local review build.`)
      }
    },
  }
}

/**
 * `npm run build:staging`: a staging copy must never be indexed. Every page
 * gets a robots meta tag (src/lib/meta.ts keeps it on every route), and every
 * response gets an X-Robots-Tag header through dist/_headers.
 */
function stagingNoindex(): Plugin {
  let outDir = 'dist'
  return {
    name: 'webtix-staging-noindex',
    apply: (_config, env) => env.command === 'build' && env.mode === 'staging',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    transformIndexHtml: () => [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' }],
    closeBundle() {
      const file = resolve(outDir, '_headers')
      const existing = existsSync(file) ? readFileSync(file, 'utf8') : ''
      writeFileSync(file, `/*\n  X-Robots-Tag: noindex, nofollow\n${existing ? `\n${existing}` : ''}`)
    },
  }
}

/**
 * The homepage title and description are written once, in src/data/site.ts
 * (HOME_META, built from PREVIEW_DAYS and PRICE_FROM). This fills them into
 * index.html: %HOME_TITLE%, %HOME_DESCRIPTION% and, inside the JSON-LD,
 * %HOME_DESCRIPTION_JSON%.
 */
function homeMeta(): Plugin {
  const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  return {
    name: 'webtix-home-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replaceAll('%HOME_TITLE%', attr(HOME_META.title))
          .replaceAll('%HOME_DESCRIPTION_JSON%', JSON.stringify(HOME_META.description).slice(1, -1).replace(/</g, '\\u003c'))
          .replaceAll('%HOME_DESCRIPTION%', attr(HOME_META.description)),
    },
  }
}

export default defineConfig({
  plugins: [homeMeta(), react(), tailwindcss(), devInquiryMock(), decidedValues(), stagingNoindex()],
  server: { port: Number(process.env.PORT) || 5178 },
})

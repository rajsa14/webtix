import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv, type Plugin } from 'vite'

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
 * Dev-only stand-in for Netlify: runs the functions behind /api/track and
 * /api/admin/* inside the dev server. Events stay in memory and vanish on
 * restart. The admin password comes from ADMIN_PASSWORD in .env.local.
 */
function devNetlifyFunctions(): Plugin {
  const routes = [
    { prefix: '/api/track', file: '/netlify/functions/track.mts' },
    { prefix: '/api/admin/', file: '/netlify/functions/admin.mts' },
  ]
  return {
    name: 'webtix-dev-netlify-functions',
    apply: 'serve',
    configureServer(server) {
      process.env.WEBTIX_DEV_STORE = '1'
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), 'ADMIN_'))

      server.middlewares.use(async (req, res, next) => {
        const route = routes.find((r) => req.url?.startsWith(r.prefix))
        if (!route) return next()
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk)
          const request = new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: chunks.length ? Buffer.concat(chunks) : undefined,
          })
          const mod = await server.ssrLoadModule(route.file)
          const response: Response = await mod.default(request, { deploy: { context: 'dev' } })
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

/**
 * `npm run build:offline` makes a copy that opens by double-clicking
 * index.html, without any server. Browsers refuse to load module scripts,
 * and Chrome also refuses fonts, from other files on file://, so the script,
 * the styles and every font are put straight into the HTML files.
 */
function offlineSingleFile(): Plugin {
  let outDir = 'dist-offline'
  return {
    name: 'webtix-offline-single-file',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      outDir = config.build.outDir
    },
    generateBundle(_, bundle) {
      const html = bundle['index.html']
      if (!html || html.type !== 'asset') return
      let source = String(html.source)
      for (const [name, file] of Object.entries(bundle)) {
        if (file.type === 'chunk' && file.isEntry) {
          const code = file.code.replace(/<\/script/gi, '<\\/script')
          source = source.replace(
            new RegExp(`<script[^>]*src="[^"]*${escapeRe(name)}"[^>]*></script>`),
            () => `<script type="module">${code}</script>`,
          )
          delete bundle[name]
        } else if (file.type === 'asset' && name.endsWith('.css')) {
          source = source.replace(
            new RegExp(`<link[^>]*href="[^"]*${escapeRe(name)}"[^>]*>`),
            () => `<style>${String(file.source)}</style>`,
          )
          delete bundle[name]
        }
      }
      html.source = source
    },
    // The concept pages load their fonts from a shared stylesheet; inline it too.
    closeBundle() {
      const fontsDir = join(outDir, 'koncepty', 'fonts')
      let css: string
      try {
        css = readFileSync(join(fontsDir, 'fonts.css'), 'utf8')
      } catch {
        return
      }
      css = css.replace(/url\(([^)]+\.woff2)\)/g, (_, file: string) => {
        const data = readFileSync(join(fontsDir, file)).toString('base64')
        return `url(data:font/woff2;base64,${data})`
      })
      for (const page of readdirSync(join(outDir, 'koncepty'))) {
        const path = join(outDir, 'koncepty', page, 'index.html')
        try {
          const text = readFileSync(path, 'utf8')
          writeFileSync(path, text.replace(/<link rel="stylesheet" href="\.\.\/fonts\/fonts\.css" \/>/, () => `<style>${css}</style>`))
        } catch {
          // Not a page folder.
        }
      }
    },
  }
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Netlify serves /404.html with a real 404 status for unknown addresses.
 * It is a copy of the app shell, which then renders the "not found" page.
 */
function notFoundPage(): Plugin {
  return {
    name: 'webtix-404',
    apply: 'build',
    closeBundle() {
      copyFileSync('dist/index.html', 'dist/404.html')
    },
  }
}

export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'
  return {
    plugins: [
      react(),
      tailwindcss(),
      devInquiryMock(),
      devNetlifyFunctions(),
      offline ? offlineSingleFile() : notFoundPage(),
    ],
    server: { port: Number(process.env.PORT) || 5178 },
    // Relative paths, so the offline copy works from any folder.
    base: offline ? './' : '/',
    build: offline
      ? {
          outDir: 'dist-offline',
          // Put fonts and small images into the HTML as data URLs.
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          cssCodeSplit: false,
          modulePreload: false,
        }
      : undefined,
  }
})

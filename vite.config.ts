import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'

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

export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'
  return {
    plugins: [react(), tailwindcss(), devInquiryMock(), offline && offlineSingleFile()],
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

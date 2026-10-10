import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { ADASTRA_WRITTEN_OK, ICO } from './src/data/site.ts'

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
 * Values that must be decided before the site goes live: the company ID (IČO)
 * and written permission to show Café AdAstra. A real build refuses to run
 * while either is still open in src/data/site.ts, so neither can go live by
 * mistake. `npm run build:draft` builds anyway for local review.
 */
function decidedValues(): Plugin {
  return {
    name: 'webtix-decided-values',
    apply: 'build',
    configResolved(config) {
      if (config.mode === 'draft') return
      const open: string[] = []
      if (ICO === null) open.push('ICO is still the placeholder (null). Set the real value.')
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

export default defineConfig({
  plugins: [react(), tailwindcss(), devInquiryMock(), decidedValues()],
  server: { port: Number(process.env.PORT) || 5178 },
})

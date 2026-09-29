import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
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

export default defineConfig({
  plugins: [react(), tailwindcss(), devInquiryMock()],
  server: { port: Number(process.env.PORT) || 5178 },
})

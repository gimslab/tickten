import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

const appVersion = pkg.version || '1.0.0'

function versionJsonPlugin(): Plugin {
  const versionData = JSON.stringify(
    {
      version: appVersion,
    },
    null,
    2,
  )

  return {
    name: 'vite-plugin-version-json',
    // Dev server support: GET /version.json
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/version.json') {
          res.setHeader('Content-Type', 'application/json')
          res.end(versionData)
          return
        }
        next()
      })
    },
    // Production bundle: emit dist/version.json
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: versionData,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    versionJsonPlugin(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { chatMiddleware } from './server/chat.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const middleware = chatMiddleware({ apiKey: env.OPENROUTER_API_KEY, model: env.OPENROUTER_MODEL || 'nex-agi/nex-n2.5-mini:free' })
  return { plugins: [react(), { name: 'chatmate-api', configureServer(server) { server.middlewares.use(middleware) }, configurePreviewServer(server) { server.middlewares.use(middleware) } }] }
})

import path from 'node:path'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
    server: {
      // Pengembangan dengan backend Go lokal (VITE_USE_MOCKS=false): /api diteruskan ke server Go, tanpa CORS.
      proxy: env.VITE_PROXY_TARGET
        ? { '/api': { target: env.VITE_PROXY_TARGET, changeOrigin: true } }
        : undefined,
    },
    test: { environment: 'jsdom', globals: true, include: ['src/**/*.test.{js,jsx}'], css: false },
  }
})

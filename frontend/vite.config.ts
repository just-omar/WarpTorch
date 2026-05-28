import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '')

  return {
    plugins: [react({
      // Включаем Fast Refresh для React
      fastRefresh: true
    })],
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_FRONTEND_PORT || '3005'),
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 100
      },
      proxy: {
        '/api': {
          target: `http://backend:${env.VITE_BACKEND_PORT || '8099'}`,
          changeOrigin: true
        }
      }
    }
  }
})

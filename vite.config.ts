import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['echarts', 'echarts-for-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('echarts')) return 'vendor-charts'
          if (id.includes('@chakra-ui') || id.includes('@emotion') || id.includes('framer-motion')) return 'vendor-ui'
          if (id.includes('i18next')) return 'vendor-i18n'
          if (id.includes('@tanstack') || id.includes('axios')) return 'vendor-query'
          if (id.includes('react-hook-form') || id.includes('zustand')) return 'vendor-form'
          if (id.includes('react')) return 'vendor-react'
        },
      },
    },
  },
})

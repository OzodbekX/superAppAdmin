import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    // host: '10.11.1.69'
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
})

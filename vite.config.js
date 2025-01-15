import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 3003,
      // host: '10.11.0.237',
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
    define: {
      'import.meta.env.ENV': JSON.stringify(process.env.ENV || mode), // Expose ENV variable
    },
  }
})

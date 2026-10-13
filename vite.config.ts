import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow external preview hosts (e.g. sandboxed preview proxies) to reach the dev server
    allowedHosts: true,
  },
})

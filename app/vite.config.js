import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE_PATH diisi otomatis oleh workflow deploy: "/" di domain sendiri,
// "/<nama-repo>/" di <username>.github.io. Jangan diubah manual.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})

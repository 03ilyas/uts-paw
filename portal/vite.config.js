import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  // antd menyumbang sebagian besar ukuran bundle; 370 kB gzip masih wajar untuk portal ini.
  build: { chunkSizeWarningLimit: 1500 },
  // shared/uts.json berada di luar folder portal.
  server: { fs: { allow: ['..'] } },
})

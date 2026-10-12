import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8787' } },
  // three.js + react-three-fiber are pulled in only through the lazy import of Scene.jsx,
  // so devices that stay in lightweight mode never download them.
  build: { chunkSizeWarningLimit: 1300 },
})

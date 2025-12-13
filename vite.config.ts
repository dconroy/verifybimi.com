import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Using custom domain (verifybimi.com) - base path is root
  // For custom domains, always use '/' as base path
  // For GitHub Pages subdomain (username.github.io/repo), use '/repo/'
  base: process.env.GITHUB_PAGES && !process.env.CUSTOM_DOMAIN
    ? `/${process.env.GITHUB_REPOSITORY_NAME || 'bimify'}/`
    : '/',
  build: {
    rollupOptions: {
      output: {
        // Code splitting: separate vendor chunks
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Chunk size warnings threshold (500kb default)
    chunkSizeWarningLimit: 600,
  },
})


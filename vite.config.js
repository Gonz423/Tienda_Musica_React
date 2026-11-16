import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/assets/**',
        'src/test/**',
        '**/*.spec.jsx',
        '**/*.spec.js',
        '**/*.test.jsx',
        '**/*.test.js'
      ]
    }
  }
})

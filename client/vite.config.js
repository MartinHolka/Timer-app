import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // or the appropriate backend URL
    },
  },

  // server: {
  //   host: '0.0.0.0',
  //   port: 3000,  // or another port if 3000 is in use
  // },
})

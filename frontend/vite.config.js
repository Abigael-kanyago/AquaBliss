import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/get-prices': 'http://127.0.0.1:5000',
      '/submit-order': 'http://127.0.0.1:5000',
      '/orders': 'http://127.0.0.1:5000',
      '/update-order-status': 'http://127.0.0.1:5000',
      '/update-prices': 'http://127.0.0.1:5000',
      '/get-staff': 'http://127.0.0.1:5000',
      '/add-staff': 'http://127.0.0.1:5000',
      '/delete-staff': 'http://127.0.0.1:5000',
      '/login': 'http://127.0.0.1:5000',
      '/logout': 'http://127.0.0.1:5000',
      '/auth-status': 'http://127.0.0.1:5000',
      '/static': 'http://127.0.0.1:5000',
    }
  }
})

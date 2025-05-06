import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    allowedHosts:  [
      '.ngrok.io',
      '.ngrok-free.app',
      '.trycloudflare.com',
    ],  // Allow all hosts
  },
})

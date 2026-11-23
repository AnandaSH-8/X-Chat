import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: false,
    proxy: {
      "/api": {
        target: "https://x-chat-8.onrender.com/",
        changeOrigin: true,
      },
    },
  },
});

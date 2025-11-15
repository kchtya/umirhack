import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/umirhack/'  // ← ДОБАВЬ ЭТУ СТРОКУ!
    : '/',
  server: {
    host: '0.0.0.0'
  }
})
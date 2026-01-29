import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Используем относительные пути для встраивания в любой путь
  base: './',
  build: {
    // Собираем в обычный bundle для встраивания в существующий сайт
    outDir: 'dist',
    assetsDir: 'assets',
    // Минифицируем для production (используем esbuild, который уже встроен)
    minify: 'esbuild',
    // Создаём source maps для отладки (можно отключить в production)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Именование файлов для лучшего кеширования
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
})
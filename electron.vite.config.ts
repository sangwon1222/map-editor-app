import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },

  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@views': resolve('src/renderer/src/views'),
        '@store': resolve('src/renderer/src/store'),
        '@atoms': resolve('src/renderer/src/components/atoms'),
        '@template': resolve('src/renderer/src/components/template'),
        '@app': resolve('src/renderer/src/app'),
        '@core': resolve('src/renderer/src/core'),
      },
    },
    plugins: [vue()],
  },
})

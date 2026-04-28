import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    VueRouter({
      dts: './typed-router.d.ts',
      routesFolder: 'src/pages',
      extensions: ['.vue'],
    }),
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', { '@vueuse/core': ['useFullscreen'] }],
      dirs: ['src/composables', 'src/stores'],
      dts: './src/auto-imports.d.ts',
      vueTemplate: true,
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dirs: ['src/components', 'src/layouts'],
      dts: './src/components.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    UnoCSS({
      inspector: false,
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vue-echarts')) {
            return 'vendor-vue-echarts'
          }

          if (id.includes('/echarts/core') || id.includes('/echarts/renderers') || id.includes('/echarts/components')) {
            return 'vendor-echarts-core'
          }

          if (id.includes('/echarts/charts')) {
            return 'vendor-echarts-charts'
          }

          if (id.includes('xlsx')) {
            return 'vendor-xlsx'
          }
        },
      },
    },
  },
})

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const externals = {
  vue: 'Vue'
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    emptyOutDir: false,
    target: ['es2015'],
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts')
      }
    },
    sourcemap: false,
    rollupOptions: {
      external: Object.keys(externals),
      output: [
        {
          format: 'cjs',
          dir: 'lib',
          preserveModules: true
        },
        {
          format: 'es',
          dir: 'esm',
          preserveModules: true
        },
        {
          globals: externals,
          format: 'umd',
          dir: 'dist',
          name: 'ListVue',
          preserveModules: false,
          entryFileNames: 'list-vue.umd.js'
        }
      ]
    }
  }
})

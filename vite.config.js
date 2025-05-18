import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Components from '@uni-helper/vite-plugin-uni-components'
import { UniUIResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    Components({
      dts: true,
      resolvers: [UniUIResolver()]
    }),
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `@import "uview-plus/theme.scss";`
      }
    }
  }
})



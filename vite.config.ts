import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const SRC = path.resolve(__dirname, 'src')

// Comes from https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "lib": path.resolve(__dirname, "lib", "dist")
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],

      dts: path.resolve(SRC, 'auto-imports.d.ts'),
    }),
    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver(),
      ],
      dts: path.resolve(SRC, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
  ]
})

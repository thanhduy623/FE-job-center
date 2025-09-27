import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/vite-plugin-vue-i18n'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        VueI18nPlugin({
            // đường dẫn đến thư mục locales
            include: path.resolve(__dirname, './src/locales/**')
        })
    ]
})

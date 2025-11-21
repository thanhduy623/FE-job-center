import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/vite-plugin-vue-i18n'
import path from 'path'

export default defineConfig({
    plugins: [
        vue({
            // Khai báo Custom Element ở đây để loại bỏ cảnh báo 'deprecated'
            template: {
                compilerOptions: {
                    // Chỉ định rằng thẻ bắt đầu bằng 'n8n-' là Custom Element (Web Component)
                    isCustomElement: (tag) => tag.startsWith('n8n-'),
                },
            },
        }),
        VueI18nPlugin({
            // đường dẫn đến thư mục locales
            include: path.resolve(__dirname, './src/locales/**')
        })
    ]
})

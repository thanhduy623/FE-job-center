import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/styles/global.css'
import { createI18n } from 'vue-i18n'
import vi from './locales/vi.js'
import en from './locales/en.js'

const messages = { vi, en }

const i18n = createI18n({
    legacy: false,
    locale: 'vi',
    fallbackLocale: 'en',
    messages
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')

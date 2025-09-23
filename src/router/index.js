import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Views
import Home from '@/views/HomeView.vue'
import About from '@/views/HomeView.vue'
import Login from '@/views/auth/LoginView.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'about', name: 'about', component: About }
        ]
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            { path: 'login', name: 'login', component: Login }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Views
import Login from '@/views/auth/LoginView.vue'

import Home from '@/views/HomeView.vue'
import Recruitment from '@/views/recruitment/RecruitmentView.vue'
import Register from '@/views/recruitment/RecruitmentRegister.vue'
import Chatbot from '@/views/chatbot/ChatbotView.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'recruitment', name: 'recruitment', component: Recruitment },
            { path: 'chatbot', name: 'chatbot', component: Chatbot },
            { path: 'register/:id', name: 'register', component: Register }
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

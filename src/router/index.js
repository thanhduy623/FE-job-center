import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import StaffLayout from '@/layouts/StaffLayout.vue'

// Public
import Home from '@/views/HomeView.vue'
import Recruitment from '@/views/public/RecruitmentView.vue'
import Register from '@/views/public/RecruitmentRegister.vue'
import Chatbot from '@/views/public/ChatbotView.vue'
import Login from '@/views/public/LoginView.vue'


// Auth
// Auth/Staff
import StaffView from '@/views/auth/staff/StaffView.vue'
import StaffAdd from '@/views/auth/staff/StaffAdd.vue'



const routes = [
    {
        path: '/',
        component: AuthLayout,
        children: [
            { path: 'login', name: 'login', component: Login }
        ]
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'recruitment', name: 'recruitment', component: Recruitment },
            { path: 'recruitment/:id', name: 'register', component: Register },
            { path: 'chatbot', name: 'chatbot', component: Chatbot },
        ]
    },
    {
        path: '/',
        component: StaffLayout,
        children: [
            { path: 'staff', name: 'staff', component: StaffView },
            { path: 'staff/add', name: 'staffAdd', component: StaffAdd }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

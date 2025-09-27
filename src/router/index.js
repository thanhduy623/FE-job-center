import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import StaffLayout from '@/layouts/StaffLayout.vue'

// Public
import Home from '@/views/public/HomeView.vue'
import Recruitment from '@/views/public/RecruitmentView.vue'
import Register from '@/views/public/RecruitmentRegister.vue'
import Chatbot from '@/views/public/ChatbotView.vue'
import Login from '@/views/public/LoginView.vue'


// Auth
// Auth/Staff
import StaffView from '@/views/auth/staff/StaffView.vue'
import StaffAdd from '@/views/auth/staff/StaffAdd.vue'
// Auth/Department
import DepartmentView from '@/views/auth/department/DepartmentView.vue'
// Auth/Job
import JobView from '@/views/auth/job/JobView.vue'
import JobAdd from '@/views/auth/job/JobAdd.vue'
import JobUpdate from '@/views/auth/job/JobUpdate.vue'



const routes = [
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
            { path: 'staff/add', name: 'staffAdd', component: StaffAdd },
            { path: 'department', name: 'department', component: DepartmentView },
            { path: 'job', name: 'job', component: JobView },
            { path: 'job/add', name: 'jobAdd', component: JobAdd },
            { path: 'job/:id', name: 'jobUpdate', component: JobUpdate },
        ]
    },
    {
        path: '/',
        component: AuthLayout,
        children: [
            { path: 'login', name: 'login', component: Login }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

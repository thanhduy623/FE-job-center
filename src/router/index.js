import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import StaffLayout from '@/layouts/StaffLayout.vue'

// Public
import Home from '@/views/public/HomeView.vue'
import Login from '@/views/public/LoginView.vue'
import ResetPassword from '@/views/public/ResetPassword.vue'

import Recruitment from '@/views/public/RecruitmentView.vue'
import Register from '@/views/public/RecruitmentRegister.vue'
import MyCV from '@/views/public/MyCV.vue'

import ConfirmInterview from '@/views/auth/application/ConfirmInterview.vue'



// Auth
// Auth/Staff
import StaffView from '@/views/auth/staff/StaffView.vue'
import StaffAdd from '@/views/auth/staff/StaffAdd.vue'
import StaffInfo from '@/views/auth/staff/StaffInfo.vue'
import StaffProfile from '@/views/auth/staff/StaffProfile.vue'
// Auth/Department
import DepartmentView from '@/views/auth/department/DepartmentView.vue'
// Auth/Job
import JobView from '@/views/auth/job/JobView.vue'
import JobAdd from '@/views/auth/job/JobAdd.vue'
import JobUpdate from '@/views/auth/job/JobUpdate.vue'
import JobField from '@/views/auth/job/JobField.vue'
// Auth/Application
import ApplicationView from '@/views/auth/application/ApplicationView.vue'
import ApplicationDetail from '@/views/auth/application/ApplicationDetail.vue'
import ApplicationInterview from '@/views/auth/application/ApplicationInterview.vue'
import ApplicationMailer from '@/views/auth/application/ApplicationMailer.vue'
// Auth/Document
import DocumentView from '@/views/auth/document/DocumentView.vue'
// Auth/Chabot
import ChatbotView from '@/views/auth/chatbot/ChatbotView.vue'
// Auth/Mail
import MailEdit from '@/views/auth/mail/MailEdit.vue'
// Auth/Field
import FieldView from '@/views/auth/fields/FieldView.vue'



const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            { path: '', name: 'home', component: Home },
            { path: 'recruitment', name: 'recruitment', component: Recruitment },
            { path: 'recruitment/:id', name: 'register', component: Register },
            { path: 'chatbot', name: 'chatbot', component: ChatbotView },
        ]
    },
    {
        path: '/',
        component: StaffLayout,
        children: [
            { path: 'staff', name: 'staff', component: StaffView },
            { path: 'staff/add', name: 'staffAdd', component: StaffAdd },
            { path: 'staff/:id', name: 'staffInfo', component: StaffInfo },
            { path: 'profile', name: 'staffProfile', component: StaffProfile },
            { path: 'department', name: 'department', component: DepartmentView },
            { path: 'job', name: 'job', component: JobView },
            { path: 'job/add', name: 'jobAdd', component: JobAdd },
            { path: 'job/:id', name: 'jobUpdate', component: JobUpdate },
            { path: 'job/field/:id', name: 'jobField', component: JobField },
            { path: 'application', name: 'application', component: ApplicationView },
            { path: 'application/:id', name: 'applicationDetail', component: ApplicationDetail },
            { path: 'application/interview', name: 'applicationInterview', component: ApplicationInterview },
            { path: 'application/mailer', name: 'applicationMailer', component: ApplicationMailer },
            { path: 'document', name: 'document', component: DocumentView },
            { path: 'chatbot-admin', name: 'chatbot', component: ChatbotView },
            { path: 'mail/edit', name: 'mailEdit', component: MailEdit },
            { path: 'field', name: 'field', component: FieldView },
        ]
    },
    {
        path: '/',
        component: AuthLayout,
        children: [
            { path: 'login', name: 'login', component: Login },
            { path: 'reset-password', name: 'reset-password', component: ResetPassword },
            { path: 'cofirm-interview/:id', name: 'cofirm-interview', component: ConfirmInterview },
            { path: 'my-cv/:id', name: 'my-cv', component: MyCV }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router

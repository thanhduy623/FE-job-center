<template>
    <div class="main-container">
        <div class="flex flex-row items-center">
            <h2 v-t="'pageStaff.title'" class="text-primary text-title flex-1"></h2>
            <router-link to="/staff/add">
                <button class="bg-primary">{{ $t('add') }}</button>

            </router-link>
        </div>
        <TableComponent v-model:rows="userList" :columns="headers" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import TableComponent from "@/components/tables/tableComponent.vue"
    import StaffService from "@/services/UserService.js"

    import { mapLocaleField } from '@/utils/mapLocaleField.js'
    import { sendPasswordResetEmail } from '@/services/AuthService.js'

    const router = useRouter()
    const rawUserList = ref([])

    const userList = mapLocaleField(rawUserList, [
        { newKey: 'departmentName', parentKey: 'User_departmentId_fkey' },
        { newKey: 'roleName', parentKey: 'User_roleId_fkey' }
    ])

    const headers = [
        { key: "lastname", label: "lastname" },
        { key: "firstname", label: "firstname" },
        { key: "departmentName", label: "department" },
        { key: "roleName", label: "role" },
        { key: "email", label: "email" },
        {
            key: "action",
            label: "action",
            actions: [
                { icon: "📄", label: "Xem thông tin", func: (row) => router.push(`/staff/${row.id}`) },
                // { icon: "📄", label: "Xem thông tin", func: (row, index, all) => all.splice(index, 1) },
                { icon: "🔄", label: "Khôi phục mật khẩu", func: (row) => sendPasswordResetEmail(row.email) },
            ]
        }
    ]

    onMounted(async () => {
        const res = await StaffService.getUser()
        if (res.success) rawUserList.value = res.data
    })
</script>
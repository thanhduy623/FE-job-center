<template>
    <div class="main-container">
        <!-- 🔹 Tiêu đề và nút -->
        <div class="flex flex-row items-center gap-1">
            <h2 v-t="'pageApplication.title'" class="text-primary text-title flex-1"></h2>
            <router-link to="/application/interview">
                <button>{{ $t('scheduleInterview') }}</button>
            </router-link>
            <router-link to="/application/mailer">
                <button>{{ $t('mailInterview') }}</button>
            </router-link>
        </div>

        <!-- 📋 Bảng danh sách hồ sơ -->
        <TableComponent v-model:rows="applicationList" :columns="headers" class="mt-1" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"
    import { useRouter } from "vue-router"
    import TableComponent from "@/components/tables/tableComponent.vue"
    import ApplicationService from "@/services/ApplicationService.js"
    import { mapLocaleField } from "@/utils/mapLocaleField.js"

    const router = useRouter()

    // 🔹 Dữ liệu gốc từ DB
    const rawApplications = ref([])

    // 🔹 Ánh xạ để hiển thị thêm thông tin job (đã có quan hệ Application_jobId_fkey)
    const applicationList = mapLocaleField(rawApplications, [
        { newKey: "jobName", parentKey: "Application_jobId_fkey", viKey: "name_vi", enKey: "name_en" },
        { newKey: "position", parentKey: "Application_jobId_fkey", viKey: "position_vi", enKey: "position_en" }
    ])

    // 🔹 Cấu hình các cột bảng
    const headers = [
        { key: "fullName", label: "fullname" },
        { key: "email", label: "email" },
        { key: "phone", label: "phone" },
        { key: "jobName", label: "job" },
        { key: "status", label: "status" },
        {
            key: "action",
            label: "action",
            actions: [
                {
                    icon: "📄",
                    label: "Xem hồ sơ",
                    func: (row) => router.push(`/application/${row.id}`)
                },
            ]
        }
    ]

    // 🔹 Khi load trang → lấy danh sách hồ sơ
    onMounted(async () => {
        const res = await ApplicationService.getApplication()
        if (res.success) rawApplications.value = res.data;
    })
</script>
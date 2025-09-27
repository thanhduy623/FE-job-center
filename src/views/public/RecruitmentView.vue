<template>
    <div class="container">
        <div class="flex flex-row gap-4 p-1">
            <Filter v-model:selectedDepartments="selectedDepartments" v-model:selectedJobs="selectedJobs"
                @apply-filter="onApplyFilter" />
            <List :selectedJobs="selectedJobs" :recruitments="recruitments"
                :selectedDepartments="selectedDepartments" />
        </div>
    </div>
</template>


<script setup>
    import { ref, watch, onMounted } from "vue"

    import Filter from '@/features/recruitment/RecruitmentFilter.vue'
    import List from '@/features/recruitment/RecruitmentList.vue'

    const recruitments = ref([])
    const selectedDepartments = ref([])
    const selectedJobs = ref([])

    function getRecruitments() {
        return [
            { recruitmentId: "N001", departmentId: "01", departmentName: "Ban Văn phòng", jobId: "0101", jobName: "Nhân viên Hành chính", startDate: "2025-09-20", endDate: "2025-10-10", describe: "Quản lý hồ sơ, giấy tờ, hỗ trợ công tác hành chính." },
            { recruitmentId: "N002", departmentId: "01", departmentName: "Ban Văn phòng", jobId: "0102", jobName: "Thư ký Văn phòng", startDate: "2025-09-25", endDate: "2025-10-15", describe: "Soạn thảo văn bản, hỗ trợ Ban Giám hiệu và giáo viên." },
            { recruitmentId: "N003", departmentId: "02", departmentName: "Ban Kế toán", jobId: "0201", jobName: "Kế toán viên", startDate: "2025-09-28", endDate: "2025-10-18", describe: "Theo dõi thu chi, lập báo cáo tài chính." },
            { recruitmentId: "N004", departmentId: "02", departmentName: "Ban Kế toán", jobId: "0202", jobName: "Thủ quỹ", startDate: "2025-09-30", endDate: "2025-10-20", describe: "Quản lý tiền mặt, thu học phí, chi lương nhân viên." },
            { recruitmentId: "N005", departmentId: "03", departmentName: "Ban Giảng dạy", jobId: "0301", jobName: "Giáo viên đứng lớp", startDate: "2025-09-22", endDate: "2025-10-12", describe: "Giảng dạy chương trình tiểu học, quản lý lớp học." },
            { recruitmentId: "N006", departmentId: "03", departmentName: "Ban Giảng dạy", jobId: "0305", jobName: "Giáo viên Tiếng Anh", startDate: "2025-09-25", endDate: "2025-10-15", describe: "Dạy tiếng Anh cho học sinh khối 3–5." },
            { recruitmentId: "N007", departmentId: "03", departmentName: "Ban Giảng dạy", jobId: "0303", jobName: "Giáo viên Thể dục", startDate: "2025-09-26", endDate: "2025-10-22", describe: "Tổ chức hoạt động thể thao, dạy thể dục các khối." },
            { recruitmentId: "N008", departmentId: "04", departmentName: "Ban Bảo vệ", jobId: "0401", jobName: "Nhân viên Bảo vệ ca ngày", startDate: "2025-09-21", endDate: "2025-10-11", describe: "Đảm bảo an ninh trường học vào ban ngày." },
            { recruitmentId: "N009", departmentId: "04", departmentName: "Ban Bảo vệ", jobId: "0402", jobName: "Nhân viên Bảo vệ ca đêm", startDate: "2025-09-23", endDate: "2025-10-13", describe: "Giữ gìn trật tự, an toàn trường học vào ban đêm." },
            { recruitmentId: "N010", departmentId: "05", departmentName: "Ban Tạp vụ", jobId: "0501", jobName: "Nhân viên Tạp vụ lớp học", startDate: "2025-09-24", endDate: "2025-10-14", describe: "Dọn vệ sinh lớp học, giữ môi trường sạch sẽ." }
        ]
    }

    watch(selectedDepartments, (val) => {
        alert(val)
    })

    onMounted(() => {
        // Lấy danh sách tuyển dụng
        recruitments.value = getRecruitments();
    })

    function onApplyFilter(data) {
        // Khi bấm nút, mới nhận dữ liệu
        selectedDepartments.value = data.selectedDepartments
        selectedJobs.value = data.selectedJobs
    }
</script>

<style scoped>
    .container {
        padding: 20px 100px;
    }
</style>
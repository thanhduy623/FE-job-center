<template>
    <div class="container">
        <div class="flex flex-row gap-4 p-1">
            <Filter :departments="departmentList" :jobs="jobList" :selectedDepartments="selectedDepartments"
                :selectedJobs="selectedJobs" @apply-filter="onApplyFilter" />
            <List :selectedJobs="selectedJobs" :selectedDepartments="selectedDepartments" :recruitments="jobList" />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"

    import { getDepartment } from '@/services/DepartmentService'
    import { getJob } from '@/services/JobService'
    import { mapLocaleField } from '@/utils/mapLocaleField.js'
    import Filter from '@/features/recruitment/RecruitmentFilter.vue'
    import List from '@/features/recruitment/RecruitmentList.vue'

    const rawJobList = ref([])
    const rawDepartmentList = ref([])

    const selectedJobs = ref([])
    const selectedDepartments = ref([])

    const departmentList = mapLocaleField(rawDepartmentList, [
        { newKey: 'departmentName', enKey: 'name_en', viKey: 'name_vi' },
    ])

    const jobList = mapLocaleField(rawJobList, [
        { newKey: 'name', enKey: 'name_en', viKey: 'name_vi' },
        { newKey: 'position', enKey: 'position_en', viKey: 'position_vi' },
        { newKey: 'description', enKey: 'description_en', viKey: 'description_vi' },
        { newKey: 'requirements', enKey: 'requirements_en', viKey: 'requirements_vi' },
        { newKey: 'benefits', enKey: 'benefits_en', viKey: 'benefits_vi' },
    ])

    onMounted(async () => {
        try {
            const resDep = await getDepartment()
            if (resDep.success) rawDepartmentList.value = resDep.data

            const resJob = await getJob()
            if (resJob.success) rawJobList.value = resJob.data
        } catch (err) {
            console.error("Lỗi khi load dữ liệu:", err)
        }
    })

    function onApplyFilter(data) {
        selectedDepartments.value = data.selectedDepartments
        selectedJobs.value = data.selectedJobs
    }
</script>

<style scoped>
    .container {
        padding: 20px 100px;
    }
</style>
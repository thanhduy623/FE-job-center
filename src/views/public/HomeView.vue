<template>
    <div class="home flex flex-col items-center">
        <Banner :images="images" />

        <div class="recruitment-container flex flex-row gap-4 p-1">
            <Filter :departments="departmentList" :jobs="jobList" :selectedDepartments="selectedDepartments"
                :selectedJobs="selectedJobs" @apply-filter="onApplyFilter" />
            <List :selectedJobs="selectedJobs" :selectedDepartments="selectedDepartments" :recruitments="jobList" />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue"

    import { getJob } from '@/services/JobService'
    import { getDepartment } from '@/services/DepartmentService'

    import { mapLocaleField } from '@/utils/mapLocaleField.js'
    import Banner from '@/components/others/BannerSlide.vue'
    import Filter from '@/features/recruitment/RecruitmentFilter.vue'
    import List from '@/features/recruitment/RecruitmentList.vue'

    const rawJobList = ref([])
    const rawDepartmentList = ref([])

    const selectedJobs = ref([])
    const selectedDepartments = ref([])

    const images = ref([
        "https://static.kiddihub.com/images/-ZWkcIpY70x@1652337239.jpg",
        "https://www.vietanhschool.edu.vn/wp-content/uploads/2020/06/truong-VA2.jpg",
        "https://www.vietanhschool.edu.vn/wp-content/uploads/2020/06/VA002-scaled.jpg",
        "https://static.kiddihub.com/images/mo-ta-co-so-vat-chat-cua-truong-trung-tieu-hoc-viet-anh-di-an-KakwszEVqA@1652336686.jpg",
        "https://static.kiddihub.com/images/mo-ta-cac-tien-ich-cua-truong-trung-tieu-hoc-viet-anh-di-an-mQOyXzdDp3@1652337137.png",
        "https://www.vietanhschool.edu.vn/wp-content/uploads/2023/06/Untitled-3-03.jpg"
    ])

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
    .recruitment-container {
        width: 100%;
        padding: 2rem;
        max-width: 1200px;
    }

    .buttons {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }

    button {
        padding: 10px 20px;
        cursor: pointer;
    }
</style>
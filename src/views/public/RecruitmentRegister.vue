<template>
    <div class="main-container flex flex-col gap-1">
        <h2 v-t="'pageRecruitment.detail'" class="text-primary text-title flex-1"></h2>

        <!-- Component: Thông tin tuyển dụng -->
        <RecruitmentInfo :job-id="jobId" class="mb-6" />

        <!-- Component: Ứng tuyển -->
        <RecruitmentApply :job-id="jobId" />
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    import RecruitmentInfo from '@/features/recruitment/RecruitmentInfo.vue'
    import RecruitmentApply from '@/features/recruitment/RecruitmentApply.vue'

    // Lấy jobId từ route param
    const route = useRoute()
    const jobId = route.params.id
</script>

<style scoped>
    .main-container {
        max-width: 800px;
        margin: 0 auto;
    }
</style>
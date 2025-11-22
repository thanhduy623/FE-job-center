<template>
    <div class="main-container">
        <h2 v-t="'pageJob.addTitle'" class="text-primary text-title"></h2>
        <JobForm @saved="onSaved" />
    </div>
</template>

<script setup>
    import JobForm from './JobForm.vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    // Nhận id mới từ JobForm
    function onSaved(jobId) {
        if (jobId) {
            router.push(`/job/field/${jobId}`);
        } else {
            router.push('/job');
        }
    }
</script>
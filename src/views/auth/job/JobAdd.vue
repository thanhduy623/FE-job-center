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

    function onSaved() {
        router.push('/job'); // quay lại trang danh sách
    }
</script>
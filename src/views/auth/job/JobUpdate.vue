<template>
    <div class="main-container">
        <h2 v-t="'pageJob.editTitle'" class="text-primary text-title"></h2>
        <JobForm :jobId="id" @saved="onSaved" />
    </div>
</template>

<script setup>
    import { useRoute, useRouter } from 'vue-router';
    import JobForm from './JobForm.vue';

    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;

    function onSaved() {
        router.push('/job');
    }
</script>
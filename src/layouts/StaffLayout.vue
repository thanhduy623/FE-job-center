<template>
    <div class="staff-layout">
        <AppHeader />
        <main>
            <router-view />
        </main>
    </div>
</template>


<script setup>
    import AppHeader from '@/components/headers/StaffHeader.vue'
</script>

<style scoped>
    main {
        padding: 0 16px;
    }
</style>
<template>
    <div class="staff-layout">
        <AppHeader />
        <main>
            <router-view />
        </main>

        <LoadingOverlay />
        <ConfirmOverlay />
        <NotifyOverlay />
    </div>
</template>


<script setup>
    import AppHeader from '@/components/headers/StaffHeader.vue'

    import LoadingOverlay from '@/components/overlays/LoadingOverlay.vue'
    import ConfirmOverlay from '@/components/overlays/ConfirmOverlay.vue'
    import NotifyOverlay from '@/components/overlays/NotifyOverlay.vue'
</script>

<style>
    main {
        padding: 0 16px;
    }
</style>
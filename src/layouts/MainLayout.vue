<template>
    <div class="main-layout">
        <AppHeader />
        <main>
            <router-view />
        </main>
        <AppFooter />

        <LoadingOverlay />
        <ConfirmOverlay />
        <NotifyOverlay />
    </div>
</template>


<script setup>
    import AppHeader from '@/components/headers/MainHeader.vue'
    import AppFooter from '@/components/footers/MainFooter.vue'

    import LoadingOverlay from '@/components/overlays/LoadingOverlay.vue'
    import ConfirmOverlay from '@/components/overlays/ConfirmOverlay.vue'
    import NotifyOverlay from '@/components/overlays/NotifyOverlay.vue'
</script>
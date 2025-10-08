<template>
    <div class="main-layout flex flex-col justify-center">
        <AppHeader />
        <main>
            <router-view />
        </main>
        <AppFooter />
    </div>
</template>


<script setup>
    import AppHeader from '@/components/headers/MainHeader.vue'
    import AppFooter from '@/components/footers/MainFooter.vue'
</script>
<template>
    <main class="auth-layout flex items-center justify-center">
        <LanguageSwitcher />
        <router-view />
    </main>
</template>

<script setup>
    import LanguageSwitcher from '@/components/others/LanguageSwitcher.vue'
</script>

<style scoped>
    .auth-layout {
        min-height: 100vh;
        background: url("@/assets/images/background.webp") center center / cover no-repeat;
    }

    form {
        max-width: 400px;
    }

    .lang-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
    }
</style>
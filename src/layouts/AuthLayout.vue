<template>
    <main class="auth-layout flex items-center justify-center">
        <router-view />
    </main>
</template>

<style>
    .auth-layout {
        min-height: 100vh;
        background: url("@/assets/images/background.webp") center center / cover no-repeat;
    }

    form {
        max-width: 400px;
    }
</style>
<template>
    <form class="flex flex-col items-center" @submit.prevent="handleLogin">
        <img class="logo" src="@/assets/images/logo.webp" alt="logo">
        <h1 class="text-primary">ĐĂNG NHẬP</h1>

        <label>Tài khoản</label>
        <input type="text" v-model="us" required>

        <label>Mật khẩu</label>
        <input type="password" v-model="ps" required>

        <button type="submit">ĐĂNG NHẬP</button>

        <p class="text-error" style="height: 24px;">{{ errorMessage }}</p>
    </form>
</template>

<script setup>
    import { ref } from 'vue';
    import router from '@/router/index.js';
    import { login } from '@/services/auth.js'
    import { setSession } from '@/utils/authSession.js'

    const us = ref('admin@gmail.com')
    const ps = ref('123')
    const errorMessage = ref('')

    async function handleLogin() {
        errorMessage.value = ''

        try {
            const result = await login(us.value, ps.value)

            if (result.success) {
                const session = result.data
                setSession('session', session, session.expires_in)
                router.push('/staff')
            } else {
                errorMessage.value = result.message
            }
        } catch (err) {
            errorMessage.value = 'Đã xảy ra lỗi. Vui lòng thử lại.'
            console.error(err)
        }
    }
</script>


<style scoped>
    form {
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 20px var(--color-primary);
    }

    .logo {
        height: 100px;
    }
</style>
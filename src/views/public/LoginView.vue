<template>
    <form class="flex flex-col items-center" @submit.prevent="handleLogin">
        <img class="logo" src="@/assets/images/logo.webp" alt="logo">
        <h1 class="text-primary text-uppercase" v-t="'login'"></h1>

        <label v-t="'account'"></label>
        <input type="text" v-model="us" required>

        <label v-t="'password'"></label>
        <input type="password" v-model="ps" required>

        <button type="submit" class="bg-primary text-uppercase">{{ $t('login') }}</button>

        <p class="text-error" style="height: 24px;">{{ errorMessage }}</p>
    </form>
</template>

<script setup>
    import { ref } from 'vue';
    import router from '@/router/index.js';
    import { login } from '@/services/auth.js'
    import { setSession } from '@/utils/authSession.js'
    import { EventBus } from '@/utils/eventBus.js'

    const us = ref('nguyenduy.6203@gmail.com')
    const ps = ref('123456')
    const errorMessage = ref('')

    async function handleLogin() {
        errorMessage.value = ''
        EventBus.showLoading();
        try {
            const result = await login(us.value, ps.value)

            if (result.success) {
                const session = result.data;
                console.log(result);

                setSession('session', session, session.expires_in)
                EventBus.hideLoading()
                router.push('/staff')
            } else {
                errorMessage.value = result.message
                EventBus.hideLoading()
            }
        } catch (err) {
            EventBus.hideLoading()
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
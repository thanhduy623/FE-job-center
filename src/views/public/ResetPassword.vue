<template>
    <form class="flex flex-col items-center" @submit.prevent="handleSubmit">
        <img class="logo" src="@/assets/images/logo.webp" alt="logo">
        <h1 class="title text-primary text-uppercase" v-t="'resetPassword'"></h1>

        <label v-t="'password'"></label>
        <input type="password" v-model="password" required>

        <label v-t="'confirmPassword'"></label>
        <input type="password" v-model="confirm" required>

        <button type="submit" class="bg-primary text-uppercase">{{ $t('submit') }}</button>

        <p class="text-error" style="height: 24px;">{{ errorMessage }}</p>
    </form>
</template>

<script setup>
    import { ref } from 'vue'
    import router from '@/router/index.js'
    import { supabase } from '@/supabase.js'
    import { EventBus } from '@/utils/eventBus.js'

    const password = ref('')
    const confirm = ref('')
    const errorMessage = ref('')

    async function handleSubmit() {
        if (!password.value || password.value !== confirm.value) {
            errorMessage.value = 'Mật khẩu không trùng khớp!'
            return
        }

        EventBus.showLoading()

        try {
            // Gọi thẳng updateUser với mật khẩu mới
            const { error } = await supabase.auth.updateUser({
                password: password.value
            })

            if (error) {
                errorMessage.value = error.message
                EventBus.hideLoading()
                return
            }

            EventBus.showNotify("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.", 'success')
            EventBus.hideLoading()

            // Chuyển sang trang login
            router.push('/login')
        } catch (err) {
            console.error(err)
            errorMessage.value = 'Đã xảy ra lỗi. Vui lòng thử lại.'
            EventBus.hideLoading()
        }
    }
</script>

<style scoped>
    form {
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0 2px 20px var(--color-primary);
    }

    .title {
        text-align: center;
    }

    .logo {
        height: 100px;
    }
</style>
<template>
    <div class="main-container">
        <h2 v-t="'profile'" class="text-primary text-title flex-1"></h2>
        <form action="">
            <div class="flex flex-col gap-1">
                <!-- Email -->
                <div class="flex flex-col">
                    <label for="email">Email</label>
                    <input id="email" v-model="user.email" type="text" readonly />
                </div>

                <!-- Họ và tên -->
                <div class="flex flex-row gap-1">
                    <div class="flex-1">
                        <label for="lastname">{{ $t('lastname') }}</label>
                        <input id="lastname" v-model="user.lastname" type="text" readonly />
                    </div>
                    <div class="flex-1">
                        <label for="firstname">{{ $t('firstname') }}</label>
                        <input id="firstname" v-model="user.firstname" type="text" readonly />
                    </div>
                </div>

                <!-- Giới tính & Ngày sinh -->
                <div class="flex flex-row gap-1">
                    <div class="flex-1">
                        <label for="gender">{{ $t('gender') }}</label>
                        <GenderSelect v-model="user.gender" readonly />
                    </div>
                    <div class="flex-1">
                        <label for="birthday">{{ $t('birthday') }}</label>
                        <input id="birthday" v-model="user.birthday" type="date" readonly />
                    </div>
                </div>

                <!-- Số điện thoại -->
                <div class="flex flex-col">
                    <label for="phone">{{ $t('phone') }}</label>
                    <input id="phone" v-model="user.phone" type="text" readonly />
                </div>

                <!-- Bộ phận & Vai trò -->
                <div class="flex flex-row gap-1">
                    <div class="flex-1">
                        <label for="department">{{ $t('department') }}</label>
                        <input id="department" v-model="user.departmentName" type="text" readonly />
                    </div>
                    <div class="flex-1">
                        <label for="role">{{ $t('role') }}</label>
                        <input id="role" v-model="user.roleName" type="text" readonly />
                    </div>
                </div>
            </div>
        </form>

        <!-- Nút khôi phục mật khẩu -->
        <div class="flex justify-end mt-2">
            <button @click="recoverPassword" class="bg-primary text-white px-4 py-2">
                {{ $t('resetPassword') }}
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { supabase } from '@/supabase.js'
    import UserService from '@/services/UserService.js'
    import { sendPasswordResetEmail } from '@/services/AuthService.js'
    import { EventBus } from '@/utils/eventBus'
    import { useI18n } from 'vue-i18n'

    import GenderSelect from '@/components/selects/GenderSelect.vue'


    const { locale } = useI18n()
    const userRaw = ref(null)

    const user = computed(() => {
        if (!userRaw.value) return {}
        const u = userRaw.value
        const dep = u.User_departmentId_fkey || {}
        const role = u.User_roleId_fkey || {}

        return {
            email: u.email,
            lastname: u.lastname,
            firstname: u.firstname,
            gender: u.gender,
            birthday: u.birthday ? u.birthday.split('T')[0] : '',
            phone: u.phone,
            departmentName: locale.value === 'vi' ? dep.name_vi || '' : dep.name_en || '',
            roleName: locale.value === 'vi' ? role.name_vi || '' : role.name_en || ''
        }
    })

    onMounted(async () => {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data?.user) {
            EventBus.showNotify('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', 'error')
            return
        }

        const email = data.user.email
        const res = await UserService.getUser({ email })
        console.log(res)

        if (res.success && res.data.length > 0) {
            userRaw.value = res.data[0]
        }
    })

    async function recoverPassword() {
        if (!user.value.email) {
            EventBus.showNotify('Không tìm thấy email người dùng', 'error')
            return
        }

        const confirmed = await EventBus.confirm('Gửi email khôi phục mật khẩu?')
        if (!confirmed) return

        await sendPasswordResetEmail(user.value.email)
    }
</script>
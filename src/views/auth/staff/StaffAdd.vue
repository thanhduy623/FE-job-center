<template>
    <div>
        <h2 class="text-primary text-title" v-t="'pageStaff.title'"></h2>

        <form @submit.prevent="formSubmit" @reset="formReset" class="flex flex-col gap-1">
            <!-- Họ & Tên -->
            <div class="flex gap-1">
                <div class="flex-1">
                    <label v-t="'lastname'"></label>
                    <input v-model="form.lastname" type="text" required />
                </div>
                <div class="flex-1">
                    <label v-t="'firstname'"></label>
                    <input v-model="form.firstname" type="text" required />
                </div>
            </div>

            <!-- Giới tính & Ngày sinh -->
            <div class="flex gap-1">
                <div class="flex-1">
                    <label v-t="'gender'"></label>
                    <GenderSelect v-model="form.gender" />
                </div>
                <div class="flex-1">
                    <label v-t="'birthday'"></label>
                    <input v-model="form.birthday" type="date" />
                </div>
            </div>

            <!-- Điện thoại & Email -->
            <div class="flex gap-1">
                <div class="flex-1">
                    <label v-t="'phone'"></label>
                    <input v-model="form.phone" type="text" />
                </div>
                <div class="flex-1">
                    <label v-t="'email'"></label>
                    <input v-model="form.email" type="email" required />
                </div>
            </div>

            <!-- Phòng ban & Phân quyền -->
            <div class="flex gap-1">
                <div class="flex-1">
                    <label v-t="'department'"></label>
                    <DepartmentSelect v-model="form.departmentId" />
                </div>
                <div class="flex-1">
                    <label v-t="'role'"></label>
                    <LocationSelect v-model="form.locationId" />
                </div>
                <div class="flex-1">
                    <label v-t="'location'"></label>
                    <RoleSelect v-model="form.roleId" />
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-1">
                <button type="reset" v-t="'reset'"></button>
                <button type="submit" class="bg-primary" v-t="'submit'"></button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { signIn } from '@/services/AuthService'
    import { updateUser } from '@/services/UserService'

    import GenderSelect from '@/components/selects/GenderSelect.vue'
    import DepartmentSelect from '@/components/selects/DepartmentSelect.vue'
    import LocationSelect from '@/components/selects/LocationSelect.vue'
    import RoleSelect from '@/components/selects/RoleSelect.vue'

    const form = ref({
        firstname: '',
        lastname: '',
        gender: '1',
        birthday: '',
        phone: '',
        email: '',
        departmentId: '',
        locationId: '',
        roleId: ''
    })

    function formReset() {
        form.value = {
            firstname: '',
            lastname: '',
            birthday: '',
            phone: '',
            email: '',
        }
    }

    async function formSubmit() {
        const data = form.value

        // Tạo tài khoản Auth
        const authRes = await signIn(data.email, '123456')
        if (!authRes.success) return console.error(authRes.message)

        // Cập nhật User
        const userRes = await updateUser({
            id: authRes.data.id,
            firstname: data.firstname,
            lastname: data.lastname,
            gender: data.gender,
            birthday: data.birthday,
            phone: data.phone,
            departmentId: data.departmentId || null,
            roleId: data.roleId || null,
            locationId: data.locationId || null
        })


        if (!userRes.success) return console.error(userRes.message)

        console.log('Tạo nhân viên thành công!')
    }
</script>
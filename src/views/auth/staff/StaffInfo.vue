<template>
    <div>
        <h2 class="text-primary text-title" v-t="'pageStaff.editTitle'"></h2>

        <form @submit.prevent="formSubmit" @reset="formReset" class="flex flex-col gap-1">
            <!-- Họ & Tên -->
            <div class="flex flex-row gap-1 wrap">
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
            <div class="flex flex-row gap-1 wrap">
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
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label v-t="'phone'"></label>
                    <input v-model="form.phone" type="text" />
                </div>
                <div class="flex-1">
                    <label v-t="'email'"></label>
                    <input v-model="form.email" type="email" readonly />
                </div>
            </div>

            <!-- Phòng ban & Phân quyền -->
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label v-t="'department'"></label>
                    <DepartmentSelect v-model="form.departmentId" />
                </div>
                <div class="flex-1">
                    <label v-t="'role'"></label>
                    <LocationSelect v-model="form.locationId" />
                </div>
                <div class="flex-1">
                    <label v-t="'role'"></label>
                    <RoleSelect v-model="form.roleId" />
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex justify-end gap-1 mt-2">
                <button type="reset" v-t="'reset'"></button>
                <button type="submit" class="bg-primary" v-t="'update'"></button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { getUser, updateUser } from '@/services/UserService'

    import GenderSelect from '@/components/selects/GenderSelect.vue'
    import DepartmentSelect from '@/components/selects/DepartmentSelect.vue'
    import LocationSelect from '@/components/selects/LocationSelect.vue'
    import RoleSelect from '@/components/selects/RoleSelect.vue'

    const route = useRoute()
    const userId = route.params.id

    const form = ref({
        id: '',
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

    let originalData = {}

    onMounted(async () => {
        await loadUser()
    })

    async function loadUser() {
        const res = await getUser({ id: userId })
        if (!res || !res.data || res.data.length === 0) {
            console.error('Không tìm thấy nhân viên')
            return
        }
        const user = res.data[0]
        form.value = {
            id: user.id,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            gender: user.gender || '1',
            birthday: user.birthday || '',
            phone: user.phone || '',
            email: user.email || '',
            departmentId: user.departmentId || '',
            locationId: user.locationId || '',
            roleId: user.roleId || ''
        }
        // lưu bản gốc để reset
        originalData = JSON.parse(JSON.stringify(form.value))
    }

    function formReset() {
        form.value = JSON.parse(JSON.stringify(originalData))
    }

    async function formSubmit() {
        const res = await updateUser(form.value, ['id'])
        if (!res.success) return console.error(res.message)
    }
</script>
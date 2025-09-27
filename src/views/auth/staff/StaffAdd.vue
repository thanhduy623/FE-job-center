<template>
    <div>
        <div class="flex flex-row items-center">
            <h2 class="text-primary text-title flex-1" v-t="'pageStaff.title'"></h2>
        </div>

        <!-- gắn ref thay vì id -->
        <form ref="formStaffAdd" class="flex gap-1" @submit.prevent="formSubmit">
            <!-- Họ lót & Tên -->
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label for="lastName" v-t="'lastname'"></label>
                    <input id="lastName" name="lastName" type="text" required />
                </div>
                <div class="flex-1">
                    <label for="firstName" v-t="'firstname'"></label>
                    <input id="firstName" name="firstName" type="text" required />
                </div>
            </div>

            <!-- Giới tính & Ngày sinh -->
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label for="gender" v-t="'gender'"></label>
                    <select id="gender" name="gender" required>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
                <div class="flex-1">
                    <label for="birthday" v-t="'birthday'"></label>
                    <input id="birthday" name="birthday" type="date" />
                </div>
            </div>

            <!-- Điện thoại & Email -->
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label for="phone" v-t="'phone'"></label>
                    <input id="phone" name="phone" type="text" />
                </div>
                <div class="flex-1">
                    <label for="email" v-t="'email'"></label>
                    <input id="email" name="email" type="email" required />
                </div>
            </div>

            <!-- Phòng ban & Phân quyền -->
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label for="departmentId" v-t="'department'"></label>
                    <select id="departmentId" name="departmentId" required>
                        <option value="1">Phòng Kinh doanh</option>
                        <option value="2">Phòng Nhân sự</option>
                        <option value="3">Phòng IT</option>
                    </select>
                </div>
                <div class="flex-1">
                    <label for="role" v-t="'role'"></label>
                    <select id="role" name="role" required>
                        <option value="false">Người dùng</option>
                        <option value="true">Quản trị viên</option>
                    </select>
                </div>
            </div>

            <div class="flex flex-row justify-end gap-1 wrap">
                <button type="reset" v-t="'reset'"></button>
                <button type="submit" class="bg-primary" v-t="'submit'"></button>
            </div>
        </form>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import { getFormData } from "@/utils/formUtils";
    import { supabase } from "@/supabase.js";

    const formStaffAdd = ref(null);

    async function formSubmit() {
        const data = getFormData(formStaffAdd.value);

        // 1. Tạo user trong Supabase Auth với mật khẩu mặc định "123"
        const { error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: "123456",
            role: "admin",
            ...data
        });

        if (authError) {
            alert("Tạo tài khoản Auth thất bại: " + authError.message);
            return;
        }
    }
</script>
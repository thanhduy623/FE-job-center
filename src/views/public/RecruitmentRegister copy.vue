<template>
    <div class="main-container">
        <h2 class="text-xl font-bold mb-2">Đăng ký ứng tuyển</h2>

        <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
            <!-- Thông tin cá nhân -->
            <div class="flex flex-col gap-1">
                <h3 class="font-semibold">Thông tin cá nhân</h3>

                <div class="flex flex-row wrap gap-1">
                    <div class="flex flex-col flex-1">
                        <label for="firstname">Họ và lót</label>
                        <input v-model="formData.firstname" type="text" id="firstname" required>
                    </div>
                    <div class="flex flex-col flex-1">
                        <label for="lastname">Tên</label>
                        <input v-model="formData.lastname" type="text" id="lastname" required>
                    </div>
                </div>

                <div class="flex flex-row wrap gap-1">
                    <div class="flex flex-col flex-1">
                        <label for="gender">Giới tính</label>
                        <select v-model="formData.gender" id="gender" required>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                    <div class="flex flex-col flex-1">
                        <label for="birthday">Ngày sinh</label>
                        <input v-model="formData.birthday" type="date" id="birthday" required>
                    </div>
                </div>

                <div class="flex flex-row wrap gap-1">
                    <div class="flex flex-col flex-1">
                        <label for="phone">Số điện thoại</label>
                        <input v-model="formData.phone" type="text" id="phone" required>
                    </div>
                    <div class="flex flex-col flex-1">
                        <label for="email">Email</label>
                        <input v-model="formData.email" type="email" id="email" required>
                    </div>
                </div>
            </div>

            <!-- Dynamic fields -->
            <div v-if="fields.length" class="flex flex-col gap-1">
                <h3 class="font-semibold">Thông tin bổ sung</h3>

                <div v-for="f in fields" :key="f.id" class="flex flex-col">
                    <label :for="f.id">
                        {{ f.JobCustomFieldAssignment_customFieldId_fkey.fieldName_vi ||
                        f.JobCustomFieldAssignment_customFieldId_fkey.fieldName_en }}
                        <span v-if="f.isRequired">*</span>
                    </label>

                    <input v-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'TEXT'"
                        v-model="formData[f.id]" type="text" :id="f.id" :required="f.isRequired">

                    <input v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'DATE'"
                        v-model="formData[f.id]" type="date" :id="f.id" :required="f.isRequired">

                    <select v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'DROPDOWN'"
                        v-model="formData[f.id]" :id="f.id" :required="f.isRequired">
                        <option value="" disabled selected>Chọn...</option>
                        <option
                            v-for="opt in f.JobCustomFieldAssignment_customFieldId_fkey.options_vi || f.JobCustomFieldAssignment_customFieldId_fkey.options_en"
                            :key="opt" :value="opt">{{ opt }}</option>
                    </select>

                    <FileUpload v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'FILE'"
                        :ref="'file_' + f.id" :is-multiple="false"
                        :allowed-file-types="['.png', '.jpg', '.pdf', '.docx']"
                        @file-selected="file => formData[f.id] = file" @upload-error="err => alert(err)" />
                </div>
            </div>

            <button type="submit" class="bg-primary text-white rounded p-1 mt-2">NỘP HỒ SƠ</button>
        </form>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from "vue-router";
    import { getJobCustomFields } from "@/services/JobCustomFieldAssignmentService.js";
    import FileUpload from '@/components/others/FileUpload.vue';

    const route = useRoute();
    const jobId = route.params.id;

    const fields = ref([]);
    const formData = ref({
        firstname: "",
        lastname: "",
        gender: "",
        birthday: "",
        phone: "",
        email: ""
    });

    // Load dynamic fields
    onMounted(async () => {
        const res = await getJobCustomFields(jobId);
        if (res.success) {
            fields.value = res.data;
            fields.value.forEach(f => {
                formData.value[f.id] = null;
            });
        }
    });

    // Submit form with files
    const handleSubmit = async () => {
        const payload = new FormData();
        for (const key in formData.value) {
            const value = formData.value[key];
            if (value instanceof File) {
                payload.append(key, value);
            } else {
                payload.append(key, value ?? "");
            }
        }

        // TODO: Gửi payload lên API
        console.log("FormData ready for submit:", payload);
        alert("Submit thành công! Kiểm tra console.");
    };
</script>
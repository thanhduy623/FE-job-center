<template>
    <form @submit.prevent="handleSubmit">
        <h3 v-t="'application'" class="text-primary"></h3>

        <!-- 🧍 Thông tin chung -->
        <div id="generalInfo" class="flex flex-col">
            <label v-t="'fullname'"></label>
            <input type="text" v-model="form.fullName" required>

            <label v-t="'email'"></label>
            <input type="text" v-model="form.email" required>

            <label v-t="'phone'"></label>
            <input type="text" v-model="form.phone" required>

            <label v-t="'address'"></label>
            <input type="text" v-model="form.address" required>

            <label v-t="'coverLetter'"></label>
            <textarea v-model="form.coverLetter" required></textarea>
        </div>

        <hr>

        <!-- ⚙️ Thông tin đặc biệt (dynamic fields) -->
        <div id="specialInfo" v-if="mappedFields.length">
            <div v-for="(f, index) in mappedFields" :key="f.id" style="margin-top: 16px;">
                <!-- Chèn hr khi order chia hết cho 100, trừ item đầu tiên -->
                <hr v-if="index > 0 && f.JobCustomFieldAssignment_customFieldId_fkey.order % 100 === 0" />

                <label :for="f.id">
                    {{ f.fieldName }}
                </label>

                <!-- TEXT -->
                <input v-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'TEXT'"
                    v-model="form.dynamicField[f.JobCustomFieldAssignment_customFieldId_fkey.id]" type="text" :id="f.id"
                    :required="f.isRequired" :placeholder="f.description || f.fieldName" />

                <!-- TEXTAREA -->
                <textarea v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'TEXTAREA'"
                    v-model="form.dynamicField[f.JobCustomFieldAssignment_customFieldId_fkey.id]" :id="f.id"
                    :required="f.isRequired" :placeholder="f.description || f.fieldName"
                    style="min-height: 10rem;"></textarea>

                <!-- NUMBER -->
                <input v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'NUMBER'"
                    v-model="form.dynamicField[f.JobCustomFieldAssignment_customFieldId_fkey.id]" type="number"
                    :id="f.id" :required="f.isRequired" :placeholder="f.description || f.fieldName" />

                <!-- DATE -->
                <input v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'DATE'"
                    v-model="form.dynamicField[f.JobCustomFieldAssignment_customFieldId_fkey.id]" type="date" :id="f.id"
                    :required="f.isRequired" />

                <!-- DROPDOWN -->
                <select v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'DROPDOWN'"
                    v-model="form.dynamicField[f.JobCustomFieldAssignment_customFieldId_fkey.id]" :id="f.id"
                    :required="f.isRequired">
                    <option value="" disabled>Chọn...</option>
                    <option v-for="opt in (f.JobCustomFieldAssignment_customFieldId_fkey.options_vi || 
                                    f.JobCustomFieldAssignment_customFieldId_fkey.options_en)" :key="opt" :value="opt">
                        {{ opt }}
                    </option>
                </select>

                <!-- FILE -->
                <FileUpload v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'FILE'"
                    :ref="'file_' + f.id" :is-multiple="false" :allowed-file-types="['.png', '.jpg', '.pdf', '.docx']"
                    @file-selected="file => form.dynamicField[f.JobCustomFieldAssignment_customFieldId_fkey.id] = file"
                    @upload-error="err => EventBus.showNotify(err, 'error')" />
            </div>
        </div>

        <button type="submit">Nộp hồ sơ</button>
    </form>
</template>

<script setup>
    import { ref, onMounted, defineProps } from "vue"
    import { mapLocaleField } from "@/utils/mapLocaleField.js"
    import { getJobCustomFields } from "@/services/JobCustomFieldAssignmentService.js"
    import { EventBus } from '@/utils/eventBus'

    import ApplicationWorkflow from "@/workflows/ApplicationWorkflow.js";
    import FileUpload from "@/components/others/FileUpload.vue"

    const props = defineProps({
        jobId: { type: String, required: true }
    })

    // 📝 Dữ liệu form
    const form = ref({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        coverLetter: ""
    })

    // 🧩 Dữ liệu trường động gốc
    const rawFields = ref([])
    const mappedFields = mapLocaleField(rawFields, [
        {
            newKey: "fieldName",
            parentKey: "JobCustomFieldAssignment_customFieldId_fkey",
            viKey: "fieldName_vi",
            enKey: "fieldName_en"
        },
        {
            newKey: "description",
            parentKey: "JobCustomFieldAssignment_customFieldId_fkey",
            viKey: "description_vi",
            enKey: "description_en"
        }
    ])

    // Lấy trường dữ liệu động
    onMounted(async () => {
        const res = await getJobCustomFields(props.jobId)

        if (res.success) {
            rawFields.value = res.data

            // Khởi tạo form đúng cấu trúc JSON mẫu
            form.value = {
                jobId: props.jobId,
                fullName: "",
                email: "",
                phone: "",
                address: "",
                coverLetter: "",
                dynamicField: {}
            }

            // Khởi tạo dynamicField keys từ rawFields
            rawFields.value.forEach(f => {
                const id = f.JobCustomFieldAssignment_customFieldId_fkey.id
                form.value.dynamicField[id] = ""
            })

            // Sắp xếp theo order
            rawFields.value.sort(
                (a, b) => a.JobCustomFieldAssignment_customFieldId_fkey.order - b.JobCustomFieldAssignment_customFieldId_fkey.order
            )
        }
    })



    // Xử lý submit thử
    async function handleSubmit() {
        try {
            console.log("Dữ liệu form gửi:", form.value);

            // Gọi n8n upload CV
            const res = await ApplicationWorkflow.uploadCV(form.value);

            console.log("Upload CV thành công:", res);
            EventBus.showNotify("Gửi hồ sơ ứng tuyển thành công.", 'success');
        } catch (err) {
            console.error("Upload CV thất bại:", err);
            EventBus.showNotify("Gửi hồ sơ ứng tuyển thất bại.", 'error');
        }
    }

</script>

<style scoped>
    hr {
        margin: 24px 0;
    }

    label {
        margin-top: 16px !important;
    }
</style>
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

        <br>
        <hr><br>

        <!-- ⚙️ Thông tin đặc biệt (dynamic fields) -->
        <div id="specialInfo" v-if="mappedFields.length">
            <div v-for="f in mappedFields" :key="f.id">
                <label :for="f.id">
                    {{ f.fieldName }}
                    <span v-if="f.isRequired">*</span>
                </label>

                <input v-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'TEXT'" v-model="form[f.id]"
                    type="text" :id="f.id" :required="f.isRequired" />

                <input v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'DATE'"
                    v-model="form[f.id]" type="date" :id="f.id" :required="f.isRequired" />

                <select v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'DROPDOWN'"
                    v-model="form[f.id]" :id="f.id" :required="f.isRequired">
                    <option value="" disabled selected>Chọn...</option>
                    <option v-for="opt in (f.JobCustomFieldAssignment_customFieldId_fkey.options_vi || 
                                       f.JobCustomFieldAssignment_customFieldId_fkey.options_en)" :key="opt"
                        :value="opt">
                        {{ opt }}
                    </option>
                </select>

                <FileUpload v-else-if="f.JobCustomFieldAssignment_customFieldId_fkey.fieldType === 'FILE'"
                    :ref="'file_' + f.id" :is-multiple="false" :allowed-file-types="['.png', '.jpg', '.pdf', '.docx']"
                    @file-selected="file => form[f.id] = file" @upload-error="err => alert(err)" />
            </div>
        </div>

        <button type="submit">Nộp hồ sơ</button>
    </form>
</template>


<script setup>
    import { ref, onMounted, defineProps } from "vue"
    import { mapLocaleField } from "@/utils/mapLocaleField.js"
    import { getJobCustomFields } from "@/services/JobCustomFieldAssignmentService.js"

    import { uploadFile, deleteFile } from "@/utils/supabaseFileUtils.js"
    import ApplicationService from "@/services/ApplicationService.js"
    import ApplicationCustomFieldValueService from "@/services/ApplicationCustomFieldValue.js"

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
            newKey: "fieldName",          // Tạo key "fieldName" để hiển thị
            parentKey: "JobCustomFieldAssignment_customFieldId_fkey",
            viKey: "fieldName_vi",
            enKey: "fieldName_en"
        }
    ])

    // Lấy trường dữ liệu động
    onMounted(async () => {
        const res = await getJobCustomFields(props.jobId)
        if (res.success) {
            rawFields.value = res.data
            rawFields.value.forEach(f => {
                form.value[f.id] = null
            })
        }
    })

    // Gửi form
    async function handleSubmit() {
        const uploadedFiles = []

        try {
            // 1️⃣ Tạo bản ghi Application chính
            const appData = {
                jobId: props.jobId,
                fullName: form.value.fullName,
                email: form.value.email,
                phone: form.value.phone,
                address: form.value.address,
                coverLetter: form.value.coverLetter
            }

            const appRes = await ApplicationService.addApplication(appData)
            if (!appRes.success || !appRes.data?.length)
                throw new Error("Không thể tạo hồ sơ ứng tuyển.")

            const applicationId = appRes.data[0].id

            // Chuẩn bị danh sách field động (CustomFieldValue)
            const customFields = []

            for (const f of rawFields.value) {
                const fieldId = f.id
                const fieldDef = f.JobCustomFieldAssignment_customFieldId_fkey
                const value = form.value[fieldId]

                if (value === null || value === "") continue

                let finalValue = value

                // Xử lý nếu là file
                if (fieldDef.fieldType === "FILE" && value instanceof File) {
                    const uploadRes = await uploadFile(value, "applications", `cv/${applicationId}`)
                    if (!uploadRes.success) {
                        throw new Error(`Không thể upload file: ${uploadRes.message}`)
                    }

                    // Ghi lại để rollback nếu lỗi sau này
                    uploadedFiles.push({
                        bucket: "applications",
                        path: `cv/${applicationId}/${uploadRes.path.split("/").pop()}`
                    })

                    finalValue = uploadRes.publicUrl // Lưu URL vào DB
                }

                customFields.push({
                    applicationId,
                    jobCustomFieldId: fieldDef.id,
                    value: finalValue
                })
            }

            // Lưu danh sách custom field values
            if (customFields.length > 0) {
                const valueRes = await ApplicationCustomFieldValueService.addApplicationCustomFieldValue(customFields)
                if (!valueRes.success) throw new Error("Không thể lưu thông tin custom field.")
            }

            // Hoàn tất
            alert("🎉 Nộp hồ sơ thành công!")
            console.log("Đã lưu:", { applicationId, customFields })

            // (Tuỳ chọn) Reset form
            Object.keys(form.value).forEach(k => (form.value[k] = ""))
        } catch (err) {
            console.error("❌ Lỗi khi nộp hồ sơ:", err)

            // Rollback (nếu đã upload file)
            if (uploadedFiles.length > 0) {
                for (const f of uploadedFiles) {
                    await deleteFile(f.bucket, f.path)
                }
            }

            // Rollback (nếu đã tạo Application)
            if (err.message.includes("custom field") || err.message.includes("upload")) {
                const lastApp = await ApplicationService.getApplication({ email: form.value.email })
                if (lastApp.success && lastApp.data.length > 0) {
                    await ApplicationService.deleteApplication({ id: lastApp.data[0].id })
                }
            }

            alert("⚠️ Lỗi khi nộp hồ sơ: " + err.message)
        }
    }
</script>
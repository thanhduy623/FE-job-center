<template>
    <div class="main-container">
        <div class="flex items-center">
            <h2 v-t="'pageJob.addTitle'" class="text-primary text-title flex-1"></h2>
            <p class="text-sm text-muted">#{{ jobId }}</p>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr class="border-b">
                        <th class="p-1 w-8"></th>
                        <th class="p-1">Tên</th>
                        <th class="p-1">Kiểu</th>
                        <th class="p-1">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="field in localizedFields" :key="field.id" class="border-b hover-bg">
                        <td class="p-1 text-center">
                            <input type="checkbox" v-model="field.selected" @change="toggleAssignment(field)" />
                        </td>
                        <td class="p-1 font-medium">{{ field.name }}</td>
                        <td class="p-1">{{ field.fieldType }}</td>
                        <td class="p-1 text-sm text-muted">
                            <span v-if="field.options?.length">{{ field.options.join(', ') }}</span>
                            <span v-else>—</span>
                        </td>
                    </tr>

                    <tr v-if="!loading && fieldList.length === 0">
                        <td colspan="4" class="p-1 text-center text-muted">
                            Không có trường dữ liệu nào.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { useRoute } from "vue-router";
    import JobCustomFieldService from "@/services/JobCustomFieldService.js";
    import JobCustomFieldAssignmentService from "@/services/JobCustomFieldAssignmentService.js";
    import { EventBus } from "@/utils/eventBus";
    import { mapLocaleField } from "@/utils/mapLocaleField.js";
    import { sortBy } from "@/utils/processList.js";


    const route = useRoute();
    const jobId = route.params.id;

    const loading = ref(false);
    const fieldList = ref([]);

    // Hiển thị theo locale
    const localizedFields = mapLocaleField(fieldList, [
        { newKey: "name", viKey: "fieldName_vi", enKey: "fieldName_en" },
        { newKey: "options", viKey: "options_vi", enKey: "options_en" }
    ]);

    // Load danh sách field và assignment
    async function loadData() {
        loading.value = true;
        try {
            const fieldRes = await JobCustomFieldService.getJobCustomField();
            if (!fieldRes?.success) {
                EventBus.showNotify("Không thể tải danh sách field", "error");
                return;
            }

            // Thêm selected = false cho mỗi field
            fieldList.value = fieldRes.data.map(f => ({ ...f, selected: false }));

            // Sắp xếp theo order tăng dần
            fieldList.value = sortBy(fieldList.value, "order", true);

            if (jobId) {
                const assignmentRes = await JobCustomFieldAssignmentService.getJobCustomFields(jobId);
                if (assignmentRes?.success) {
                    const assignedFieldIds = assignmentRes.data.map(a => a.customFieldId);
                    fieldList.value.forEach(f => {
                        f.selected = assignedFieldIds.includes(f.id);
                    });
                }
            }
        } catch (error) {
            console.error(error);
            EventBus.showNotify("Lỗi khi tải dữ liệu field", "error");
        } finally {
            loading.value = false;
        }
    }

    /**
     * Cập nhật ngay lập tức khi checkbox thay đổi
     */
    async function toggleAssignment(field) {
        if (!jobId) return;

        loading.value = true;
        try {
            if (field.selected) {
                // Thêm assignment
                await JobCustomFieldAssignmentService.addJobCustomFieldAssignment({
                    jobId,
                    customFieldId: field.id
                });
            } else {
                // Xóa assignment
                await JobCustomFieldAssignmentService.deleteJobCustomFieldAssignment({
                    jobId,
                    customFieldId: field.id
                });
            }
        } catch (error) {
            console.error("Error in toggleAssignment:", error);
            EventBus.showNotify("Lỗi khi cập nhật trường dữ liệu", "error");
            // Revert checkbox nếu lỗi
            field.selected = !field.selected;
        } finally {
            loading.value = false;
        }
    }

    onMounted(loadData);
</script>

<style scoped>
    .text-muted {
        color: #888;
    }
</style>
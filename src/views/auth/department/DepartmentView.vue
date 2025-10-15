<template>
    <div class="main-container flex flex-col gap-1">
        <!-- Tiêu đề -->
        <h2 v-t="'pageDepartment.title'" class="text-primary text-title flex-1"></h2>

        <!-- Form -->
        <form ref="formStaffAdd" class="flex gap-1 wrap" @submit.prevent="formSubmit">
            <div class="flex flex-row gap-1 wrap">
                <div class="flex-1">
                    <label for="name_vi" v-t="'nameVN'"></label>
                    <input id="name_vi" type="text" v-model="formData.name_vi" required />
                </div>
                <div class="flex-1">
                    <label for="name_en" v-t="'nameEN'"></label>
                    <input id="name_en" type="text" v-model="formData.name_en" required />
                </div>
            </div>
            <div class="flex flex-row justify-end gap-1 wrap">
                <button type="reset" @click="resetForm" v-t="'reset'"></button>
                <button type="submit" class="bg-primary">
                    {{ editId ? 'Cập nhật' : 'Thêm mới' }}
                </button>
            </div>
        </form>

        <!-- Bảng dữ liệu -->
        <TableComponent v-model:rows="userList" :columns="headers" />
    </div>
</template>


<script setup>
    import { ref, onMounted } from 'vue'
    import TableComponent from "@/components/tables/tableComponent.vue";
    import DepartmentService from "@/services/DepartmentService.js"

    const userList = ref([]);
    const headers = ref([
        { key: "name_vi", label: "nameVN" },
        { key: "name_en", label: "nameEN" },
        {
            key: "action",
            label: "action",
            actions: [
                {
                    icon: "✏️", label: "Sửa",
                    func: (row) => {
                        formData.value.name_vi = row.name_vi;
                        formData.value.name_en = row.name_en;
                        editId.value = row.id;
                    },
                },
                {
                    icon: "🗑️", label: "Xóa",
                    func: async (row, index) => {
                        const res = await DepartmentService.deleteDepartment({ id: row.id });
                        if (res.success) userList.value.splice(index, 1);
                    },
                },
            ],
        },
    ]);

    const formData = ref({ name_vi: '', name_en: '' });
    const editId = ref(null);

    const formSubmit = async () => {
        if (editId.value) {
            const res = await DepartmentService.updateDepartment({ ...formData.value, id: editId.value })
            if (res.success) {
                const index = userList.value.findIndex(u => u.id === editId.value);
                if (index !== -1) userList.value[index] = res.data[0];
                resetForm();
            }

        } else {
            const res = await DepartmentService.addDepartment(formData.value);
            if (res.success) {
                userList.value.push(res.data[0]);
                resetForm();
            }
        }
    }

    const resetForm = () => {
        formData.value = { name_vi: '', name_en: '' };
        editId.value = null;
    }

    onMounted(async () => {
        const res = await DepartmentService.getDepartment();
        userList.value = res.success ? res.data : [];
    })
</script>
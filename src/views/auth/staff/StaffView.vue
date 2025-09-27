<template>
    <div class="main-container">
        <div class="flex flex-row items-center">
            <h2 v-t="'pageStaff.title'" class="text-primary text-title flex-1"></h2>
            <router-link to="/staff/add"><button class="bg-primary">Thêm</button></router-link>
        </div>
        <TableComponent v-model:rows="userList" :columns="headers" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import TableComponent from "@/components/tables/tableComponent.vue";
    import StaffService from "@/services/StaffService.js"

    const userList = ref([]);
    const headers = ref([
        { key: "lastName", label: "lastname" },
        { key: "firstName", label: "firstname" },
        { key: "departmentId", label: "department" },
        { key: "email", label: "email" },
        {
            key: "action",
            label: "action",
            actions: [
                {
                    icon: "📄", label: "Lấy dữ liệu",
                    func: (row) => {
                        alert("Lấy dữ liệu: " + JSON.stringify(row));
                    },
                },
                {
                    icon: "🗑️", label: "Xoá dữ liệu",
                    func: (row, index, all) => {
                        all.splice(index, 1);
                    },
                },
            ],
        },
    ])

    onMounted(async () => {
        const res = await StaffService.getAllUser();
        userList.value = res.success ? res.data : [];
    })
</script>
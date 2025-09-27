<template>
    <div class="main-container">
        <div class="flex flex-row items-center">
            <h2 class="text-primary text-title flex-1">Quản lý nhân sự</h2>
            <router-link to="/staff/add"><button class="bg-primary">Thêm</button></router-link>
        </div>
        <TableComponent v-model:rows="people" :columns="headers" />
    </div>
</template>

<script>
    import TableComponent from "@/components/tables/tableComponent.vue";

    export default {
        components: { TableComponent },
        data() {
            return {
                people: [
                    { stt: 1, fullname: "Nguyen Van A" },
                    { stt: 2, fullname: "Tran Thi B" },
                ],
                headers: [
                    { key: "stt", label: "Thứ tự" },
                    { key: "fullname", label: "Họ tên" },
                    {
                        key: "action",
                        label: "Hành động",
                        actions: [
                            {
                                label: "Lấy dữ liệu",
                                icon: "📄",
                                func: (row) => {
                                    alert("Lấy dữ liệu: " + JSON.stringify(row));
                                },
                            },
                            {
                                label: "Xoá dữ liệu",
                                icon: "🗑️",
                                func: (row, index, all) => {
                                    all.splice(index, 1);
                                },
                            },
                        ],
                    },
                ],
            };
        },
    };
</script>
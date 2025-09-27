<template>
    <div class="main-container">
        <h2 v-t="'pageJob.title'" class="text-primary text-title"></h2>
        <button @click="$router.push('/job/add')" class="bg-primary">Thêm mới</button>

        <TableComponent v-model:rows="jobList" :columns="headers" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import TableComponent from '@/components/tables/tableComponent.vue';
    import JobService from '@/services/JobService.js';

    const jobList = ref([]);

    const headers = ref([
        { key: 'name_vi', label: 'nameVN' },
        { key: 'name_en', label: 'nameEN' },
        { key: 'position_vi', label: 'positionVN' },
        { key: 'position_en', label: 'positionEN' },
        { key: 'status', label: 'status' },
        {
            key: 'action',
            label: 'action',
            actions: [
                {
                    icon: '✏️', label: 'Sửa',
                    func: (row) => {
                        // Chuyển đến trang edit
                        window.location.href = `/job/${row.id}`;
                    }
                },
                {
                    icon: '🗑️', label: 'Xóa',
                    func: async (row, index) => {
                        const res = await JobService.deleteJob({ id: row.id });
                        if (res.success) jobList.value.splice(index, 1);
                    }
                }
            ]
        }
    ]);

    onMounted(async () => {
        const res = await JobService.getAllJob();
        jobList.value = res.success ? res.data : [];
    });
</script>
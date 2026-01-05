<template>
    <div class="main-container">
        <div class="flex flex-row items-center gap-1">
            <h2 v-t="'pageJob.title'" class="text-primary text-title flex-1"></h2>

            <router-link to="/field">
                <button class="bg-gray-400">{{ $t('field') }}</button>
            </router-link>

            <router-link to="/job/add">
                <button class="bg-primary">{{ $t('add') }}</button>
            </router-link>
        </div>

        <TableComponent v-model:rows="jobList" :columns="headers" />
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { mapLocaleField } from '@/utils/mapLocaleField.js'
    import { useRouter } from 'vue-router'


    import TableComponent from '@/components/tables/tableComponent.vue';
    import JobService from '@/services/JobService.js';

    const router = useRouter()
    const rawJobList = ref([])
    const jobList = mapLocaleField(rawJobList, [
        { newKey: 'position' },
        { newKey: 'description' },
        { newKey: 'requirements' },
        { newKey: 'benefits' },
        { newKey: 'name' },
        { newKey: 'department', parentKey: 'Job_departmentId_fkey', viKey: 'name_vi', enKey: 'name_en' },
        { newKey: 'location', parentKey: 'Job_locationId_fkey', viKey: 'name_vi', enKey: 'name_en' }
    ])

    const headers = ref([
        { key: 'name', label: 'name' },
        { key: 'department', label: 'department' },
        { key: 'status', label: 'status' },
        { key: 'location', label: 'location' },
        {
            key: 'action',
            label: 'action',
            actions: [
                {
                    icon: '✏️', label: 'Sửa',
                    func: (row) => router.push(`/job/${row.id}`),
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
        const res = await JobService.getJob();
        rawJobList.value = res.success ? res.data : [];
    });
</script>
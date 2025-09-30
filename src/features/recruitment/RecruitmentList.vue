<template>
    <div class="w-full">
        <h3 class="text-primary">Danh sách vị trí công việc đang tuyển</h3>

        <div v-if="filteredRecruitments.length" class="w-full flex flex-col gap-1">
            <div v-for="item in filteredRecruitments" :key="item.id" class="card flex flex-row items-center p-1 gap-1">
                <div class="flex-1">
                    <h5 class="text-primary">{{ item.name }}</h5>
                    <p>{{ $t('description') }}: {{ item.description }}</p>
                    <p>{{ $t('type') }}: {{ item.jobType }}</p>
                    <p>{{ $t('fromDate') }}: {{ item.startDate }} {{ $t('toDate') }} {{ item.endDate }}</p>
                </div>
                <button class="bg-primary text-white px-3 py-1 rounded" @click="openRegisterForm(item.id)">
                    Ứng tuyển
                </button>
            </div>
        </div>

        <p v-else class="text-gray-500 italic">Không có kết quả phù hợp</p>
    </div>
</template>

<script setup>
    import { defineProps, computed } from "vue"
    import { useRouter } from "vue-router"

    const props = defineProps({
        recruitments: { type: Array, default: () => [] },
        selectedDepartments: { type: Array, default: () => [] },
        selectedJobs: { type: Array, default: () => [] }
    })

    const router = useRouter()

    // Lọc dữ liệu theo props truyền vào
    const filteredRecruitments = computed(() => {
        return props.recruitments.filter(item =>
            (props.selectedDepartments.length === 0 ||
                props.selectedDepartments.includes(item.departmentId)) &&
            (props.selectedJobs.length === 0 ||
                props.selectedJobs.includes(item.jobId))
        )
    })

    // Hàm mở form ứng tuyển
    function openRegisterForm(id) {
        router.push({ name: "register", params: { id: id } })
    }
</script>

<style scoped>
    .card {
        border-radius: 16px;
        border: 3px solid var(--color-primary);
    }

    button {
        height: fit-content;
        width: fit-content;
    }
</style>
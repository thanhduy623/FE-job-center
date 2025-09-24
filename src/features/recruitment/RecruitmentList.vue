<template>
    <div class="w-full">
        <h3 class="text-primary">Danh sách vị trí công việc đang tuyển</h3>

        <div v-if="filteredRecruitments.length" class="w-full flex flex-col gap-1">
            <div v-for="item in filteredRecruitments" :key="item.recruitmentId"
                class="card flex flex-row items-center p-1 gap-1">
                <div class="flex-1">
                    <h5 class="text-primary">{{ item.jobName }}</h5>
                    <p>Phân ban: {{ item.departmentName }}</p>
                    <p>Mô tả: {{ item.describe }}</p>
                    <p>Nhận hồ sơ từ: {{ item.startDate }} đến ngày {{ item.endDate }}</p>
                </div>
                <button class="bg-primary text-white px-3 py-1 rounded"
                    @click="openRegisterForm(item.recruitmentId)">Ứng tuyển</button>
            </div>
        </div>

        <p v-else class="text-gray-500 italic">Không có kết quả phù hợp</p>
    </div>
</template>


<script setup>
    import { defineProps, ref, watch, computed } from "vue"
    import { useRouter } from 'vue-router'

    const props = defineProps({
        recruitments: { type: Array, default: () => [] },
        selectedDepartments: { type: Array, default: () => [] },
        selectedJobs: { type: Array, default: () => [] }
    })

    // Tạo biến nội bộ để theo dõi
    const router = useRouter();
    const internalSelectedDepartments = ref([...props.selectedDepartments])
    const internalSelectedJobs = ref([...props.selectedJobs])

    // Cha → Con: cập nhật khi props thay đổi
    watch(
        () => props.selectedDepartments,
        (val) => {
            internalSelectedDepartments.value = [...val]
        }
    )

    watch(
        () => props.selectedJobs,
        (val) => {
            internalSelectedJobs.value = [...val]
        }
    )

    // Dùng computed lọc danh sách theo biến nội bộ
    const filteredRecruitments = computed(() => {
        return props.recruitments.filter(
            (item) =>
                (internalSelectedDepartments.value.length === 0 ||
                    internalSelectedDepartments.value.includes(item.departmentId)) &&
                (internalSelectedJobs.value.length === 0 ||
                    internalSelectedJobs.value.includes(item.jobId))
        )
    })

    // Hàm mở biểu mẫu ứng tuyển
    function openRegisterForm(recruitmentId) {
        router.push({ name: 'register', params: { id: recruitmentId } });
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
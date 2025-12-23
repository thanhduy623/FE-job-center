<template>
    <div class="w-full">
        <h3 id="jobList" class="text-primary">Danh sách vị trí công việc đang tuyển</h3>

        <div v-if="pagedRecruitments.length" class="w-full flex flex-col gap-1">
            <div v-for="item in pagedRecruitments" :key="item.id" class="card flex flex-row items-center p-1 gap-1">
                <div class="flex-1">
                    <h5 class="text-primary">{{ item.name }}</h5>
                    <p>{{ $t('position') }}: {{ item.position || '-' }}</p>
                    <p>{{ $t('salary') }}: {{ item.salary || '-' }}</p>
                    <p>
                        {{ $t('fromDate') }}: {{ formatDate(item.applicationDeadlineStart) }}
                        {{ $t('toDate') }}: {{ formatDate(item.applicationDeadlineEnd) }}
                    </p>
                </div>
                <button class="bg-primary text-white px-3 py-1 rounded" @click="openRegisterForm(item.id)">
                    Ứng tuyển
                </button>
            </div>

            <!-- Pagination -->
            <div class="flex justify-center items-center gap-2 mt-2">
                <button class="px-3 py-1 border rounded" :disabled="currentPage === 1"
                    @click="changePage(currentPage - 1)">
                    ‹
                </button>

                <span>{{ currentPage }} / {{ totalPages }}</span>

                <button class="px-3 py-1 border rounded" :disabled="currentPage === totalPages"
                    @click="changePage(currentPage + 1)">
                    ›
                </button>
            </div>
        </div>

        <p v-else class="text-gray-500 italic">Không có kết quả phù hợp</p>
    </div>
</template>

<script setup>
    import { defineProps, computed, watch, ref } from "vue"
    import { useRouter } from "vue-router"
    import { formatDate } from "@/utils/formatDate.js"

    const props = defineProps({
        recruitments: { type: Array, default: () => [] },
        selectedDepartments: { type: Array, default: () => [] },
    })

    const router = useRouter()

    // Phân trang
    const currentPage = ref(1)
    const itemsPerPage = 5

    // Lọc dữ liệu theo props
    const filteredRecruitments = computed(() => {
        return props.recruitments.filter(
            (item) =>
            (props.selectedDepartments.length === 0 ||
                props.selectedDepartments.includes(item.departmentId))
        )
    })

    // Tổng số trang
    const totalPages = computed(() =>
        Math.max(1, Math.ceil(filteredRecruitments.value.length / itemsPerPage))
    )

    // Dữ liệu hiển thị theo trang hiện tại
    const pagedRecruitments = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filteredRecruitments.value.slice(start, end)
    })

    // Khi lọc thay đổi thì quay về trang đầu
    watch(filteredRecruitments, () => {
        currentPage.value = 1
    })

    // 👉 Hàm chuyển trang + cuộn đến jobList
    function changePage(page) {
        currentPage.value = page
        const el = document.getElementById("jobList")
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }

    // Hàm mở form ứng tuyển
    function openRegisterForm(id) {
        router.push({ name: "register", params: { id } })
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
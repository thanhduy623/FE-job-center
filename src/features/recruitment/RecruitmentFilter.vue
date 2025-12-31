<template>
    <div class="flex flex-col recruitment-filter-container p-1">
        <button class="filter-btn bg-primary" @click="applyFilter" v-t="'applyFilter'"></button>

        <h4 v-t="'department'"></h4>
        <div v-for="dept in departments" :key="dept.id" class="checkbox-wrapper">
            <input type="checkbox" :id="dept.id" :value="dept.id" v-model="internalSelectedDepartments" />
            <label :for="dept.id">{{ dept.departmentName }}</label>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, defineProps, defineEmits } from "vue"

    const props = defineProps({
        departments: { type: Array, default: () => [] },
        selectedDepartments: { type: Array, default: () => [] },
    })

    const emit = defineEmits(["apply-filter"])

    const internalSelectedDepartments = ref([...props.selectedDepartments])

    // Cha -> Con
    watch(
        () => props.selectedDepartments,
        (val) => { internalSelectedDepartments.value = [...val] }
    )

    // Khi bấm nút mới emit ngược lên cha
    function applyFilter() {
        emit("apply-filter", {
            selectedDepartments: internalSelectedDepartments.value,
        })
    }
</script>

<style scoped>
    .recruitment-filter-container {
        min-width: 300px;
        max-width: 350px;
        border: 3px solid var(--color-primary);
        border-radius: 16px;
    }

    .filter-btn {
        width: 100%;
        border-radius: 0;
        margin-bottom: 10px;
    }

    /* === Checkbox + Label === */
    .checkbox-wrapper {
        display: flex;
        align-items: center;
        /* căn giữa theo chiều cao */
        gap: 0.5rem;
        /* khoảng cách giữa checkbox và label */
        margin-bottom: 0.5rem;
    }

    .checkbox-wrapper input[type="checkbox"] {
        width: 22px !important;
        height: 22px !important;
    }
</style>
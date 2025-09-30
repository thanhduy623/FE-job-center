<template>
    <div class="recruitment-filter-container p-1">
        <button class="filter-btn bg-primary" @click="applyFilter" v-t="'applyFilter'"></button>

        <h4 v-t="'department'"></h4>
        <div v-for="dept in departments" :key="dept.id">
            <input type="checkbox" :id="dept.id" :value="dept.id" v-model="internalSelectedDepartments" />
            <label :for="dept.id">{{ dept.departmentName }}</label>
        </div>

        <hr />

        <h4 v-t="'job'"></h4>
        <div v-for="job in jobs" :key="job.id">
            <input type="checkbox" :id="job.id" :value="job.id" v-model="internalSelectedJobs" />
            <label :for="job.jobId">{{ job.name }}</label>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, defineProps, defineEmits } from "vue"

    const props = defineProps({
        departments: { type: Array, default: () => [] },
        jobs: { type: Array, default: () => [] },
        selectedDepartments: { type: Array, default: () => [] },
        selectedJobs: { type: Array, default: () => [] }
    })

    const emit = defineEmits(["apply-filter"])

    const internalSelectedDepartments = ref([...props.selectedDepartments])
    const internalSelectedJobs = ref([...props.selectedJobs])

    // Cha -> Con
    watch(
        () => props.selectedDepartments,
        (val) => { internalSelectedDepartments.value = [...val] }
    )
    watch(
        () => props.selectedJobs,
        (val) => { internalSelectedJobs.value = [...val] }
    )

    // Khi bấm nút mới emit ngược lên cha
    function applyFilter() {
        emit("apply-filter", {
            selectedDepartments: internalSelectedDepartments.value,
            selectedJobs: internalSelectedJobs.value
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
</style>
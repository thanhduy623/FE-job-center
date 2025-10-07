<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="job in displayJobTypes" :key="job.id" :value="job.id">
            {{ job.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { jobTypes } from '@/data/jobTypes.js'

    // Props & emits
    const props = defineProps({
        modelValue: [String, Number]
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const jobTypeList = ref([...jobTypes])

    // Gán giá trị mặc định nếu chưa có
    if (!props.modelValue && jobTypeList.value.length > 0) {
        emit('update:modelValue', jobTypeList.value[0].id)
    }

    // Tính toán danh sách hiển thị theo ngôn ngữ
    const displayJobTypes = computed(() =>
        jobTypeList.value.map(job => ({
            ...job,
            displayName: job[`name_${locale.value}`] || job.name_en // fallback
        }))
    )

    // Watch locale để tự động cập nhật hiển thị khi đổi ngôn ngữ
    watch(locale, () => { })
</script>
<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled>-- {{ $t('department') }} --</option>
        <option v-for="dep in displayDepartments" :key="dep.id" :value="dep.id">
            {{ dep.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { getDepartment } from '@/services/DepartmentService'

    // Props
    const props = defineProps({
        modelValue: [String, Number],
        autoSelectFirst: { type: Boolean, default: true }
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const departmentList = ref([])

    // Load danh sách phòng ban
    onMounted(async () => {
        const res = await getDepartment()
        if (res.success) {
            departmentList.value = res.data

            // Nếu chưa có giá trị và cho phép tự chọn
            if (props.autoSelectFirst && !props.modelValue && departmentList.value.length > 0) {
                emit('update:modelValue', departmentList.value[0].id)
            }
        }
    })

    // Hiển thị tên theo locale
    const displayDepartments = computed(() =>
        departmentList.value.map(dep => ({
            ...dep,
            displayName: dep['name_' + locale.value]
        }))
    )

    watch(locale, () => { })
</script>
<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="dep in displayDepartments" :key="dep.id" :value="dep.id">
            {{ dep.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { getDepartment } from '@/services/DepartmentService'

    // Khai báo props và emit
    const props = defineProps({
        modelValue: [String, Number]
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const departmentList = ref([])

    // Load danh sách phòng ban
    onMounted(async () => {
        const res = await getDepartment()
        if (res.success) {
            departmentList.value = res.data
            // Gán giá trị mặc định nếu modelValue chưa có
            if (!props.modelValue && departmentList.value.length > 0) {
                emit('update:modelValue', departmentList.value[0].id)
            }
        }
    })

    // Tạo computed để hiển thị tên theo locale
    const displayDepartments = computed(() =>
        departmentList.value.map(dep => ({
            ...dep,
            displayName: dep['name_' + locale.value]
        }))
    )

    // Nếu muốn đổi locale, computed tự cập nhật
    watch(locale, () => { })
</script>
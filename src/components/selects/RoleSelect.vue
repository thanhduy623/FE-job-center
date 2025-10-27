<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled>-- {{ $t('role') }} --</option>
        <option v-for="role in displayRoles" :key="role.id" :value="role.id">
            {{ role.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { getAllRole } from '@/services/RoleService'

    // Props
    const props = defineProps({
        modelValue: [String, Number],
        autoSelectFirst: { type: Boolean, default: true }
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const roleList = ref([])

    // Load danh sách role
    onMounted(async () => {
        const res = await getAllRole()
        if (res.success) {
            roleList.value = res.data

            // Nếu được cho phép và chưa có giá trị => tự chọn item đầu tiên
            if (props.autoSelectFirst && !props.modelValue && roleList.value.length > 0) {
                emit('update:modelValue', roleList.value[0].id)
            }
        }
    })

    // Hiển thị tên theo locale
    const displayRoles = computed(() =>
        roleList.value.map(role => ({
            ...role,
            displayName: role['name_' + locale.value]
        }))
    )

    watch(locale, () => { })
</script>
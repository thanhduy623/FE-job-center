<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="role in displayRoles" :key="role.id" :value="role.id">
            {{ role.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { getAllRole } from '@/services/RoleService'

    // Props và emits
    const props = defineProps({
        modelValue: [String, Number]
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const roleList = ref([])

    // Load role
    onMounted(async () => {
        const res = await getAllRole()
        if (res.success) {
            roleList.value = res.data
            // Gán giá trị mặc định nếu chưa có modelValue
            if (!props.modelValue && roleList.value.length > 0) {
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

    // watch locale để tự cập nhật khi thay đổi
    watch(locale, () => { })
</script>
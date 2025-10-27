<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="type in displayTypes" :key="type.id" :value="type.id">
            {{ type.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { types } from '@/data/typeFile.js'

    const props = defineProps({
        modelValue: [String, Number]
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const typeOptions = ref([...types])

    // Gán giá trị mặc định nếu chưa có
    if (!props.modelValue && typeOptions.value.length > 0) {
        emit('update:modelValue', typeOptions.value[0].id)
    }

    // Hiển thị tên theo locale
    const displayTypes = computed(() =>
        typeOptions.value.map(t => ({
            ...t,
            displayName: t[`name_${locale.value}`] || t.name_en
        }))
    )

    // Tự cập nhật khi thay đổi ngôn ngữ
    watch(locale, () => { })
</script>


<style scoped>
    input {
        border-style: solid !important;
    }
</style>
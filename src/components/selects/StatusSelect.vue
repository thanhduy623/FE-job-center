<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option value="" disabled>-- {{ $t('status') }} --</option>

        <option v-for="st in displayStatus" :key="st.id" :value="st.id">
            {{ st.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { status } from '@/data/status.js'

    // Props và emits
    const props = defineProps({
        modelValue: [String, Number],
        autoSelectFirst: { type: Boolean, default: true }
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const statuses = ref([...status])

    // Gán giá trị mặc định nếu chưa có
    if (props.autoSelectFirst && !props.modelValue && statuses.value.length > 0) {
        emit('update:modelValue', statuses.value[0].id)
    }

    // Hiển thị tên theo locale
    const displayStatus = computed(() =>
        statuses.value.map(s => ({
            ...s,
            displayName: s[`name_${locale.value}`] || s.name_en // fallback nếu locale chưa có
        }))
    )

    // Tự cập nhật khi thay đổi ngôn ngữ
    watch(locale, () => { })
</script>
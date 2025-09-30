<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="gen in displayGenders" :key="gen.id" :value="gen.id">
            {{ gen.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { genders } from '@/data/genders.js'

    // Props và emits
    const props = defineProps({
        modelValue: [String, Number]
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const genderList = ref([...genders])

    // Gán giá trị mặc định nếu chưa có
    if (!props.modelValue && genderList.value.length > 0) {
        emit('update:modelValue', genderList.value[0].id)
    }

    // Hiển thị tên theo locale
    const displayGenders = computed(() =>
        genderList.value.map(g => ({
            ...g,
            displayName: g['name_' + locale.value]
        }))
    )

    // watch locale để tự cập nhật khi thay đổi
    watch(locale, () => { })
</script>
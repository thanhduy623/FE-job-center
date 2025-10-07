<template>
    <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="loc in displayLocations" :key="loc.id" :value="loc.id">
            {{ loc.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue'
    import { useI18n } from 'vue-i18n'
    import { getLocation } from '@/services/LocationService'

    // Props & emits
    const props = defineProps({
        modelValue: [String, Number]
    })
    const emit = defineEmits(['update:modelValue'])

    const { locale } = useI18n()
    const locationList = ref([])

    // Lấy danh sách địa điểm
    onMounted(async () => {
        const res = await getLocation()
        if (res.success) {
            locationList.value = res.data
            // Gán giá trị mặc định nếu modelValue chưa có
            if (!props.modelValue && locationList.value.length > 0) {
                emit('update:modelValue', locationList.value[0].id)
            }
        }
    })

    // Hiển thị tên theo ngôn ngữ hiện tại
    const displayLocations = computed(() =>
        locationList.value.map(loc => ({
            ...loc,
            displayName: loc['name_' + locale.value] || loc.name_en
        }))
    )

    // Tự cập nhật khi thay đổi ngôn ngữ
    watch(locale, () => { })
</script>
<template>
    <select :value="selectedValue" @change="handleChange($event)">
        <option v-for="st in displayStatus" :key="st.id" :value="st.id">
            {{ st.displayName }}
        </option>
    </select>
</template>

<script setup>
    import { ref, computed, watch, defineProps, defineEmits } from "vue"
    import { useI18n } from "vue-i18n"
    import { statusApplication } from "@/data/statusApplication.js"

    const props = defineProps({ modelValue: String })
    const emit = defineEmits(['update:modelValue'])
    const { locale } = useI18n()
    const statuses = ref([...statusApplication])

    // Giá trị hiển thị hiện tại
    const selectedValue = ref(props.modelValue || (statuses.value[0] && statuses.value[0].id))

    // Watch để update khi parent thay đổi modelValue
    watch(() => props.modelValue, (newVal) => {
        selectedValue.value = newVal
    })

    // Danh sách hiển thị
    const displayStatus = computed(() =>
        statuses.value.map(s => ({
            ...s,
            displayName: s[`name_${locale.value}`] || s.name_en
        }))
    )

    // Emit khi select thay đổi
    function handleChange(event) {
        selectedValue.value = event.target.value
        emit('update:modelValue', selectedValue.value)
    }
</script>
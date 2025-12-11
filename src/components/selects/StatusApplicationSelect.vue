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
    import { EventBus } from "@/utils/eventBus.js"

    const props = defineProps({ modelValue: String })
    const emit = defineEmits(["attemptChange"]) // chỉ emit attemptChange
    const { locale } = useI18n()

    const selectedValue = ref(props.modelValue)

    // thứ tự trạng thái (dùng để so sánh tiến/lùi)
    const order = statusApplication.map(s => s.id)

    // đồng bộ khi parent thay đổi modelValue
    watch(() => props.modelValue, newVal => {
        selectedValue.value = newVal
    })

    const displayStatus = computed(() =>
        statusApplication.map(s => ({
            ...s,
            displayName: s[`name_${locale.value}`] || s.name_en
        }))
    )

    async function handleChange(event) {
        const newValue = event.target.value
        const oldValue = selectedValue.value

        // giữ lại nếu ko thay đổi
        if (newValue === oldValue) return

        // không cho chọn 2 trạng thái này
        if (["MAILED", "CONFIRMED"].includes(newValue)) {
            EventBus.showNotify("Trạng thái này không được phép chọn!", "warning")
            selectedValue.value = oldValue
            return
        }

        const oldIndex = order.indexOf(oldValue)
        const newIndex = order.indexOf(newValue)

        // nếu lùi trạng thái
        if (newIndex < oldIndex) {
            EventBus.showNotify("Không thể quay về trạng thái trước!", "warning")
            selectedValue.value = oldValue
            return
        }

        // nếu tiến trạng thái -> confirm hiển thị ở đây
        if (newIndex > oldIndex) {
            const ok = await EventBus.confirm(`Bạn có chắc muốn cập nhật trạng thái từ "${oldValue}" → "${newValue}" không?`)
            if (!ok) {
                selectedValue.value = oldValue
                return
            }
        }

        // Nếu đến đây là hợp lệ và đã confirm (nếu cần)
        // Emit một event để parent xử lý cập nhật thực tế (API call)
        emit("attemptChange", { newValue, oldValue })

        // Note: không emit update:modelValue ở đây — parent sẽ cập nhật modelValue khi API thành công.
        // Nếu bạn muốn hiển thị tạm thời thay đổi trong Select trước khi parent xác nhận,
        // selectedValue.value = newValue
    }
</script>
<template>
    <div class="multi-datepicker-wrapper">
        <div class="input-wrapper" @click="isCalendarOpen = true" :class="{ 'has-value': displayValue }">
            <input type="text" readonly :value="displayValue"
                :placeholder="displayValue ? '' : 'Chọn ngày cần thiết'" />
        </div>

        <div v-if="isCalendarOpen" class="calendar-overlay">
            <div class="calendar-container">
                <div class="calendar-header">
                    <button @click="changeMonth(-1)" class="nav-button">&#9664;</button>
                    <span>{{ currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) }}</span>
                    <button @click="changeMonth(1)" class="nav-button">&#9654;</button>
                </div>

                <div class="weekdays">
                    <span v-for="day in ['CN','T2','T3','T4','T5','T6','T7']" :key="day">{{ day }}</span>
                </div>

                <div class="calendar-grid">
                    <template v-for="(day, index) in calendarDays" :key="index">
                        <span v-if="day === null" class="empty-day"></span>
                        <span v-else :class="['calendar-day', { selected: isSelected(day), disabled: isDisabled(day) }]"
                            @click="!isDisabled(day) && toggleDate(day)">
                            {{ day.getDate() }}
                        </span>
                    </template>
                </div>

                <div class="calendar-footer">
                    <div class="selected-summary">Đã chọn: {{ selectedDates.length }} ngày</div>
                    <button @click="isCalendarOpen = false" class="close-button">Đóng</button>
                </div>
            </div>

            <div class="backdrop" @click.self="isCalendarOpen = false"></div>
        </div>
    </div>
</template>

<script setup>
    import { ref, watch, defineProps, defineEmits, computed } from 'vue'

    const props = defineProps({
        modelValue: {
            type: Array,
            default: () => []
        }
    })

    const emit = defineEmits(['update:modelValue'])

    const isCalendarOpen = ref(false)
    const currentDate = ref(new Date())
    const selectedDates = ref(props.modelValue.map(d => d instanceof Date ? d : new Date(d)))

    // --- Utils: chuyển Date thành YYYY-MM-DD local ---
    const toLocalDateString = (date) => {
        const d = new Date(date)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    // --- Computed ---
    const displayValue = computed(() => {
        if (selectedDates.value.length === 0) return ''
        return selectedDates.value
            .map(d => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }))
            .join(', ')
    })

    const calendarDays = computed(() => {
        const year = currentDate.value.getFullYear()
        const month = currentDate.value.getMonth()
        const startDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const days = []
        for (let i = 0; i < startDay; i++) days.push(null)
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
        return days
    })

    // --- Logic ---
    const isDisabled = (date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date <= today
    }

    const toggleDate = (date) => {
        if (isDisabled(date)) return
        const dateStr = toLocalDateString(date)
        const index = selectedDates.value.findIndex(d => toLocalDateString(d) === dateStr)
        if (index === -1) selectedDates.value.push(date)
        else selectedDates.value.splice(index, 1)
        emit('update:modelValue', selectedDates.value)
    }

    const isSelected = (date) => {
        const dateStr = toLocalDateString(date)
        return selectedDates.value.some(d => toLocalDateString(d) === dateStr)

    }

    const changeMonth = (offset) => {
        currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + offset))
    }

    // --- Đồng bộ props ---
    watch(() => props.modelValue, val => {
        selectedDates.value = val.map(d => d instanceof Date ? d : new Date(d))
    }, { immediate: true })
</script>

<style scoped>
    .input-wrapper {
        width: 100%;
        min-width: 250px;
        height: 2.5rem;
        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;
        border: 1px solid var(--color-primary, #007bff);
        border-radius: 16px;
        padding: 0 30px 0 10px;
        box-sizing: border-box;
    }

    .input-wrapper input {
        flex-grow: 1;
        height: 100%;
        border: none;
        background: transparent;
        line-height: 2.5rem;
    }

    .input-wrapper::after {
        content: '▼';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.7em;
        pointer-events: none;
    }

    .calendar-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
    }

    .calendar-container {
        position: relative;
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1001;
    }

    .calendar-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        font-weight: bold;
        color: var(--color-primary, #007bff);
    }

    .nav-button {
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.2em;
        color: var(--color-primary);
    }

    .weekdays,
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
    }

    .calendar-day {
        padding: 8px 5px;
        margin: 2px;
        border-radius: 50%;
        cursor: pointer;
    }

    .calendar-day:hover {
        background: #eee;
    }

    .calendar-day.selected {
        background: var(--color-primary);
        color: white;
        font-weight: bold;
    }

    .calendar-day.disabled {
        opacity: 0.35;
        cursor: not-allowed;
        pointer-events: none;
    }

    .calendar-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
    }

    .close-button {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
    }

    .selected-summary {
        color: var(--color-primary);
        font-size: 0.9em;
    }
</style>
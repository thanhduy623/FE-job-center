<template>
    <div class="multi-datepicker-wrapper">
        <div class="input-wrapper" @click="isCalendarOpen = true" :class="{ 'has-value': displayValue }">
            <input type="text" readonly :value="displayValue"
                :placeholder="displayValue ? '' : 'Chọn các ngày cần thiết'" />
        </div>

        <div v-if="isCalendarOpen" class="calendar-overlay">
            <div class="calendar-container">
                <div class="calendar-header">
                    <button @click="changeMonth(-1)" class="nav-button">&#9664;</button>
                    <span>{{ currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) }}</span>
                    <button @click="changeMonth(1)" class="nav-button">&#9654;</button>
                </div>

                <div class="weekdays">
                    <span v-for="day in ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']" :key="day">{{ day }}</span>
                </div>

                <div class="calendar-grid">
                    <template v-for="(day, index) in calendarDays" :key="index">
                        <span v-if="day === null" class="empty-day"></span>
                        <span v-else :class="['calendar-day', { selected: isSelected(day) }]" @click="toggleDate(day)">
                            {{ day.getDate() }}
                        </span>
                    </template>
                </div>

                <div class="calendar-footer">
                    <div class="selected-summary"> Đã chọn: {{ selectedDates.length }} ngày </div>
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

    // --- State nội bộ ---
    const isCalendarOpen = ref(false)
    const currentDate = ref(new Date())
    const selectedDates = ref(props.modelValue.map(date => date instanceof Date ? date : new Date(date)))

    // --- Computed Properties ---
    const displayValue = computed(() => {
        if (selectedDates.value.length === 0) {
            return ''
        }
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
        for (let i = 0; i < startDay; i++) {
            days.push(null)
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i))
        }
        return days
    })

    // --- Hàm logic ---
    const toggleDate = (date) => {
        const dateString = date.toISOString().split('T')[0]
        const index = selectedDates.value.findIndex(d => d.toISOString().split('T')[0] === dateString)

        if (index === -1) {
            selectedDates.value.push(date)
        } else {
            selectedDates.value.splice(index, 1)
        }
        emit('update:modelValue', selectedDates.value)
    }

    const isSelected = (date) => {
        const dateString = date.toISOString().split('T')[0]
        return selectedDates.value.some(d => d.toISOString().split('T')[0] === dateString)
    }

    const changeMonth = (offset) => {
        currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + offset))
    }

    // --- Đồng bộ ---
    watch(() => props.modelValue, (val) => {
        selectedDates.value = val.map(date => date instanceof Date ? date : new Date(date))
    }, { immediate: true })
</script>

<style scoped>
    /*
    ======================================
    1. STYLE CHO INPUT & MŨI TÊN (ĐÃ SỬA LỖI & SỬ DỤNG BIẾN)
    ======================================
*/
    .input-wrapper {
        /* Đảm bảo chiều rộng và box-sizing theo quy tắc chung */
        width: 100%;
        min-width: 250px;
        max-width: 100%;
        height: 2.5rem;
        /* Theo quy tắc chung */

        display: flex;
        align-items: center;
        position: relative;
        cursor: pointer;

        /* Theo quy tắc chung */
        border: 1px solid var(--color-primary, #007bff);
        border-radius: 16px;
        box-sizing: border-box;

        /* Thêm padding cho nội dung, trừ phần mũi tên */
        padding: 0 30px 0 10px;
    }

    .input-wrapper input {
        /* Reset input để nó lấp đầy wrapper, theo quy tắc chung */
        flex-grow: 1;
        height: 100%;
        padding: 0;

        /* Loại bỏ border/background mặc định (đã được reset toàn cục) */
        cursor: inherit;
        border: none;
        background: transparent;

        /* Căn giữa dọc chữ */
        line-height: 2.5rem;
    }

    /* Thêm biểu tượng mũi tên bằng pseudo-element */
    .input-wrapper::after {
        content: '▼';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.7em;
        color: var(--color-gray-500, #555);
        pointer-events: none;
    }

    /*
    ======================================
    2. STYLE CHO OVERLAY TOÀN MÀN HÌNH
    ======================================
*/
    .calendar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .calendar-container {
        position: relative;
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 400px;
        z-index: 1001;
    }

    /*
    ======================================
    3. STYLE CHO LỊCH BÊN TRONG (Sử dụng biến)
    ======================================
*/
    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        font-weight: bold;
        font-size: 1.1em;
        color: var(--color-primary, #007bff);
        text-transform: uppercase;
    }

    .nav-button {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
        padding: 5px 10px;
        border-radius: 4px;
        color: var(--color-primary, #007bff);
    }

    .weekdays,
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
    }

    .weekdays span {
        font-weight: 500;
        color: var(--color-gray-500, #555);
        padding: 5px 0;
        font-size: 0.85em;
    }

    .calendar-day {
        padding: 8px 5px;
        cursor: pointer;
        border-radius: 50%;
        transition: background-color 0.2s;
        margin: 2px;
    }

    .calendar-day:hover {
        background-color: #eee;
    }

    .calendar-day.selected {
        background-color: var(--color-primary, #007bff);
        color: white;
        font-weight: bold;
    }

    .calendar-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 1px solid #eee;
    }

    .close-button {
        background-color: var(--color-primary, #007bff);
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
    }

    .selected-summary {
        font-size: 0.9em;
        color: var(--color-primary, #007bff);
        font-weight: 500;
    }
</style>
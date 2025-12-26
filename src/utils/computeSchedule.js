import { EventBus } from './eventBus'

const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return 0
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

const minutesToTime = (totalMinutes) => {
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const calculateShiftDuration = (start, end) => {
    return timeToMinutes(end) - timeToMinutes(start)
}

export function computeSchedule(
    selectedDates,
    duration,
    breakTime,
    morningStart,
    morningEnd,
    afternoonStart,
    afternoonEnd,
    applicants
) {
    /* 1. Kiểm tra đầu vào */
    if (!applicants?.length) {
        EventBus.showNotify('Không có ứng viên để xếp lịch', 'warning')
        return null
    }

    if (
        !selectedDates?.length ||
        !duration ||
        breakTime === null ||
        !morningStart || !morningEnd ||
        !afternoonStart || !afternoonEnd
    ) {
        EventBus.showNotify('Dữ liệu xếp lịch chưa đầy đủ', 'warning')
        return null
    }

    /* 2. Tính thời gian ca */
    const morningMinutes = calculateShiftDuration(morningStart, morningEnd)
    const afternoonMinutes = calculateShiftDuration(afternoonStart, afternoonEnd)

    if (morningMinutes <= 0 && afternoonMinutes <= 0) {
        EventBus.showNotify('Thời gian phỏng vấn trong ngày không hợp lệ', 'warning')
        return null
    }

    /* 3. Slot */
    const slotDuration = duration + breakTime
    const morningSlots = Math.floor(morningMinutes / slotDuration)
    const afternoonSlots = Math.floor(afternoonMinutes / slotDuration)
    const slotsPerDay = morningSlots + afternoonSlots

    if (slotsPerDay === 0) {
        EventBus.showNotify('Không đủ thời gian để xếp 1 lượt phỏng vấn', 'warning')
        return null
    }

    /* 4. Kiểm tra số ngày tối thiểu */
    const totalApplicants = applicants.length
    const requiredDays = Math.ceil(totalApplicants / slotsPerDay)

    if (requiredDays > selectedDates.length) {
        EventBus.showNotify(
            `Cần tối thiểu ${requiredDays} ngày để xếp hết ${totalApplicants} ứng viên`,
            'warning'
        )
    }

    /* 5. Xếp lịch */
    let index = 0
    const result = []

    for (let d = 0; d < selectedDates.length && index < totalApplicants; d++) {
        const dateStr = selectedDates[d].toISOString().split('T')[0]

        /* Ca sáng */
        let currentMinutes = timeToMinutes(morningStart)
        for (let i = 0; i < morningSlots && index < totalApplicants; i++) {
            const app = applicants[index]

            result.push({
                ...app,
                scheduleDate: dateStr,
                scheduleStartTime: minutesToTime(currentMinutes),
                scheduleEndTime: minutesToTime(currentMinutes + duration)
            })

            currentMinutes += slotDuration
            index++
        }

        /* Ca chiều */
        currentMinutes = timeToMinutes(afternoonStart)
        for (let i = 0; i < afternoonSlots && index < totalApplicants; i++) {
            const app = applicants[index]

            result.push({
                ...app,
                scheduleDate: dateStr,
                scheduleStartTime: minutesToTime(currentMinutes),
                scheduleEndTime: minutesToTime(currentMinutes + duration)
            })

            currentMinutes += slotDuration
            index++
        }
    }

    EventBus.showNotify('Xếp lịch phỏng vấn thành công', 'success')
    return result
}

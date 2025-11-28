import { EventBus } from './eventBus'

// --- UTILITY FUNCTIONS (Hàm Tiện ích) ---

// Chuyển "HH:MM" thành số phút kể từ nửa đêm
const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

// Chuyển số phút kể từ nửa đêm thành "HH:MM"
const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Tính thời lượng ca làm việc (phút)
const calculateShiftDuration = (start, end) => {
    return timeToMinutes(end) - timeToMinutes(start);
};

/**
 * Hàm phụ trợ cho bước 9: Xếp lịch cho một ca làm việc (Sáng hoặc Chiều)
 * Ưu tiên xếp trọn 1 Department trong 1 buổi nếu có thể.
 */
function scheduleShiftOptimized(
    daySchedule,
    startIndex,
    allApplicants,
    shiftStartTime,
    maxSlots,
    slotDuration,
    shiftName
) {
    let currentApplicantIndex = startIndex;
    let slotsUsed = 0;
    let currentTimeMinutes = timeToMinutes(shiftStartTime);

    if (startIndex >= allApplicants.length) return startIndex;

    // Lấy DepartmentID của ứng viên tiếp theo để cố gắng xếp trọn
    const targetDeptId = allApplicants[startIndex].Application_jobId_fkey?.departmentId;
    const interviewDuration = allApplicants[startIndex].duration;

    for (let i = startIndex; i < allApplicants.length && slotsUsed < maxSlots; i++) {
        const applicant = allApplicants[i];
        const nextDeptId = applicant.Application_jobId_fkey?.departmentId;

        // B9: Nếu department đã thay đổi, dừng xếp lịch cho ca này
        if (nextDeptId !== targetDeptId) {
            console.log(`B9. Dừng xếp lịch ${shiftName} lúc ${minutesToTime(currentTimeMinutes)} để tối ưu hóa Khoa (Department: ${targetDeptId})`);
            break;
        }

        // Xếp lịch ứng viên
        const startTime = minutesToTime(currentTimeMinutes);
        const endTimeMinutes = currentTimeMinutes + interviewDuration; // Thời gian kết thúc phỏng vấn

        daySchedule.slots.push({
            applicant: applicant,
            startTime: startTime,
            endTime: minutesToTime(endTimeMinutes),
            slotEndTime: minutesToTime(currentTimeMinutes + slotDuration), // Bao gồm cả thời gian nghỉ
            departmentId: nextDeptId,
            shift: shiftName
        });

        currentTimeMinutes += slotDuration;
        currentApplicantIndex = i + 1;
        slotsUsed++;
    }

    return currentApplicantIndex; // Trả về chỉ mục tiếp theo
}

// --- LOGIC CHÍNH ---

/**
 * Hàm tính toán và xếp lịch phỏng vấn tối ưu.
 * @param {string} locationId - ID cơ sở được chọn.
 * @param {Date[]} selectedDates - Mảng các ngày đã chọn.
 * @param {number} duration - Thời lượng phỏng vấn mỗi lượt (phút).
 * @param {number} breakTime - Thời gian nghỉ giữa các lượt (phút).
 * @param {string} morningStart - Bắt đầu ca sáng (HH:MM).
 * @param {string} morningEnd - Kết thúc ca sáng (HH:MM).
 * @param {string} afternoonStart - Bắt đầu ca chiều (HH:MM).
 * @param {string} afternoonEnd - Kết thúc ca chiều (HH:MM).
 * @param {Object[]} rawApplications - Dữ liệu ứng viên thô đã được lọc theo trạng thái cần thiết.
 * @returns {Object[] | null} - Mảng ứng viên đã được xếp lịch hoặc null nếu thất bại/thiếu ngày.
 */
export function computeSchedule(
    locationId,
    selectedDates,
    duration,
    breakTime,
    morningStart,
    morningEnd,
    afternoonStart,
    afternoonEnd,
    rawApplications
) {
    // 1. KIỂM TRA INPUT KHÔNG RỖNG
    if (!locationId || !selectedDates?.length || !duration || !breakTime || !morningStart || !morningEnd || !afternoonStart || !afternoonEnd || !rawApplications?.length) {
        EventBus.showNotify('Dữ liệu chưa đầy đủ để xếp lịch', 'warning')
        return null;
    }

    // 2. TÍNH TỔNG THỜI GIAN BUỔI SÁNG VÀ CẢ CHIỀU (phút)
    const morningTotalMinutes = calculateShiftDuration(morningStart, morningEnd);
    const afternoonTotalMinutes = calculateShiftDuration(afternoonStart, afternoonEnd);

    if (morningTotalMinutes <= 0 && afternoonTotalMinutes <= 0) {
        EventBus.showNotify('Tổng thời gian phỏng vấn trong ngày bằng 0', 'warning')
        return null;
    }

    // 3. TÍNH THỜI GIAN 1 LƯỢT VÀ NGHỈ
    const slotDuration = duration + breakTime; // Thời gian tổng (phỏng vấn + nghỉ)

    // 4. TÍNH SỐ LƯỢT TỐI ĐA TRÊN BUỔI VÀ TRÊN NGÀY
    const morningSlots = Math.floor(morningTotalMinutes / slotDuration);
    const afternoonSlots = Math.floor(afternoonTotalMinutes / slotDuration);
    const maxSlotsPerDay = morningSlots + afternoonSlots;

    // console.log(`B4. Tổng Lượt/Ngày: ${maxSlotsPerDay} (Sáng: ${morningSlots}, Chiều: ${afternoonSlots})`);

    // 6. LỌC ỨNG VIÊN THEO locationId
    let filteredApplicants = rawApplications.filter(app => {
        const jobLocationId = app.Application_jobId_fkey?.locationId;
        return jobLocationId === locationId;
    });

    // Tạo bản sao ứng viên và thêm duration
    let applicantsToSchedule = filteredApplicants.map(app => ({ ...app, duration }));
    const totalApplicants = applicantsToSchedule.length;
    // console.log(`B6. Tổng số ứng viên cần xếp lịch: ${totalApplicants}`);

    // 5. KIỂM TRA SỐ LƯỢNG NGÀY CẦN THIẾT
    if (maxSlotsPerDay === 0) {
        EventBus.showNotify('Không có lượt nào trong ngày', 'warning')
        return null;
    }
    const requiredDays = Math.ceil(totalApplicants / maxSlotsPerDay);
    if (requiredDays > selectedDates.length) {
        EventBus.showNotify(`CẢNH BÁO (B5): Cần tối thiểu ${requiredDays} ngày, nhưng bạn chỉ chọn ${selectedDates.length} ngày.`, 'warning')
    }

    // 7. SẮP XẾP ỨNG VIÊN (Theo DepartmentId, rồi tới JobId)
    applicantsToSchedule.sort((a, b) => {
        const deptA = a.Application_jobId_fkey?.departmentId || '';
        const deptB = b.Application_jobId_fkey?.departmentId || '';
        const jobA = a.jobId || '';
        const jobB = b.jobId || '';

        if (deptA < deptB) return -1;
        if (deptA > deptB) return 1;
        if (jobA < jobB) return -1;
        if (jobA > jobB) return 1;
        return 0;
    });

    // 8. TÍNH SỐ LƯỢNG ỨNG VIÊN TRÊN MỖI KHOA
    // const deptTally = applicantsToSchedule.reduce((acc, app) => {
    //     const deptId = app.Application_jobId_fkey?.departmentId;
    //     if (deptId) {
    //         acc[deptId] = (acc[deptId] || 0) + 1;
    //     }
    //     return acc;
    // }, {});
    // console.log('B8. Số lượng ứng viên theo Khoa (Department Tally):', deptTally);

    // 9. THUẬT TOÁN XẾP LỊCH TỐI ƯU KHOA
    const schedule = [];
    let applicantIndex = 0;

    for (let dayIndex = 0; dayIndex < selectedDates.length && applicantIndex < totalApplicants; dayIndex++) {
        const date = selectedDates[dayIndex];
        const daySchedule = { date: date.toISOString().split('T')[0], slots: [] };

        // --- Xếp lịch Buổi Sáng ---
        applicantIndex = scheduleShiftOptimized(
            daySchedule,
            applicantIndex,
            applicantsToSchedule,
            morningStart,
            morningSlots,
            slotDuration,
            'MORNING'
        );

        // --- Xếp lịch Buổi Chiều ---
        applicantIndex = scheduleShiftOptimized(
            daySchedule,
            applicantIndex,
            applicantsToSchedule,
            afternoonStart,
            afternoonSlots,
            slotDuration,
            'AFTERNOON'
        );

        schedule.push(daySchedule);
    }

    // Định dạng kết quả cuối cùng
    const finalScheduledList = [];
    schedule.forEach(daySchedule => {
        daySchedule.slots.forEach(slot => {
            finalScheduledList.push({
                ...slot.applicant,
                scheduleDate: daySchedule.date,
                scheduleStartTime: slot.startTime, // Thời gian bắt đầu phỏng vấn
                scheduleEndTime: slot.endTime, // Thời gian kết thúc phỏng vấn
                scheduleSlotEnd: slot.slotEndTime, // Thời gian kết thúc slot (bao gồm nghỉ)
                scheduleLocationId: locationId,
                scheduleShift: slot.shift
            });
        });
    });

    // Trả về JSON (Mảng ứng viên đã được xếp lịch)
    EventBus.showNotify('Xếp lịch thành công', 'success')
    return finalScheduledList;
}
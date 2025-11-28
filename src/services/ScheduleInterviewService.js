import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

const tableName = "SchelduleInterview"
const foreignKey = ["Token_applicationId_fkey"]

/**
 * Lấy danh sách lịch phỏng vấn
 */
export async function getSchedule(conditions = {}) {
    // Liên kết với bảng Application qua khóa ngoại applicationId
    return await getData(tableName, conditions, ["applicationId"])
}

/**
 * Lấy chi tiết lịch phỏng vấn theo ID
 */
export async function getScheduleById(id) {
    if (!id) return { success: false, message: "Thiếu ID lịch phỏng vấn" }

    const res = await getData(tableName, { id }, foreignKey)

    if (res.success && res.data?.length) {
        return { success: true, data: res.data }
    }

    return { success: false, message: res.message || "Không tìm thấy lịch phỏng vấn" }
}

export async function getScheduleByToken(token) {
    if (!token) return { success: false, message: "Thiếu ID lịch phỏng vấn" }

    const res = await getData(tableName, { token }, foreignKey, false)

    if (res.success && res.data?.length) {
        return { success: true, data: res.data }
    }

    return { success: false, message: res.message || "Không tìm thấy lịch phỏng vấn" }
}

/**
 * Thêm lịch phỏng vấn
 */
export async function addSchedule(data) {
    return await addData(tableName, data, false)
}

/**
 * Cập nhật thông tin lịch phỏng vấn
 */
export async function updateSchedule(newData, keys = ["id"]) {
    return await updateData(tableName, newData, keys)
}

/**
 * Cập nhật trạng thái lịch phỏng vấn
 */
export async function updateScheduleStatus(id, status) {
    if (!id) return { success: false, message: "Thiếu ID lịch phỏng vấn" }
    return await updateData(tableName, { id, status }, ["id"])
}

/**
 * Xóa lịch phỏng vấn
 */
export async function deleteSchedule(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa lịch phỏng vấn?")
    if (!isConfirmed) return {}
    return await deleteData(tableName, conditions)
}

export default {
    getSchedule,
    getScheduleById,
    getScheduleByToken,
    addSchedule,
    updateSchedule,
    updateScheduleStatus,
    deleteSchedule,
}

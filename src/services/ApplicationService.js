const tableName = "Application"
const foreignKey = ["Application_jobId_fkey"]
import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

/**
 * Lấy danh sách hồ sơ ứng tuyển
 */
export async function getApplication(conditions = {}) {
    // Liên kết với bảng Job qua khóa ngoại Application_jobId_fkey
    return await getData(tableName, conditions, ["Application_jobId_fkey"])
}

export async function getApplicationInterview(conditions = { status: "INTERVIEW" }) {
    // Liên kết với bảng Job qua khóa ngoại Application_jobId_fkey
    return await getData(tableName, conditions, ["Application_jobId_fkey"])
}

/**
 * Lấy chi tiết hồ sơ ứng tuyển theo ID
 */
export async function getApplicationById(id) {
    if (!id) return { success: false, message: "Thiếu ID hồ sơ ứng tuyển" }

    const res = await getData(tableName, { id }, foreignKey)

    if (res.success && res.data?.length) {
        return { success: true, data: res.data }
    }

    return { success: false, message: res.message || "Không tìm thấy hồ sơ" }
}

/**
 * Thêm hồ sơ ứng tuyển
 */
export async function addApplication(data) {
    return await addData(tableName, data, false)
}

/**
 * Cập nhật thông tin hồ sơ ứng tuyển
 */
export async function updateApplication(newData, keys = ["id"]) {
    return await updateData(tableName, newData, keys)
}

/**
 * Cập nhật trạng thái hồ sơ ứng tuyển
 */
export async function updateApplicationStatus(id, status) {
    if (!id) return { success: false, message: "Thiếu ID hồ sơ ứng tuyển" }
    return await updateData(tableName, { id, status }, ["id"])
}

/**
 * Xóa hồ sơ ứng tuyển
 */
export async function deleteApplication(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa hồ sơ ứng tuyển?")
    if (!isConfirmed) return {}
    return await deleteData(tableName, conditions)
}

export default {
    getApplication,
    getApplicationInterview,
    getApplicationById,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
}

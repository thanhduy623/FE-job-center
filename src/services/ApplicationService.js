const tableName = "Application"
import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

/**
 * Lấy danh sách hồ sơ ứng tuyển
 */
export async function getApplication(conditions = {}) {
    // Liên kết với bảng Job qua khóa ngoại Application_jobId_fkey
    return await getData(tableName, conditions, ["Application_jobId_fkey"])
}

/**
 * Thêm hồ sơ ứng tuyển
 */
export async function addApplication(data) {
    return await addData(tableName, data)
}

/**
 * Cập nhật thông tin hồ sơ ứng tuyển
 */
export async function updateApplication(newData, keys = ["id"]) {
    return await updateData(tableName, newData, keys)
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
    addApplication,
    updateApplication,
    deleteApplication
}

const tableName = "ApplicationCustomFieldValue"
const foreignKey = ["ApplicationCustomFieldValue_applicationId_fkey", "ApplicationCustomFieldValue_jobCustomFieldId_fkey"]
import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

/**
 * Lấy danh sách giá trị custom field của hồ sơ ứng tuyển
 */
export async function getApplicationCustomFieldValue(conditions = {}) {
    return await getData(tableName, conditions, foreignKey, false)
}

/**
 * Lấy tất cả custom field theo ID hồ sơ ứng tuyển
 */
export async function getByApplicationId(applicationId) {
    if (!applicationId) return { success: false, message: "Thiếu applicationId" }

    return await getData(tableName, { applicationId }, foreignKey, false)
}

/**
 * Thêm giá trị custom field cho hồ sơ ứng tuyển
 */
export async function addApplicationCustomFieldValue(data) {
    return await addData(tableName, data)
}

/**
 * Cập nhật giá trị custom field của hồ sơ ứng tuyển
 */
export async function updateApplicationCustomFieldValue(newData, keys = ["id"]) {
    return await updateData(tableName, newData, keys)
}

/**
 * Xóa giá trị custom field của hồ sơ ứng tuyển
 */
export async function deleteApplicationCustomFieldValue(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa giá trị custom field của hồ sơ?")
    if (!isConfirmed) return {}
    return await deleteData(tableName, conditions)
}

export default {
    getApplicationCustomFieldValue,
    getByApplicationId,
    addApplicationCustomFieldValue,
    updateApplicationCustomFieldValue,
    deleteApplicationCustomFieldValue
}

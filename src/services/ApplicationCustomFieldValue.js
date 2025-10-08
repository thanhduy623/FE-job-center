const tableName = "ApplicationCustomFieldValue"
import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

/**
 * Lấy danh sách giá trị custom field của hồ sơ ứng tuyển
 */
export async function getApplicationCustomFieldValue(conditions = {}) {
    // Liên kết với Application và JobCustomField
    return await getData(tableName, conditions, [
        "ApplicationCustomFieldValue_applicationId_fkey",
        "ApplicationCustomFieldValue_jobCustomFieldId_fkey"
    ])
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
    addApplicationCustomFieldValue,
    updateApplicationCustomFieldValue,
    deleteApplicationCustomFieldValue
}

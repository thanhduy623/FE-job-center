const tableName = "JobCustomField"
const primaryKey = ["id"]

import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

/**
 * Lấy danh sách trường tuỳ biến công việc
 */
export async function getJobCustomField(conditions = {}) {
    return await getData(tableName, conditions)
}

/**
 * Thêm mới trường tuỳ biến
 */
export async function addJobCustomField(data) {
    return await addData(tableName, data)
}

/**
 * Cập nhật trường tuỳ biến
 */
export async function updateJobCustomField(data, keys = primaryKey) {
    return await updateData(tableName, data, keys)
}

/**
 * Xóa trường tuỳ biến
 */
export async function deleteJobCustomField(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa trường tuỳ biến công việc?")
    if (!isConfirmed) return {}

    return await deleteData(tableName, conditions)
}

export default {
    getJobCustomField,
    addJobCustomField,
    updateJobCustomField,
    deleteJobCustomField
}

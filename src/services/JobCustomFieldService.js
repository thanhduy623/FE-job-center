const tableName = "JobCustomField";
const foreignKey = []; // bảng JobCustomField không có foreign key để join

import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { EventBus } from "@/utils/eventBus";

/**
 * Lấy danh sách custom field
 * @param {Object} conditions - Điều kiện lọc
 * @returns {Object} { success, message, data }
 */
export async function getJobCustomFieldList(conditions = {}) {
    const res = await getData(tableName, conditions, foreignKey, false);
    if (!res.success) EventBus.showNotify(res.message, "error");
    return res;
}

/**
 * Lấy thông tin chi tiết của một Custom Field
 * @param {String} id - UUID của custom field
 */
export async function getJobCustomFieldById(id) {
    const res = await getData(tableName, { id }, foreignKey, false);
    if (!res.success) EventBus.showNotify(res.message, "error");
    return res;
}

/**
 * Thêm mới custom field
 * @param {Object} data - Dữ liệu custom field
 */
export async function addJobCustomField(data) {
    const res = await addData(tableName, data);
    if (!res.success) EventBus.showNotify(res.message, "error");
    return res;
}

/**
 * Cập nhật custom field
 * @param {Object} data - Dữ liệu cập nhật
 * @param {Array} keys - khóa để xác định record (default: id)
 */
export async function updateJobCustomField(data, keys = ["id"]) {
    const res = await updateData(tableName, data, keys);
    if (!res.success) EventBus.showNotify(res.message, "error");
    return res;
}

/**
 * Xóa custom field
 * ⚠️ Không nên xóa nếu đang được gán cho Job (vì dùng on delete CASCADE)
 */
export async function deleteJobCustomField(conditions) {
    const confirmed = await EventBus.confirm("Xác nhận xóa trường tùy chỉnh?");
    if (!confirmed) return {};

    const res = await deleteData(tableName, conditions);
    if (!res.success) EventBus.showNotify(res.message, "error");
    return res;
}

export default {
    getJobCustomFieldList,
    getJobCustomFieldById,
    addJobCustomField,
    updateJobCustomField,
    deleteJobCustomField
};

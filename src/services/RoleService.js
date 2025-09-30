const tableName = "Role";
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { EventBus } from "@/utils/eventBus";

/**
 * Lấy danh sách vai trò
 * @returns {Object} { success, status, message, data }  
 */
export async function getAllRole() {
    const res = await getData(tableName);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

/**
 * Thêm mới vai trò
 * @param {Object} data - Thông tin vai trò cần thêm
 * @returns {Object} { success, status, message, data }  
 */
export async function addRole(data) {
    const res = await addData(tableName, data);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

/**
 * Cập nhật vai trò
 * @param {Object} data - Thông tin mới của vai trò
 * @param {Object} keys - Điều kiện xác định vai trò cần cập nhật
 * @returns {Object} { success, status, message, data }  
 */
export async function updateRole(data, keys) {
    const res = await updateData(tableName, data, keys);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

/**
 * Xóa bỏ vai trò
 * @param {Object} conditions - Điều kiện để xóa vai trò
 * @returns {Object} { success, status, message, data }  
 */
export async function deleteRole(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa dữ liệu vai trò?");
    if (!isConfirmed) return {};

    const res = await deleteData(tableName, conditions);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

export default {
    getAllRole,
    addRole,
    updateRole,
    deleteRole
};

const tableName = "Department"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { EventBus } from "@/utils/eventBus";

/**
 * Lấy danh sách phòng ban
 * @returns {Object} { success, status, message, data }  
 */
export async function getAllDepartment() {
    const res = await getData(tableName);
    if (!res.success) { EventBus.showNotify(res.message, "error") }
    return res;
}

/**
 * Thêm mới phòng ban
 * @param {Object} data - Thông tin phòng ban cần thêm
 * @returns {Object} { success, status, message, data }  
 */
export async function addDepartment(data) {
    const res = await addData(tableName, data);
    if (!res.success) { EventBus.showNotify(res.message, "error") }
    return res;
}

/**
 * Cập nhật phòng ban
 * @param {Object} data - Thông tin mới của phòng ban
 * @param {Object} keys - Điều kiện xác định phòng ban cần cập nhật
 * @returns {Object} { success, status, message, data }  
 */
export async function updateDepartment(data, keys) {
    const res = await updateData(tableName, data, keys);
    if (!res.success) { EventBus.showNotify(res.message, "error") }
    return res;
}

/**
 * Xóa bỏ phòng ban
 * @param {Object} conditions - Điều kiện để xóa phòng ban
 * @returns {Object} { success, status, message, data }  
 */
export async function deleteDepartment(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa dữ liệu phòng ban?");
    if (!isConfirmed) return {};

    const res = await deleteData(tableName, conditions);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}


export default {
    getAllDepartment,
    addDepartment,
    updateDepartment,
    deleteDepartment
};

const tableName = "Location";
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { EventBus } from "@/utils/eventBus";

/**
 * Lấy danh sách địa điểm
 * @returns {Object} { success, status, message, data }  
 */
export async function getLocation() {
    const res = await getData(tableName, {}, [], false);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

/**
 * Thêm mới địa điểm
 * @param {Object} data - Thông tin địa điểm cần thêm
 * @returns {Object} { success, status, message, data }  
 */
export async function addLocation(data) {
    const res = await addData(tableName, data);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

/**
 * Cập nhật địa điểm
 * @param {Object} data - Thông tin mới của địa điểm
 * @param {Object} keys - Điều kiện xác định địa điểm cần cập nhật
 * @returns {Object} { success, status, message, data }  
 */
export async function updateLocation(data, keys) {
    const res = await updateData(tableName, data, keys);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

/**
 * Xóa bỏ địa điểm
 * @param {Object} conditions - Điều kiện để xóa địa điểm
 * @returns {Object} { success, status, message, data }  
 */
export async function deleteLocation(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa dữ liệu địa điểm?");
    if (!isConfirmed) return {};

    const res = await deleteData(tableName, conditions);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}

export default {
    getLocation,
    addLocation,
    updateLocation,
    deleteLocation
};

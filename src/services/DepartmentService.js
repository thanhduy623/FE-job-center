const tableName = "Department"
import { EventBus } from "@/utils/eventBus";
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";

/**
 * Lấy danh sách phòng ban
 */
export async function getDepartment(conditions = {}) {
    return await getData(tableName, conditions);
}

/**
 * Thêm mới phòng ban
 */
export async function addDepartment(data) {
    return await addData(tableName, data);
}

/**
 * Cập nhật phòng ban
 */
export async function updateDepartment(data, keys) {
    return await updateData(tableName, data, keys);
}

/**
 * Xóa bỏ phòng ban
 */
export async function deleteDepartment(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa dữ liệu phòng ban?");
    if (!isConfirmed) return {};

    return await deleteData(tableName, conditions);
}

export default {
    getDepartment,
    addDepartment,
    updateDepartment,
    deleteDepartment
};

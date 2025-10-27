const tableName = "Job"
const foreignKey = ["Job_departmentId_fkey", "Job_locationId_fkey"];
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { EventBus } from "@/utils/eventBus";

/**
 * Lấy danh sách công việc
 * @returns {Object} { success, status, message, data }  
 */
export async function getJob(conditions = {}) {
    const res = await getData(tableName, conditions, foreignKey, false);
    if (!res.success) { EventBus.showNotify(res.message, "error") }
    return res;
}

/**
 * Thêm mới công việc
 * @param {Object} data - Thông tin công việc cần thêm
 * @returns {Object} { success, status, message, data }  
 */
export async function addJob(data) {
    const res = await addData(tableName, data);
    if (!res.success) { EventBus.showNotify(res.message, "error") }
    return res;
}

/**
 * Cập nhật công việc
 * @param {Object} data - Thông tin mới của công việc
 * @param {Object} keys - Điều kiện xác định công việc cần cập nhật
 * @returns {Object} { success, status, message, data }  
 */
export async function updateJob(data, keys = ["id"]) {
    const res = await updateData("Job", data, keys);
    if (!res.success) EventBus.showNotify(res.message, "error")
    return res;
}


/**
 * Xóa bỏ công việc
 * @param {Object} conditions - Điều kiện để xóa công việc
 * @returns {Object} { success, status, message, data }  
 */
export async function deleteJob(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa dữ liệu công việc?");
    if (!isConfirmed) return {};

    const res = await deleteData(tableName, conditions);
    if (!res.success) { EventBus.showNotify(res.message, "error"); }
    return res;
}


export default {
    getJob,
    addJob,
    updateJob,
    deleteJob
};

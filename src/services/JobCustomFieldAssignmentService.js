const tableName = "JobCustomFieldAssignment";
const foreignKey = ["JobCustomFieldAssignment_customFieldId_fkey"];
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";

/**
 * Lấy danh sách field gán cho một Job (kèm thông tin chi tiết từ JobCustomField)
 */
export async function getJobCustomFields(jobId) {
    return await getData(tableName, { jobId }, foreignKey, false);
}

/**
 * Thêm field cho Job
 */
export async function addJobCustomFieldAssignment(data) {
    return await addData(tableName, data);
}

/**
 * Cập nhật field assignment
 */
export async function updateJobCustomFieldAssignment(newData, keys = ["id"]) {
    return await updateData(tableName, newData, keys);
}

/**
 * Xóa field assignment
 */
export async function deleteJobCustomFieldAssignment(conditions) {
    return await deleteData(tableName, conditions);
}


export default {
    getJobCustomFields,
    addJobCustomFieldAssignment,
    updateJobCustomFieldAssignment,
    deleteJobCustomFieldAssignment
};

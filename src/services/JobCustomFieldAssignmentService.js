const tableName = "JobCustomFieldAssignment";
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { EventBus } from "@/utils/eventBus";

/**
 * Lấy danh sách field gán cho một Job (kèm thông tin chi tiết từ JobCustomField)
 */
export async function getJobCustomFields(jobId) {
    return await getData(
        tableName,
        { jobId },
        ["JobCustomFieldAssignment_customFieldId_fkey"] // join sang JobCustomField
    );
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
    const confirmed = await EventBus.confirm("Xác nhận xóa trường tùy chỉnh khỏi công việc?");
    if (!confirmed) return {};
    return await deleteData(tableName, conditions);
}

export default {
    getJobCustomFields,
    addJobCustomFieldAssignment,
    updateJobCustomFieldAssignment,
    deleteJobCustomFieldAssignment
};

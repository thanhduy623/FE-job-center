import { EventBus } from "@/utils/eventBus";
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";

const tableName = "document_metadata";

/**
 * Lấy danh sách file từ bảng documents
 * @param {Object} conditions - điều kiện filter (optional)
 */
export async function getDocuments(conditions = {}) {
    return await getData(tableName, conditions);
}

/**
 * Thêm mới file metadata vào bảng documents
 * @param {Object} data - { path, name_vi, name_en }
 */
export async function addDocument(data) {
    return await addData(tableName, data, false);
}

/**
 * Cập nhật metadata file trong bảng documents
 * @param {Object} data - { name_vi, name_en }
 * @param {Object} keys - điều kiện xác định record cần update (ví dụ { id })
 */
export async function updateDocument(data, keys) {
    return await updateData(tableName, data, keys);
}

/**
 * Xóa metadata file trong bảng documents
 * @param {Object} conditions - điều kiện xác định record cần xóa (ví dụ { id })
 */
export async function deleteDocument(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa file này?");
    if (!isConfirmed) return { success: false, cancelled: true };

    return await deleteData(tableName, conditions);
}

export default {
    getDocuments,
    addDocument,
    updateDocument,
    deleteDocument
};
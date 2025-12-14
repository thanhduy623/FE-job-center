import { callSupabaseEdge } from '@/utils/supabaseEdge'
import { getData } from "@/utils/supabaseUtils";

const tableName = "document_metadata";
const urlFuncUploadDocs = process.env.VUE_APP_SUPABASE_FUNC_UPLOADDOCUMENT;
const urlFuncDeleteDocs = process.env.VUE_APP_SUPABASE_FUNC_DELETEDOCUMENT;

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
    return await callSupabaseEdge(urlFuncUploadDocs, data);
}


/**
 * Xóa metadata file trong bảng documents
 * @param {Object} conditions - điều kiện xác định record cần xóa (ví dụ { id })
 */
export async function deleteDocument(data) {
    return await callSupabaseEdge(urlFuncDeleteDocs, data);
}

export default {
    getDocuments,
    addDocument,
    deleteDocument
};
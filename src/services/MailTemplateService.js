const tableName = "MailTemplate"
const primaryKey = ["id"];
import { EventBus } from "@/utils/eventBus";
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";

/**
 * Lấy danh sách mẫu mail
 */
export async function getMailTemplate(conditions = {}) {
    return await getData(tableName, conditions, [], false);
}

/**
 * Thêm mới mẫu mail
 */
export async function addMailTemplate(data) {
    return await addData(tableName, data);
}

/**
 * Cập nhật mẫu mail
 */
export async function updateMailTemplate(data, keys = primaryKey) {
    return await updateData(tableName, data, keys);
}

/**
 * Xóa bỏ mẫu mail
 */
export async function deleteMailTemplate(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa dữ liệu mẫu mail?");
    if (!isConfirmed) return {};

    return await deleteData(tableName, conditions);
}

export default {
    getMailTemplate,
    addMailTemplate,
    updateMailTemplate,
    deleteMailTemplate
};

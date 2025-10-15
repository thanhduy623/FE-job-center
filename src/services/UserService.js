const tableName = "User"
const foreignKey = ["User_roleId_fkey", "User_departmentId_fkey"];
import { EventBus } from "@/utils/eventBus"
import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils"

/**
 * Lấy danh sách người dùng
 */
export async function getUser(conditions = {}) {
    return await getData("User", conditions, foreignKey);
}


/**
 * Thêm người dùng
 */
export async function addUser(data) {
    return await addData(tableName, data)
}

/**
 * Cập nhật thông tin người dùng
 */
export async function updateUser(newData, keys = ["id"]) {
    return await updateData(tableName, newData, keys)
}

/**
 * Xóa người dùng
 */
export async function deleteUser(conditions) {
    const isConfirmed = await EventBus.confirm("Xác nhận xóa người dùng?")
    if (!isConfirmed) return {}
    return await deleteData(tableName, conditions)
}

export default {
    getUser,
    addUser,
    updateUser,
    deleteUser
}

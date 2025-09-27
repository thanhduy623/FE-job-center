// import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";
import { getData } from "@/utils/supabaseUtils";

/**
 * Lấy danh sách người dùng
 */
export async function getAllUser() {
    return await getData("User");
}

export default {
    getAllUser
}
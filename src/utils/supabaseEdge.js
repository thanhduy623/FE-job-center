import axios from "axios"
import { EventBus } from './eventBus'
import { getSession } from "@/utils/authSession.js"


/**
 * Hàm gọi Supabase Edge Function, xử lý FormData, xác thực và lỗi logic từ n8n.
 * * @param {string} [method="POST"] Phương thức HTTP để Edge Function gọi đến n8n.
 * @param {string} urlFunc URL của Edge Function (thường là biến môi trường).
 * @param {FormData | object} formData Dữ liệu gửi lên (có thể là FormData hoặc object).
 * @param {string} type Tham số 'type' cho URL params.
 * @param {boolean} [auth=true] Quyết định có gắn Authorization token vào header hay không.
 * @returns {Promise<any>} Dữ liệu trả về từ Edge Function/n8n.
 */
export async function callSupabaseEdge(urlFunc, formData, auth = true) {

    if (!urlFunc) {
        EventBus.showNotify(`Lỗi hệ thống`, 'error');
        throw new Error("Chưa cấu hình URL Edge Function.");
    }

    const headers = {};
    if (auth) {
        const session = getSession("session");
        if (session?.access_token) {
            headers.Authorization = `Bearer ${session.access_token}`;
        }
    }

    try {
        EventBus.showLoading();
        console.log("BEFORE CALL");

        const response = await axios.post(
            urlFunc,
            formData,
            {
                headers,
            }
        );

        // Nếu vào được đây thì HTTP = 2xx
        return response.data;

    } catch (error) {

        const errorData = error.response?.data;
        const errorMessage =
            errorData?.message ||
            error.message ||
            "Lỗi không xác định từ hệ thống.";

        console.error("Lỗi gọi Supabase Edge:", errorMessage);
        EventBus.showNotify("Lỗi khi gọi server!", "error");
        throw new Error(errorMessage);

    } finally {
        EventBus.hideLoading();
    }
}
import axios from "axios"
import { EventBus } from './eventBus'
import { getSession } from "@/utils/authSession.js"

const SUPABASE_FUNC_URL = process.env.VUE_APP_SUPABASE_URL_FUNC
console.log(SUPABASE_FUNC_URL);


export async function callSupabaseEdge(formData, type, method = "POST") {
    if (!SUPABASE_FUNC_URL) {
        EventBus.showNotify(`Lỗi hệ thống`, 'error')
        throw new Error("Chưa cấu hình VUE_APP_SUPABASE_URL_FUNC trong .env")
    }

    const session = getSession("session")

    const headers = {}

    if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`
    }

    try {
        EventBus.showLoading()
        console.log("BEFORE CALL")
        const response = await axios.post(
            SUPABASE_FUNC_URL,
            formData,
            {
                headers,
                params: { type, method }
            }
        )

        console.log(response);


        return response.data
    } catch (error) {
        console.error(
            "Lỗi gọi Supabase Edge Function:",
            error.response?.data || error.message
        )
        throw error
    } finally {
        EventBus.hideLoading()
    }
}

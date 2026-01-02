import { callSupabaseEdge } from '@/utils/supabaseEdge'
import { getData, updateData } from "@/utils/supabaseUtils"


const tableName = "Application"
const foreignKey = ["Application_jobId_fkey"]
const urlFuncMailer = process.env.VUE_APP_SUPABASE_FUNC_MAILER;
const urlFuncUploadCV = process.env.VUE_APP_SUPABASE_FUNC_UPLOADCV;
const urlFuncCallChatbot = process.env.VUE_APP_SUPABASE_FUNC_CHATBOT;
const urlFuncConfirmInterview = process.env.VUE_APP_SUPABASE_FUNC_CONFIRMINTERVIEW;



/**
 * Lấy danh sách hồ sơ ứng tuyển
 */
export async function getApplication(conditions = {}) {
    // Liên kết với bảng Job qua khóa ngoại Application_jobId_fkey
    return await getData(tableName, conditions, ["Application_jobId_fkey"])
}

export async function getApplicationInterview(conditions = { status: "INTERVIEW" }) {
    // Liên kết với bảng Job qua khóa ngoại Application_jobId_fkey
    return await getData(tableName, conditions, ["Application_jobId_fkey"])
}

/**
 * Lấy chi tiết hồ sơ ứng tuyển theo ID
 */
export async function getApplicationById(id) {
    if (!id) return { success: false, message: "Thiếu ID hồ sơ ứng tuyển" }

    const res = await getData(tableName, { id }, foreignKey)

    if (res.success && res.data?.length) {
        return { success: true, data: res.data }
    }

    return { success: false, message: res.message || "Không tìm thấy hồ sơ" }
}

export async function getMyCV(id) {
    if (!id) return { success: false, message: "Thiếu ID hồ sơ ứng tuyển" }

    const res = await getData(tableName, { id }, [], false)

    if (res.success && res.data?.length) {
        return { success: true, data: res.data }
    }

    return { success: false, message: res.message || "Không tìm thấy hồ sơ" }
}

/**
 * Cập nhật trạng thái hồ sơ ứng tuyển
 */
export async function updateApplicationStatus(id, status) {
    if (!id) return { success: false, message: "Thiếu ID hồ sơ ứng tuyển" }
    return await updateData(tableName, { id, status }, ["id"])
}

export async function sendMailer(data) {
    return await callSupabaseEdge(urlFuncMailer, data)
}

export async function confirmMailer(data) {
    return await callSupabaseEdge(urlFuncConfirmInterview, data)
}

export async function uploadCV(data) {
    return await callSupabaseEdge(urlFuncUploadCV, data, false)
}

export async function callChatbot(data) {
    const sessionId = getSessionId()
    const payload = { ...data, sessionId }
    console.log(payload);

    return await callSupabaseEdge(urlFuncCallChatbot, payload, false)
}


function getSessionId() {
    const KEY = 'chatbot_session_id'

    let sessionId = sessionStorage.getItem(KEY)

    if (!sessionId) {
        sessionId = crypto.randomUUID()
        sessionStorage.setItem(KEY, sessionId)
    }

    return sessionId
}


export default {
    getApplication,
    getApplicationInterview,
    getApplicationById,
    updateApplicationStatus,
    sendMailer,
    confirmMailer,
    uploadCV,
    callChatbot,
    getMyCV
}

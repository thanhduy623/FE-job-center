import { supabase } from '@/supabase.js'
import { getSession } from '@/utils/authSession.js'
import { EventBus } from './eventBus'

/**
 * Lấy Supabase client với session hợp lệ
 */
function getSupabaseClient() {
    const session = getSession('session')
    if (!session) throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.')

    supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
    })

    return supabase
}

/**
 * 📤 Upload file lên Supabase Storage
 * @param {File} file - file upload từ input
 * @param {string} bucket - tên bucket (ví dụ "uploads")
 * @param {string} folder - thư mục con (ví dụ "cv" hoặc "avatars")
 * @returns {Promise<{success, message, path, publicUrl}>}
 */
export async function uploadFile(file, bucket, folder = '') {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient()
        const fileName = `${Date.now()}_${file.name}`
        const filePath = folder ? `${folder}/${fileName}` : fileName

        const { error } = await client.storage.from(bucket).upload(filePath, file)
        if (error) throw error

        const { data: publicData } = client.storage.from(bucket).getPublicUrl(filePath)

        res = {
            success: true,
            message: 'Tải file lên thành công',
            path: filePath,
            publicUrl: publicData.publicUrl
        }
    } catch (error) {
        res = {
            success: false,
            message: `Tải file lên thất bại: ${error.message}`,
            path: null,
            publicUrl: null
        }
    } finally {
        EventBus.hideLoading()
        EventBus.showNotify(res.message, res.success ? 'success' : 'error')
    }

    return res
}

/**
 * ✏️ Cập nhật (ghi đè) file — upload lại file cùng đường dẫn cũ
 */
export async function updateFile(bucket, path, newFile) {
    EventBus.showLoading()
    let res
    try {
        const client = getSupabaseClient()
        const { error } = await client.storage.from(bucket).update(path, newFile)
        if (error) throw error

        const { data: publicData } = client.storage.from(bucket).getPublicUrl(path)
        res = {
            success: true,
            message: 'Cập nhật file thành công',
            path,
            publicUrl: publicData.publicUrl
        }
    } catch (error) {
        res = {
            success: false,
            message: `Cập nhật file thất bại: ${error.message}`,
            path: null,
            publicUrl: null
        }
    } finally {
        EventBus.hideLoading()
        EventBus.showNotify(res.message, res.success ? 'success' : 'error')
    }

    return res
}

/**
 * ❌ Xóa file trong bucket
 */
export async function deleteFile(bucket, path) {
    const isConfirmed = await EventBus.confirm('Xác nhận xóa file này?')
    if (!isConfirmed) return {}

    EventBus.showLoading()
    let res
    try {
        const client = getSupabaseClient()
        const { error } = await client.storage.from(bucket).remove([path])
        if (error) throw error

        res = { success: true, message: 'Xóa file thành công', path }
    } catch (error) {
        res = { success: false, message: `Xóa file thất bại: ${error.message}`, path }
    } finally {
        EventBus.hideLoading()
        EventBus.showNotify(res.message, res.success ? 'success' : 'error')
    }

    return res
}

/**
 * 🌐 Lấy đường dẫn công khai của file
 */
export function getPublicUrl(bucket, path) {
    try {
        const client = getSupabaseClient()
        const { data } = client.storage.from(bucket).getPublicUrl(path)
        return data.publicUrl
    } catch (error) {
        console.error('Lấy public URL thất bại:', error.message)
        return null
    }
}

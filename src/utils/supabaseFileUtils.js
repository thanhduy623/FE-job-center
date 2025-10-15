import { getSupabaseClient } from '@/supabase.js'
import { EventBus } from './eventBus'

/**
 * Upload file lên Supabase Storage
 */
export async function uploadFile(file, bucket, fileName, useAuth = true) {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient(useAuth)
        const safeFileName = fileName || `${Date.now()}.${file.name.split('.').pop()}`
        const { error } = await client.storage.from(bucket).upload(safeFileName, file, { upsert: true })
        if (error) throw error

        const { data: publicData } = client.storage.from(bucket).getPublicUrl(safeFileName)

        res = {
            success: true,
            message: 'Tải file lên thành công',
            path: safeFileName,
            publicUrl: publicData.publicUrl
        }
        EventBus.showNotify('Tải file lên thành công', 'success')
    } catch (error) {
        res = {
            success: false,
            message: `Tải file lên thất bại: ${error.message}`,
            path: null,
            publicUrl: null
        }
        EventBus.showNotify('Tải file lên thất bại', 'error')
        console.error(res.message)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

/**
 * Cập nhật / ghi đè file trong bucket
 */
export async function updateFile(bucket, path, file, useAuth = true) {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient(useAuth)
        const { error } = await client.storage.from(bucket).upload(path, file, { upsert: true })
        if (error) throw error

        const { data: publicData } = client.storage.from(bucket).getPublicUrl(path)
        res = {
            success: true,
            message: 'Cập nhật file thành công',
            path,
            publicUrl: publicData.publicUrl
        }
        EventBus.showNotify('Cập nhật file thành công', 'success')
    } catch (error) {
        res = {
            success: false,
            message: `Cập nhật file thất bại: ${error.message}`,
            path: null,
            publicUrl: null
        }
        EventBus.showNotify('Cập nhật file thất bại', 'error')
        console.error(res.message)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

/**
 * Xóa file trong bucket
 */
export async function deleteFile(bucket, path, useAuth = true) {
    // Kiểm tra EventBus.confirm có tồn tại (tránh lỗi trong unit test / SSR)
    if (typeof EventBus.confirm === 'function') {
        const isConfirmed = await EventBus.confirm('Xác nhận xóa file này?')
        if (!isConfirmed) return { success: false, cancelled: true }
    }

    EventBus.showLoading()
    let res
    try {
        const client = getSupabaseClient(useAuth)
        const { error } = await client.storage.from(bucket).remove([path])
        if (error) throw error

        res = { success: true, message: 'Xóa file thành công', path }
        EventBus.showNotify('Xóa file thành công', 'success')
    } catch (error) {
        res = { success: false, message: `Xóa file thất bại: ${error.message}`, path }
        EventBus.showNotify('Xóa file thất bại', 'error')
        console.error(res.message)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

/**
 * 🌐 Lấy public URL của file
 */
export function getPublicUrl(bucket, path, useAuth = true) {
    try {
        const client = getSupabaseClient(useAuth)
        const { data } = client.storage.from(bucket).getPublicUrl(path)
        return data?.publicUrl || null
    } catch (error) {
        console.error('Lấy public URL thất bại:', error.message)
        return null
    }
}

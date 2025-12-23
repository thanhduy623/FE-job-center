import { createClient } from '@supabase/supabase-js'
import { EventBus } from './eventBus'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

/**
 * Upload file lên Supabase Storage bằng Anon key, đảm bảo không bị dính session login
 * @param {File} file
 * @param {string} bucket
 * @param {string} [fileName]
 */
export async function uploadFile(file, bucket, fileName) {
    EventBus.showLoading()
    let res

    try {
        // tạo client public mới, KHÔNG bao giờ dùng client đã login
        const clientPublic = createClient(supabaseUrl, supabaseAnonKey)

        // sanitize tên file
        const ext = file.name.split('.').pop()
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^\w-]/g, '_')
        const safeFileName = fileName || `${Date.now()}-${baseName}.${ext}`

        // upload file
        const { error } = await clientPublic.storage.from(bucket).upload(safeFileName, file, { upsert: true })
        if (error) throw error

        // lấy public URL
        const { data: publicData } = clientPublic.storage.from(bucket).getPublicUrl(safeFileName)

        res = {
            success: true,
            message: 'Tải file lên thành công',
            path: safeFileName,
            publicUrl: publicData.publicUrl
        }
        EventBus.showNotify(res.message, 'success')
    } catch (error) {
        res = {
            success: false,
            message: `Tải file lên thất bại: ${error.message}`,
            path: null,
            publicUrl: null
        }
        EventBus.showNotify(res.message, 'error')
        console.error(res.message)
    } finally {
        EventBus.hideLoading()
    }
    return res
}

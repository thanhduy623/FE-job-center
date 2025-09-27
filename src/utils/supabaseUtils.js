import { supabase } from '@/supabase.js'
import { getSession } from '@/utils/authSession.js'

/**
 * Lấy Supabase client đã set session user
 */
function getSupabaseClient() {
    const session = getSession('session')
    if (!session) throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.')

    supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
    });

    return supabase
}

/**
 * Lấy dữ liệu từ bảng
 */
export async function getData(tableName, conditions = {}, relations = []) {
    try {
        const client = getSupabaseClient()
        let query = client.from(tableName).select(relations.length ? `*, ${relations.join(', ')}` : '*')

        Object.entries(conditions).forEach(([key, value]) => {
            query = query.eq(key, value)
        })

        const { data, error } = await query
        if (error) throw error

        return { success: true, status: 200, message: 'Lấy dữ liệu thành công', data }
    } catch (error) {
        return { success: false, status: 400, message: error.message, data: [] }
    }
}

/**
 * Thêm dữ liệu
 */
export async function addData(tableName, newData) {
    try {
        const client = getSupabaseClient()
        const { data, error } = await client.from(tableName).insert(newData).select()
        if (error) throw error
        return { success: true, status: 200, message: 'Thêm dữ liệu thành công', data }
    } catch (error) {
        return { success: false, status: 400, message: error.message, data: null }
    }
}

/**
 * Cập nhật dữ liệu
 */
export async function updateData(tableName, newData, keys) {
    try {
        const client = getSupabaseClient()
        let query = client.from(tableName).update(newData)
        Object.entries(keys).forEach(([key, value]) => query = query.eq(key, value))
        const { data, error } = await query.select()
        if (error) throw error
        return { success: true, status: 200, message: 'Cập nhật dữ liệu thành công', data }
    } catch (error) {
        return { success: false, status: 400, message: error.message, data: null }
    }
}

/**
 * Xóa dữ liệu
 */
export async function deleteData(tableName, conditions = {}) {
    try {
        const client = getSupabaseClient()
        let query = client.from(tableName).delete()
        Object.entries(conditions).forEach(([key, value]) => query = query.eq(key, value))
        const { data, error } = await query.select()
        if (error) throw error
        return { success: true, status: 200, message: 'Xóa dữ liệu thành công', data }
    } catch (error) {
        return { success: false, status: 400, message: error.message, data: null }
    }
}

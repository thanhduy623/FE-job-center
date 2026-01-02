import { getSupabaseClient } from '@/supabase.js'
import { EventBus } from './eventBus'

/**
 * Lấy dữ liệu từ bảng
 */
export async function getData(tableName, conditions = {}, relations = [], useAuth = true) {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient(useAuth)
        const relationSelect = relations.length ? relations.map(r => `${r}(*)`).join(', ') : ''
        const selectString = relations.length ? `*, ${relationSelect}` : '*'

        let query = client.from(tableName).select(selectString)
        Object.entries(conditions).forEach(([key, value]) => (query = query.eq(key, value)))

        const { data, error } = await query
        if (error) throw error

        res = { success: true, status: 'success', message: `Lấy dữ liệu ${tableName} thành công`, data }
        // EventBus.showNotify(`Lấy dữ liệu thành công`, 'success')
    } catch (error) {
        res = { success: false, status: 'error', message: `Lấy dữ liệu ${tableName} thất bại: ${error.message}`, data: [] }
        EventBus.showNotify(`Lấy dữ liệu thất bại`, 'error')
        console.error(res.message)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

/**
 * Thêm dữ liệu vào bảng
 */
export async function addData(tableName, newData, useAuth = true) {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient(useAuth)
        const { data, error } = await client.from(tableName).insert(newData).select()
        if (error) throw error

        res = { success: true, status: 'success', message: `Thêm dữ liệu vào ${tableName} thành công`, data }
        EventBus.showNotify('Thêm dữ liệu thành công', 'success')
    } catch (error) {
        let message = `Thêm dữ liệu vào ${tableName} thất bại`

        if (error.message?.includes('Schedule overlap')) {
            message = 'Thời gian phỏng vấn bị trùng với lịch đã có tại địa điểm này'
            EventBus.showNotify(message, 'warning')
        } else {
            EventBus.showNotify('Thêm dữ liệu thất bại', 'error')
        }

        res = {
            success: false,
            status: 'error',
            message,
            data: null
        }

        console.error(error)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

/**
 * Cập nhật dữ liệu
 */
export async function updateData(tableName, newData, keys = [], useAuth = true) {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient(useAuth)
        let query = client.from(tableName).update(newData)
        keys.forEach(k => (query = query.eq(k, newData[k])))

        const { data, error } = await query.select()
        if (error) throw error

        res = { success: true, status: 'success', message: `Cập nhật dữ liệu ${tableName} thành công`, data }

        if (!data || data.length === 0) {
            EventBus.showNotify('Không thể cập nhật dữ liệu', 'warning')
            return
        }

        EventBus.showNotify('Cập nhật dữ liệu thành công', 'success')
    } catch (error) {
        let message = `Cập nhật dữ liệu ${tableName} thất bại`

        if (error.message?.includes('Schedule overlap')) {
            message = 'Không thể cập nhật vì lịch phỏng vấn bị trùng thời gian'
            EventBus.showNotify(message, 'warning')
        } else {
            EventBus.showNotify('Cập nhật dữ liệu thất bại', 'error')
        }

        res = {
            success: false,
            status: 'error',
            message,
            data: null
        }

        console.error(error)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

/**
 * Xóa dữ liệu
 */
export async function deleteData(tableName, conditions = {}, useAuth = true) {
    EventBus.showLoading()
    let res

    try {
        const client = getSupabaseClient(useAuth)
        let query = client.from(tableName).delete()
        Object.entries(conditions).forEach(([key, value]) => (query = query.eq(key, value)))

        const { data, error } = await query.select()
        if (error) throw error

        res = { success: true, status: 'success', message: `Xóa dữ liệu ${tableName} thành công`, data }
        EventBus.showNotify('Xóa dữ liệu thành công', 'success')
    } catch (error) {
        res = { success: false, status: 'error', message: `Xóa dữ liệu ${tableName} thất bại: ${error.message}`, data: null }
        EventBus.showNotify('Xóa dữ liệu thất bại', 'error')
        console.error(res.message)
    } finally {
        EventBus.hideLoading()
    }

    return res
}

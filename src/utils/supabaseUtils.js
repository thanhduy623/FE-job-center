import { supabase } from '@/supabase.js'
import { getSession } from '@/utils/authSession.js'
import { EventBus } from './eventBus'

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
    EventBus.showLoading();
    let res;

    try {
        const client = getSupabaseClient();

        // Tạo chuỗi join cho Supabase: relation1(*), relation2(*)
        let relationSelect = relations.length ? relations.map(r => `${r}(*)`).join(', ') : '';
        let selectString = relations.length ? `*, ${relationSelect}` : '*';

        let query = client.from(tableName).select(selectString);

        // Thêm điều kiện
        Object.entries(conditions).forEach(([key, value]) => {
            query = query.eq(key, value);
        });

        const { data, error } = await query;

        if (error) throw error;

        res = {
            success: true,
            status: "success",
            message: `Lấy dữ liệu ${tableName} thành công`,
            data
        };
    } catch (error) {
        res = {
            success: false,
            status: "error",
            message: `Lấy dữ liệu ${tableName} thất bại: ${error.message}`,
            data: []
        };
    } finally {
        EventBus.hideLoading();
        EventBus.showNotify(res.message, res.status);
    }

    return res;
}

/**
 * Thêm dữ liệu
 */
export async function addData(tableName, newData) {
    EventBus.showLoading();
    let res;
    try {
        const client = getSupabaseClient();
        const { data, error } = await client.from(tableName).insert(newData).select();
        if (error) throw error;

        res = { success: true, status: "success", message: `Thêm dữ liệu vào ${tableName} thành công`, data };
    } catch (error) {
        res = { success: false, status: "error", message: `Thêm dữ liệu vào ${tableName} thất bại: ${error.message}`, data: null };
    } finally {
        EventBus.hideLoading();
        EventBus.showNotify(res.message, res.status);
    }
    return res;
}

/**
 * Cập nhật dữ liệu
 */
export async function updateData(tableName, newData, keys) {
    EventBus.showLoading();
    let res;
    try {
        const client = getSupabaseClient();
        let query = client.from(tableName).update(newData);

        keys.forEach((k) => {
            query = query.eq(k, newData[k]); // đúng key => đúng value
        });

        const { data, error } = await query.select();
        if (error) throw error;

        res = { success: true, status: "success", message: `Cập nhật dữ liệu ${tableName} thành công`, data };
    } catch (error) {
        res = { success: false, status: "error", message: `Cập nhật dữ liệu ${tableName} thất bại: ${error.message}`, data: null };
    } finally {
        EventBus.hideLoading();
        EventBus.showNotify(res.message, res.status);
    }
    return res;
}

/**
 * Xóa dữ liệu
 */
export async function deleteData(tableName, conditions = {}) {
    EventBus.showLoading();
    let res;
    try {
        const client = getSupabaseClient();
        let query = client.from(tableName).delete();

        Object.entries(conditions).forEach(([key, value]) => {
            query = query.eq(key, value);
        });

        const { data, error } = await query.select();
        if (error) throw error;

        res = { success: true, status: "success", message: `Xóa dữ liệu ${tableName} thành công`, data };
    } catch (error) {
        res = { success: false, status: "error", message: `Xóa dữ liệu ${tableName} thất bại: ${error.message}`, data: null };
    } finally {
        EventBus.hideLoading();
        EventBus.showNotify(res.message, res.status);
    }
    return res;
}

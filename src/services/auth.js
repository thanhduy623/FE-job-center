// import { getData, addData, updateData, deleteData } from "@/utils/supabaseUtils";

import { supabase } from '@/supabase.js'

/**
 * Đăng nhập user bằng email và password
 * @param {string} us - email của user
 * @param {string} pw - password
 * @returns {Object} {success, status, message, data: user session}
 */
export async function login(us, pw) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: us,
            password: pw
        })

        if (error) {
            return { success: false, status: 400, message: error.message, data: null }
        }

        // data.session chứa token và user info
        return { success: true, status: 200, message: 'Đăng nhập thành công', data: data.session }
    } catch (err) {
        return { success: false, status: 500, message: err.message, data: null }
    }
}



/**
 * Đăng ký user mới
 * @param {string} email - Email user
 * @param {string} password - Mật khẩu
 * @param {Object} extraData - Các trường bổ sung cho bảng User (firstName, lastName, etc.)
 * @returns {Object} {success, status, message, data: user session}
 */
export async function register(email, password, extraData = {}) {
    try {
        // 1. Tạo user trong Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            return { success: false, status: 400, message: authError.message, data: null };
        }

        // authData.user.id là UUID của user trong auth
        const authId = authData.user.id;

        // 2. Tạo record trong bảng User
        const { data: userData, error: userError } = await supabase
            .from('User')
            .insert([
                {
                    id: authId,      // ánh xạ với auth.users.id
                    role: 'staff',   // mặc định role là staff
                    ...extraData     // các trường bổ sung từ frontend
                }
            ])
            .select()
            .single();

        if (userError) {
            return { success: false, status: 400, message: userError.message, data: null };
        }

        return { success: true, status: 200, message: 'Đăng ký thành công', data: userData };
    } catch (err) {
        return { success: false, status: 500, message: err.message, data: null };
    }
}

import { supabase } from '@/supabase.js'
import { EventBus } from "@/utils/eventBus";
import { clearAllSessions } from "@/utils/authSession"
import router from "@/router"

/**
 * Đăng nhập user bằng email và password
 */
export async function login(us, pw) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: us,
            password: pw
        })

        if (error) {
            return { success: false, status: "error", message: error.message, data: null }
        }

        return { success: true, status: "success", message: "Đăng nhập thành công", data: data.session }
    } catch (err) {
        return { success: false, status: "error", message: err.message, data: null }
    }
}

/**
 * Đăng ký user mới
 */
export async function signIn(email, password) {
    try {
        const defaultPassword = process.env.VUE_APP_DEFAULT_PASSWORD;
        const finalPassword = password || defaultPassword

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: finalPassword,
        })

        if (authError) {
            return { success: false, status: "error", message: authError.message, data: null }
        }

        return {
            success: true,
            status: "success",
            message: "Tạo tài khoản auth thành công",
            data: authData.user,
        }
    } catch (err) {
        return { success: false, status: "error", message: err.message, data: null }
    }
}

/**
 * Gửi email reset password cho user
 * Supabase sẽ tự gửi email; redirectTo là trang frontend để user nhập password mới
 */
export async function sendPasswordResetEmail(email) {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password` // trang user nhập password mới
        });

        if (error) {
            EventBus.showNotify(error.message, 'error');
            return { success: false, message: error.message };
        }

        EventBus.showNotify("Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.", 'success');
        return { success: true, message: "Email khôi phục mật khẩu đã gửi", data };
    } catch (err) {
        EventBus.showNotify(err.message, 'error');
        return { success: false, message: err.message };
    }
}

/**
 * User cập nhật mật khẩu mới khi click link reset
 * Lưu ý: Phải lấy access_token từ link Supabase gửi qua email
 */
export async function updatePassword(newPassword) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            EventBus.showNotify(error.message, 'error');
            return { success: false, message: error.message };
        }

        EventBus.showNotify("Cập nhật mật khẩu thành công!", 'success');
        return { success: true, message: "Cập nhật mật khẩu thành công", data };
    } catch (err) {
        EventBus.showNotify(err.message, 'error');
        return { success: false, message: err.message };
    }
}


/**
 * Đăng xuất
 */
export async function logout() {
    try {
        const confirmed = await EventBus.confirm("Bạn có chắc muốn đăng xuất?");
        if (!confirmed) return { success: false, message: "Hủy đăng xuất" };

        await supabase.auth.signOut();
        clearAllSessions();
        EventBus.showNotify("Đăng xuất thành công", "success");
        router.push("/login");

        return { success: true, message: "Đăng xuất thành công" };
    } catch (err) {
        console.error("Lỗi đăng xuất:", err);
        EventBus.showNotify("Lỗi đăng xuất: " + err.message, "error");
        return { success: false, message: err.message };
    }
}
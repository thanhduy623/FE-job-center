import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/utils/authSession.js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

/**
 * Tạo instance Supabase duy nhất dùng toàn app
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Lấy Supabase client, tùy chọn có xác thực hay không
 * @param {boolean} useAuth - Có cần gắn token người dùng không (mặc định: true)
 */
export function getSupabaseClient(useAuth = true) {
    if (!useAuth) return supabase // public client (chỉ dùng Anon Key)

    const session = getSession('session')
    if (!session) throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.')

    supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token
    })

    return supabase
}

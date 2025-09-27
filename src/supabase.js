import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY

// Tạo instance duy nhất dùng toàn bộ app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

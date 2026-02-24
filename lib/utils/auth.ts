import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'

export interface AuthResult {
    user?: any
    error?: string
    status?: number
}

export async function handleAuthError(): Promise<AuthResult> {
    try {
        const supabase = await getSupabaseServerClient()
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser()

        if (error || !user) {
            return {
                error: '未授權訪問',
                status: 401,
            }
        }

        return { user }
    } catch (error) {
        return {
            error: '認證失敗',
            status: 500,
        }
    }
}

// 簡化版本 - 只檢查是否已登入
export async function requireAuth(): Promise<AuthResult> {
    return handleAuthError()
}

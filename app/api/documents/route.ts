import { authOptions } from '@/lib/auth'
import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

async function handleAuthError() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            console.error('認證錯誤:', {
                error: '用戶未登入',
                timestamp: new Date().toISOString(),
            })
            return { error: '未登入', status: 401 }
        }
        return { user: session.user }
    } catch (error) {
        console.error('認證處理錯誤:', {
            error: error instanceof Error ? error.message : '未知錯誤',
            timestamp: new Date().toISOString(),
        })
        return { error: '認證處理失敗', status: 500 }
    }
}

function validateTitle(title: string): { isValid: boolean; error?: string } {
    if (!title) {
        return { isValid: false, error: '標題不能為空' }
    }
    if (title.length > 100) {
        return { isValid: false, error: '標題過長' }
    }
    return { isValid: true }
}

export async function GET() {
    try {
        const supabase = await getSupabaseServerClient()
        const authResult = await handleAuthError()

        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status })
        }

        await supabase.rpc('set_user_id', { user_id: authResult.user.id })

        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('updated_at', { ascending: false })

        if (error) {
            console.error('獲取文件錯誤:', {
                error: error.message,
                userId: authResult.user.id,
                timestamp: new Date().toISOString(),
            })
            return NextResponse.json({ error: '獲取文件失敗' }, { status: 500 })
        }

        return NextResponse.json({ documents: data }, { status: 200 })
    } catch (error) {
        console.error('GET 請求錯誤:', {
            error: error instanceof Error ? error.message : '未知錯誤',
            timestamp: new Date().toISOString(),
        })
        return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await getSupabaseServerClient()
        const authResult = await handleAuthError()

        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status })
        }

        const body = await req.json()
        const title = (body?.title || '未命名文件').trim()

        const titleValidation = validateTitle(title)
        if (!titleValidation.isValid) {
            return NextResponse.json({ error: titleValidation.error }, { status: 400 })
        }

        await supabase.rpc('set_user_id', { user_id: authResult.user.id })

        const { data, error } = await supabase
            .from('documents')
            .insert({
                title,
                owner_id: authResult.user.id,
                content: {},
            })
            .select()
            .single()

        if (error) {
            console.error('創建文件錯誤:', {
                error: error.message,
                userId: authResult.user.id,
                title,
                timestamp: new Date().toISOString(),
            })
            return NextResponse.json({ error: '創建文件失敗' }, { status: 500 })
        }

        return NextResponse.json({ document: data }, { status: 201 })
    } catch (error) {
        console.error('POST 請求錯誤:', {
            error: error instanceof Error ? error.message : '未知錯誤',
            timestamp: new Date().toISOString(),
        })
        return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
    }
}

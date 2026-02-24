import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await getSupabaseServerClient()
    const documentId = (await params).id

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    // 檢查用戶是否有權限查看此文檔的貢獻度
    const { data: document } = await supabase
        .from('documents')
        .select('owner_id, group_id')
        .eq('id', documentId)
        .single()

    if (!document) {
        return NextResponse.json({ error: '文檔不存在' }, { status: 404 })
    }

    // 獲取貢獻度資料，包含用戶資訊
    const { data, error } = await supabase
        .from('contributions')
        .select(
            `
      *,
      users:user_id (
        name,
        email,
        image
      )
    `
        )
        .eq('document_id', documentId)
        .order('words_added', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 格式化資料
    const contributions =
        data?.map((contrib) => ({
            userId: contrib.user_id,
            name: contrib.users?.name || '未知用戶',
            email: contrib.users?.email || '',
            image: contrib.users?.image,
            wordsAdded: contrib.words_added || 0,
            wordsDeleted: contrib.words_deleted || 0,
            editSessions: contrib.edit_sessions || 0,
            totalTimeSpent: contrib.total_time_spent || 0,
            lastContribution: contrib.last_contribution,
        })) || []

    return NextResponse.json({ contributions })
}

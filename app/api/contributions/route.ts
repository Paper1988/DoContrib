import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const supabase = await getSupabaseServerClient()

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    const body = await req.json()
    const { documentId, wordsAdded = 0, wordsDeleted = 0, sessionTime = 0 } = body

    if (!documentId) {
        return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
    }

    // 檢查是否已有記錄
    const { data: existing } = await supabase
        .from('contributions')
        .select('*')
        .eq('document_id', documentId)
        .eq('user_id', user.id)
        .single()

    if (existing) {
        // 更新現有記錄
        const { data, error } = await supabase
            .from('contributions')
            .update({
                words_added: existing.words_added + wordsAdded,
                words_deleted: existing.words_deleted + wordsDeleted,
                edit_sessions: existing.edit_sessions + 1,
                total_time_spent: existing.total_time_spent + sessionTime,
                last_contribution: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('document_id', documentId)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ contribution: data })
    } else {
        // 建立新記錄
        const { data, error } = await supabase
            .from('contributions')
            .insert({
                document_id: documentId,
                user_id: user.id,
                words_added: wordsAdded,
                words_deleted: wordsDeleted,
                edit_sessions: 1,
                total_time_spent: sessionTime,
                last_contribution: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ contribution: data }, { status: 201 })
    }
}

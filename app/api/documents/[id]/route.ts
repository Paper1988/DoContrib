// /app/api/documents/[id]/route.ts

import { getSupabaseServerClient } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

// eslint-disable-next-line no-unused-vars
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await getSupabaseServerClient()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .eq('owner_id', user.id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ document: data }, { status: 200 })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await getSupabaseServerClient()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    const body = await req.json()
    const { title, content } = body

    const { data, error } = await supabase
        .from('documents')
        .update({
            title: title || undefined, // 若沒有標題就保持原狀
            content: content || undefined
        })
        .eq('id', params.id)
        .eq('owner_id', user.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ document: data }, { status: 200 })
}

// eslint-disable-next-line no-unused-vars
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const supabase = await getSupabaseServerClient()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', params.id)
        .eq('owner_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '文件已刪除' }, { status: 200 })
}

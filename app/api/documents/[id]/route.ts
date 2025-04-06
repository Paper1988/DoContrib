// /app/api/documents/[id]/route.ts

import { getSupabaseServerClient } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
    void _req
    const { id } = context.params
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
        .eq('id', id)
        .eq('owner_id', user.id)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ document: data }, { status: 200 })
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params
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
            title: title || undefined,
            content: content || undefined
        })
        .eq('id', id)
        .eq('owner_id', user.id)
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ document: data }, { status: 200 })
}

export async function DELETE(_req: NextRequest, context: { params: { id: string } }) {
    void _req
    const { id } = context.params
    const supabase = await getSupabaseServerClient()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    const { error } = await supabase.from('documents').delete().eq('id', id).eq('owner_id', user.id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: '文件已刪除' }, { status: 200 })
}

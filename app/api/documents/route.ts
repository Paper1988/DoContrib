import { getSupabaseServerClient } from '@/lib/supabaseClient'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
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
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ documents: data }, { status: 200 })
}

export async function POST(req: NextRequest) {
    const supabase = await getSupabaseServerClient()

    const {
        data: { user },
        error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: '未登入' }, { status: 401 })
    }

    const body = await req.json()
    const title = body?.title || '未命名文件'

    const { data, error } = await supabase
        .from('documents')
        .insert({
            title,
            owner_id: user.id,
            content: {}
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ document: data }, { status: 201 })
}

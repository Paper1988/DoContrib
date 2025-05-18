import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    const supabase = await getSupabaseServerClient()

    if (!userId) {
        console.log('Fetching user with userId:', userId)
        return NextResponse.json({ error: '缺少 userId' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, image, bio, metadata')
        .eq('id', userId)
        .limit(1)

    if (error) {
        console.log('Error fetching user:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
        return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
    }

    return NextResponse.json(data[0])
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    const { bio } = await req.json()
    const supabase = await getSupabaseServerClient()

    if (!userId || !bio) {
        return NextResponse.json({ error: '缺少 userId 或 bio' }, { status: 400 })
    }

    const { error } = await supabase.from('users').update({ bio }).eq('id', userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

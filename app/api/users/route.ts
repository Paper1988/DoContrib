import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'

export async function GET(req: NextRequest) {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')?.split(',') || []

    if (ids.length === 0) {
        return NextResponse.json({ error: '缺少用戶 ID' }, { status: 400 })
    }

    // 查詢用戶資料
    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, image, bio')
        .in('id', ids)

    if (error) {
        console.error('Error fetching users:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

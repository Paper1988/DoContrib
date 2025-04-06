import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data, error } = await supabase
        .from('users')
        .select('id, name, email, image, bio')
        .eq('id', userId)
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId
    const { bio } = await req.json()

    if (!userId || !bio) {
        return NextResponse.json({ error: '缺少 userId 或 bio' }, { status: 400 })
    }

    const { error } = await supabase.from('users').update({ bio }).eq('id', userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

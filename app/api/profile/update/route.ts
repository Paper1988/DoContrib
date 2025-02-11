import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, context: { params: { userId: string } }) {
    const { userId } = await context.params
    const { bio } = await req.json()

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { error } = await supabase.from('Users').update({ bio }).eq('id', userId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

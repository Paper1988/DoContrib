import { Liveblocks } from '@liveblocks/node'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { handleAuthError } from '@/lib/auth-utils'
import { NextResponse } from 'next/server'

const liveblocks = new Liveblocks({
	secret: process.env.LIVEBLOCKS_SECRET!,
})

export async function POST(request: Request) {
	const supabase = getSupabaseAdmin()

	const authResult = await handleAuthError()
	if ('error' in authResult) {
		return NextResponse.json({ error: authResult.error }, { status: authResult.status })
	}

	const { data: userData, error: userError } = await supabase
		.from('users')
		.select('id, name, email, image, bio, created_at')
		.eq('id', authResult.user.id)
		.single()

	if (userError || !userData) {
		return new Response('用戶資料獲取失敗', { status: 500 })
	}

	const { room } = await request.json()
	if (!room || typeof room !== 'string') {
		return new Response('缺少房間參數', { status: 400 })
	}

	const user = {
		id: authResult.user.id,
		info: {
			name: userData.name || 'Anonymous',
			email: userData.email!,
			avatar: userData.image!,
		},
	}

	const Session = liveblocks.prepareSession(user.id, {
		userInfo: user.info,
	})

	Session.allow(room, Session.FULL_ACCESS)
	const { body, status } = await Session.authorize()

	return new Response(body, { status })
}

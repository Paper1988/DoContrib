import { handleAuthError } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { Liveblocks } from '@liveblocks/node'
import { NextResponse } from 'next/server'

const liveblocks = new Liveblocks({
	secret: process.env.LIVEBLOCKS_SECRET!,
})

function getUserColor(userId: string) {
	let hash = 0
	for (let i = 0; i < userId.length; i++) {
		hash = userId.charCodeAt(i) + ((hash << 5) - hash)
	}
	const h = Math.abs(hash % 360)

	const l = h > 40 && h < 200 ? 45 : 60

	return `hsl(${h}, 85%, ${l}%)`
}

export async function POST(request: Request) {
	const supabase = getSupabaseAdmin()

	const authResult = await handleAuthError()
	if ('error' in authResult) {
		return NextResponse.json({ error: authResult.error }, { status: authResult.status })
	}

	const { room: rawRoomId } = await request.json()

	const documentId = rawRoomId.replace('doc-', '')

	const [docRes, userRes] = await Promise.all([
		supabase.from('documents').select('project_id').eq('id', documentId).single(),
		supabase.from('users').select('id, name, image').eq('id', authResult.user.id).single(),
	])

	if (docRes.error || !docRes.data) {
		return NextResponse.json({ error: '文件不存在' }, { status: 404 })
	}

	if (userRes.error || !userRes.data) {
		return NextResponse.json({ error: '用戶資料獲取失敗' }, { status: 500 })
	}

	const { data: membership } = await supabase
		.from('project_members')
		.select('id')
		.eq('project_id', docRes.data.project_id)
		.eq('user_id', authResult.user.id)
		.single()

	if (!membership) {
		return NextResponse.json({ error: '你無權限訪問此專案' }, { status: 403 })
	}

	const userColor = getUserColor(authResult.user.id)

	const session = liveblocks.prepareSession(authResult.user.id, {
		userInfo: {
			name: userRes.data.name || '匿名用戶',
			avatar: userRes.data.image || undefined,
			color: userColor,
		},
	})

	session.allow(rawRoomId, session.FULL_ACCESS)
	const { body, status } = await session.authorize()
	return new Response(body, { status })
}

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

	// ⚡️ 核心優化：根據色相人眼感知亮度動態調整 L 值
	// 黃色 (60)、綠色 (120)、青色 (180) 區域視覺亮度最高
	// 為了能讓白色文字 (.collaboration-cursor__label) 在任何顏色上都清晰
	// 我們在亮色區間把亮度調低到 45-50%
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
	// ⚡️ 關鍵修復：去掉 'doc-' 前綴，因為資料庫存的是 UUID
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

	// 🔒 權限檢查：是否為專案成員
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

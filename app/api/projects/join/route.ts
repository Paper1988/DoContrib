import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const user = await requireAuth()
		const body = await req.json()
		const { inviteCode } = body

		if (!inviteCode) {
			return NextResponse.json({ error: '請提供邀請碼' }, { status: 400 })
		}

		const supabase = getSupabaseAdmin()

		// 1. 尋找專案
		const { data: project, error: projectError } = await supabase
			.from('projects')
			.select('id, name')
			.eq('invite_code', inviteCode)
			.single()

		if (projectError || !project) {
			return NextResponse.json({ error: '找不到該專案空間' }, { status: 404 })
		}

		// 2. 檢查是否已經是成員
		const { data: existingMember } = await supabase
			.from('project_members')
			.select('id')
			.eq('project_id', project.id)
			.eq('user_id', user.id)
			.single()

		if (existingMember) {
			return NextResponse.json({ project, message: '你已經是成員了' }, { status: 200 })
		}

		// 3. 加入成員
		const { error: joinError } = await supabase.from('project_members').insert({
			project_id: project.id,
			user_id: user.id,
			role: 'editor', // 預設加入者為編輯者
		})

		if (joinError) {
			console.error('加入專案失敗:', joinError)
			return NextResponse.json({ error: '加入專案失敗' }, { status: 500 })
		}

		return NextResponse.json({ project, message: '成功加入專案' }, { status: 200 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
	}
}

import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ projectId: string }> }
) {
	try {
		const user = await requireAuth()
		const { projectId } = await params
		const supabase = getSupabaseAdmin()

		const { data: member, error: memberError } = await supabase
			.from('project_members')
			.select('role')
			.eq('project_id', projectId)
			.eq('user_id', user.id)
			.single()

		if (memberError || !member) {
			return NextResponse.json({ error: '無權限存取此專案' }, { status: 403 })
		}

		const { data: project, error } = await supabase
			.from('projects')
			.select('id, name, invite_code, owner_id, created_at')
			.eq('id', projectId)
			.single()

		if (error || !project) {
			return NextResponse.json({ error: '專案不存在' }, { status: 404 })
		}

		return NextResponse.json({ project })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

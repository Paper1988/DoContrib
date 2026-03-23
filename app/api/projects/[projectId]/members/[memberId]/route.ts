import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
	try {
		const user = await requireAuth()
		const { projectId, memberId } = await params
		const { role } = await req.json()
		const supabase = getSupabaseAdmin()

		if (!['editor', 'viewer'].includes(role)) {
			return NextResponse.json({ error: '無效的權限角色' }, { status: 400 })
		}

		const { data: requester } = await supabase
			.from('project_members')
			.select('role')
			.eq('project_id', projectId)
			.eq('user_id', user.id)
			.single()

		if (requester?.role !== 'owner') {
			return NextResponse.json({ error: '只有 Owner 可以修改成員權限' }, { status: 403 })
		}

		const { error } = await supabase
			.from('project_members')
			.update({ role })
			.eq('project_id', projectId)
			.eq('user_id', memberId)

		if (error) return NextResponse.json({ error: error.message }, { status: 500 })

		return NextResponse.json({ success: true })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
	try {
		const user = await requireAuth()
		const { projectId, memberId } = await params
		const supabase = getSupabaseAdmin()

		const { data: requester } = await supabase
			.from('project_members')
			.select('role')
			.eq('project_id', projectId)
			.eq('user_id', user.id)
			.single()

		if (requester?.role !== 'owner') {
			return NextResponse.json({ error: '只有 Owner 可以移除成員' }, { status: 403 })
		}

		const { error } = await supabase
			.from('project_members')
			.delete()
			.eq('project_id', projectId)
			.eq('user_id', memberId)

		if (error) return NextResponse.json({ error: error.message }, { status: 500 })

		return NextResponse.json({ success: true })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

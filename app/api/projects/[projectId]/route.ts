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

		const { data: project, error: projectError } = await supabase
			.from('projects')
			.select('id, name, invite_code, owner_id, created_at')
			.eq('id', projectId)
			.single()

		if (projectError || !project) {
			return NextResponse.json({ error: '專案不存在' }, { status: 404 })
		}

		const { data: members, error: membersError } = await supabase
			.from('project_members')
			.select(
				`
                role,
                users (
                id,
                name,
                email,
                image
                )
            `
			)
			.eq('project_id', projectId)

		if (membersError) {
			return NextResponse.json({ error: membersError.message }, { status: 500 })
		}

		const formattedMembers =
			members?.map((m: any) => ({
				id: m.users.id,
				name: m.users.name,
				email: m.users.email,
				image: m.users.image,
				role: m.role,
			})) ?? []

		return NextResponse.json({
			project: {
				...project,
				members: formattedMembers,
			},
		})
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

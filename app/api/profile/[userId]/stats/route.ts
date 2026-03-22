import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	try {
		await requireAuth()
		const { userId } = await params
		const supabase = getSupabaseAdmin()

		const { count: projectCount } = await supabase
			.from('project_members')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', userId)

		const { count: contributionCount } = await supabase
			.from('contributions')
			.select('*', { count: 'exact', head: true })
			.eq('user_id', userId)

		return NextResponse.json({
			projectCount: projectCount ?? 0,
			contributionCount: contributionCount ?? 0,
		})
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

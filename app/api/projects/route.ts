import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { customAlphabet } from 'nanoid'
import { NextRequest, NextResponse } from 'next/server'

const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 8)

export async function POST(req: NextRequest) {
	try {
		const user = await requireAuth()
		const body = await req.json()
		const { name } = body

		if (!name?.trim()) {
			return NextResponse.json({ error: '請輸入專案名稱' }, { status: 400 })
		}

		const supabase = getSupabaseAdmin()
		const invite_code = nanoid()

		const { data: project, error: projectError } = await supabase
			.from('projects')
			.insert({
				name: name.trim(),
				owner_id: user.id,
				invite_code,
			})
			.select()
			.single()

		if (projectError) {
			console.error('建立專案失敗:', projectError)
			return NextResponse.json({ error: projectError.message }, { status: 500 })
		}

		// 自動把建立者加入成員（owner 角色）
		const { error: memberError } = await supabase.from('project_members').insert({
			project_id: project.id,
			user_id: user.id,
			role: 'owner',
		})

		if (memberError) {
			console.error('加入成員失敗:', memberError)
			// 不算致命錯誤，專案已建立，繼續
		}

		return NextResponse.json({ project }, { status: 201 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		console.error('POST /api/projects error:', error)
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

export async function GET() {
	try {
		const user = await requireAuth()
		const supabase = getSupabaseAdmin()

		const { data, error } = await supabase
			.from('project_members')
			.select(
				`
				projects (
					id,
					name,
					invite_code,
					owner_id,
					created_at
				)
			`
			)
			.eq('user_id', user.id)

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		const projects = data?.map((item: any) => item.projects) ?? []
		return NextResponse.json({ projects })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

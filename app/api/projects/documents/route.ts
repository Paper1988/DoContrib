import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		const user = await requireAuth()
		const supabase = getSupabaseAdmin()

		// 獲取 URL 中的 projectId (假設你是透過 query 傳遞，例如 /api/documents?projectId=xxx)
		const { searchParams } = new URL(req.url)
		const projectId = searchParams.get('projectId')

		if (!projectId) {
			return NextResponse.json({ error: '缺少專案 ID' }, { status: 400 })
		}

		const { data: membership, error: memberError } = await supabase
			.from('project_members')
			.select('project_id')
			.eq('project_id', projectId)
			.eq('user_id', user.id)
			.single()

		if (memberError || !membership) {
			return NextResponse.json({ error: '你沒有權限訪問此專案的文件 o(≧v≦)o' }, { status: 403 })
		}

		// 權限通過，抓取該專案下的所有文件
		const { data, error } = await supabase
			.from('documents')
			.select('*')
			.eq('project_id', projectId)
			.order('updated_at', { ascending: false })

		if (error) return NextResponse.json({ error: error.message }, { status: 500 })

		return NextResponse.json({ documents: data }, { status: 200 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const user = await requireAuth()
		const supabase = getSupabaseAdmin()

		const body = await req.json()
		const title = (body?.title || '未命名文件').trim()
		const projectId = body?.projectId

		if (!projectId) return NextResponse.json({ error: '必須指定專案' }, { status: 400 })

		const { data: membership } = await supabase
			.from('project_members')
			.select('project_id')
			.eq('project_id', projectId)
			.eq('user_id', user.id)
			.single()

		if (!membership) return NextResponse.json({ error: '權限不足' }, { status: 403 })

		const { data, error } = await supabase
			.from('documents')
			.insert({
				title,
				owner_id: user.id,
				project_id: projectId,
				content: {},
			})
			.select()
			.single()

		if (error) return NextResponse.json({ error: error.message }, { status: 500 })

		return NextResponse.json({ document: data }, { status: 201 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
	}
}

import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

interface DocumentUpdate {
	title?: string
	content?: string
}

// 取得單一文件
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const user = await requireAuth()

		const { id } = await params
		if (!id) {
			return NextResponse.json({ error: '缺少文件 ID' }, { status: 400 })
		}

		const supabase = getSupabaseAdmin() // 改用 Admin
		const { data, error } = await supabase
			.from('documents')
			.select('*')
			.eq('id', id)
			.eq('owner_id', user.id) // 手動檢查權限
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json({ error: '文件不存在或無權限訪問' }, { status: 404 })
			}
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		return NextResponse.json({ document: data }, { status: 200 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		console.error('GET document error:', error)
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

// 更新文件
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const user = await requireAuth()

		const { id } = await params
		if (!id) {
			return NextResponse.json({ error: '缺少文件 ID' }, { status: 400 })
		}

		const body = await req.json()
		const { title, content }: DocumentUpdate = body

		// 驗證輸入
		if (!title && !content) {
			return NextResponse.json({ error: '至少需要提供 title 或 content' }, { status: 400 })
		}

		const supabase = getSupabaseAdmin() // 改用 Admin
		const updateData: DocumentUpdate & { updated_at?: string } = {}

		if (title !== undefined) updateData.title = title
		if (content !== undefined) updateData.content = content
		updateData.updated_at = new Date().toISOString() // 手動更新時間

		const { data, error } = await supabase
			.from('documents')
			.update(updateData)
			.eq('id', id)
			.eq('owner_id', user.id) // 手動檢查權限
			.select()
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json({ error: '文件不存在或無權限修改' }, { status: 404 })
			}
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		return NextResponse.json({ document: data }, { status: 200 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		console.error('PATCH document error:', error)
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

// 刪除文件
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const user = await requireAuth()

		const { id } = await params
		if (!id) {
			return NextResponse.json({ error: '缺少文件 ID' }, { status: 400 })
		}

		const supabase = getSupabaseAdmin() // 改用 Admin
		const { error } = await supabase.from('documents').delete().eq('id', id).eq('owner_id', user.id) // 手動檢查權限

		if (error) {
			if (error.code === 'PGRST116') {
				return NextResponse.json({ error: '文件不存在或無權限刪除' }, { status: 404 })
			}
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		return NextResponse.json({ message: '文件已刪除' }, { status: 200 })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		console.error('DELETE document error:', error)
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

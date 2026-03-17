import { handleAuthError } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

interface DocumentUpdate {
	title?: string
	content?: string
	settings?: any
}

async function verifyDocumentAccess(supabase: any, documentId: string, userId: string) {
	const { data: doc, error: docError } = await supabase
		.from('documents')
		.select('*')
		.eq('id', documentId)
		.single()

	if (docError || !doc) return { error: '文件不存在', status: 404 }

	if (doc.owner_id === userId) return { document: doc, isOwner: true }

	const { data: membership, error: memError } = await supabase
		.from('project_members')
		.select('role')
		.eq('project_id', doc.project_id)
		.eq('user_id', userId)
		.single()

	if (memError || !membership) return { error: '無權限訪問此文件', status: 403 }

	return { document: doc, isOwner: false, role: membership.role }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const authResult = await handleAuthError()
		if ('error' in authResult)
			return NextResponse.json({ error: authResult.error }, { status: authResult.status })

		const { id } = await params
		const supabase = getSupabaseAdmin()

		const { document, error, status } = await verifyDocumentAccess(supabase, id, authResult.user.id)
		if (error) return NextResponse.json({ error }, { status })

		return NextResponse.json({ document }, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const authResult = await handleAuthError()
		if ('error' in authResult)
			return NextResponse.json({ error: authResult.error }, { status: authResult.status })

		const { id } = await params
		const body = await req.json()
		const { title, content, settings }: DocumentUpdate = body

		const supabase = getSupabaseAdmin()
		const { error: authErr, status } = await verifyDocumentAccess(supabase, id, authResult.user.id)
		if (authErr) return NextResponse.json({ error: authErr }, { status })

		const updateData: any = { updated_at: new Date().toISOString() }
		if (title !== undefined) updateData.title = title
		if (content !== undefined) updateData.content = content
		if (settings !== undefined) updateData.settings = settings

		const { data, error } = await supabase
			.from('documents')
			.update(updateData)
			.eq('id', id)
			.select()
			.single()

		if (error) return NextResponse.json({ error: error.message }, { status: 500 })
		return NextResponse.json({ document: data }, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const authResult = await handleAuthError()
		if ('error' in authResult)
			return NextResponse.json({ error: authResult.error }, { status: authResult.status })

		const { id } = await params
		const supabase = getSupabaseAdmin()

		// 刪除通常建議只有 Owner 或 admin 角色可以執行
		const { document, error, status, isOwner, role } = await verifyDocumentAccess(
			supabase,
			id,
			authResult.user.id
		)
		if (error) return NextResponse.json({ error }, { status })

		if (!isOwner && role !== 'admin') {
			return NextResponse.json({ error: '只有擁有者或管理員能刪除文件' }, { status: 403 })
		}

		const { error: delError } = await supabase.from('documents').delete().eq('id', id)
		if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })

		return NextResponse.json({ message: '文件已刪除' }, { status: 200 })
	} catch (error) {
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

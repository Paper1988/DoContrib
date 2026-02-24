import { requireAuth } from '@/lib/auth-utils'
import { getSupabaseAdmin } from '@/lib/supabase/supabaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	try {
		const { userId } = await params

		if (!userId) {
			return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
		}

		const supabase = getSupabaseAdmin()

		const { data: userData, error: userError } = await supabase
			.from('users')
			.select('id, name, email, image, bio, created_at')
			.eq('id', userId)
			.single()

		if (userError) {
			if (userError.code === 'PGRST116') {
				return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
			}
			return NextResponse.json({ error: userError.message }, { status: 500 })
		}

		const response = {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			image: userData.image,
			bio: userData.bio,
			createdAt: userData.created_at,
			stats: {
				projects: 0,
				groups: 0,
				completedTasks: 0,
			},
		}

		return NextResponse.json(response)
	} catch (error) {
		console.error('GET profile error:', error)
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
	try {
		const user = await requireAuth()

		const { userId } = await params
		const body = await req.json()
		const { bio } = body

		if (!userId) {
			return NextResponse.json({ error: '缺少 userId' }, { status: 400 })
		}

		if (bio === undefined) {
			return NextResponse.json({ error: '缺少 bio 欄位' }, { status: 400 })
		}

		if (user.id !== userId) {
			return NextResponse.json({ error: '未授權：只能編輯自己的個人資料' }, { status: 403 })
		}

		const supabase = getSupabaseAdmin()

		const { data, error } = await supabase
			.from('users')
			.update({ bio })
			.eq('id', userId)
			.select()
			.single()

		if (error) {
			console.error('❌ Supabase 更新錯誤:', error)
			if (error.code === 'PGRST116') {
				return NextResponse.json({ error: '用戶不存在' }, { status: 404 })
			}
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		return NextResponse.json({ success: true, data })
	} catch (error) {
		if (error instanceof Error && error.message === '未登入') {
			return NextResponse.json({ error: '未登入' }, { status: 401 })
		}
		console.error('POST profile error:', error)
		return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
	}
}

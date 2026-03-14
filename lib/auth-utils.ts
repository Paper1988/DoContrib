import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function getUserSession() {
	const session = await getServerSession(authOptions)
	if (!session?.user) {
		return null
	}
	return session.user
}

export async function requireAuth() {
	const user = await getUserSession()
	if (!user) throw new Error('未登入')
	return user
}

export async function handleAuthError() {
	try {
		const user = await getUserSession()
		if (!user) return { error: '未登入', status: 401 }
		return { user }
	} catch (error) {
		console.error('認證處理錯誤:', {
			error: error instanceof Error ? error.message : '未知錯誤',
			timestamp: new Date().toISOString(),
		})
		return { error: '認證處理失敗', status: 500 }
	}
}

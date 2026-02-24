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
	if (!user) {
		throw new Error('未登入')
	}
	return user
}

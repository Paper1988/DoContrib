import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

	// 需要登入的頁面
	const protectedRoutes = ['/user', '/settings', '/documents']

	if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
		if (!token) {
			return NextResponse.redirect(new URL('/login', req.url))
		}
	}

	return NextResponse.next()
}

// 只在這些路徑下運行 middleware
export const config = {
	matcher: ['/user/:path*', '/documents/:path*'],
}

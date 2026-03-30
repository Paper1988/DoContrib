import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function proxy(req: NextRequest) {
	const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! })

	const protectedRoutes = ['/user', '/projects']

	if (protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path))) {
		if (!token) {
			return NextResponse.redirect(new URL('/signIn', req.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/user/:path*', '/projects/:path*'],
}

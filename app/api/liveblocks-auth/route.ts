import { authOptions } from '@/lib/auth'
import { handleAuthError } from '@/lib/utils/auth'
import { Liveblocks } from '@liveblocks/node'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET!,
})

export async function POST(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { room } = await request.json()
    if (!room || typeof room !== 'string') {
        return new Response('缺少房間參數', { status: 400 })
    }

    const authResult = await handleAuthError()
    if ('error' in authResult) {
        return new Response(authResult.error, { status: authResult.status })
    }

    const user = {
        id: (session.user as any).id,
        info: {
            name: session.user.name || 'Anonymous',
            email: session.user.email,
            avatar: session.user.image!,
        },
    }

    const Session = liveblocks.prepareSession(user.id, {
        userInfo: user.info,
    })

    Session.allow(room, Session.FULL_ACCESS)
    const { body, status } = await Session.authorize()

    return new Response(body, { status })
}

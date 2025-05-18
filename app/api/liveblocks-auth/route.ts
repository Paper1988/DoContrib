import { Liveblocks } from '@liveblocks/node'
import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'
import { getServerSession, DefaultUser } from 'next-auth'
import { authOptions } from '@/lib/auth'

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET as string,
})

interface CustomUser extends DefaultUser {
    id: string
    bio: string
    color: string
}

async function getUserSession() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return null
    }
    return session.user
}

export async function POST(request: Request) {
    const user = await getUserSession()
    if (!user) {
        return new Response('未授權', { status: 401 })
    }

    const supabase = await getSupabaseServerClient()
    const groupIds =
        (await supabase.from('groups').select('id').eq('owner_id', user.id)).data?.map(
            (group) => group.id
        ) || []

    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user.id,
            groupIds,
        },
        {
            userInfo: {
                name: user.name!,
                avatar: user.image!,
                color: (user as CustomUser).color,
            },
        }
    )

    return new Response(body, { status })
}

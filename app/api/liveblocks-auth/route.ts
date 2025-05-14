import { Liveblocks } from '@liveblocks/node'
import { getSupabaseServerClient } from '@/lib/supabase/supabaseClient'
import { getServerSession, DefaultUser } from 'next-auth'
import { authOptions } from '@/lib/auth'

const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET!,
})

interface CustomUser extends DefaultUser {
    id: string
    bio: string
    color: string
    metadata: {}
}

async function getUserSession() {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return null
    }
    return session.user
}

export async function POST(request: Request) {
    // Get the current user from your database
    const user = await getUserSession()
    const supabase = await getSupabaseServerClient()
    const groupIds = [
        ...(
            await supabase.from('groups').select('id').eq('owner_id', user!.id)
        ).data?.toLocaleString()!,
    ]

    // Identify the user and return the result
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: user!.id,
            groupIds, // Optional
        },
        {
            userInfo: {
                name: (user! as CustomUser).name!,
                avatar: (user! as CustomUser).image!,
                colors: (user! as CustomUser).color!,
            },
        }
    )

    return new Response(body, { status })
}

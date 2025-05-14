import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'
import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth'
import { Vibrant } from 'node-vibrant/node'
import GoogleProvider from 'next-auth/providers/google'

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CustomUser extends DefaultUser {
    id: string
    bio: string
    color: string
    metadata: {}
}

interface CustomSession extends DefaultSession {
    user: CustomUser
}

const getAvatarColor = async (avatarUrl: string) => {
    const palette = await Vibrant.from(avatarUrl).getPalette()
    const mainColor = palette.Vibrant!.hex // 獲取主要顏色
    return mainColor
}

const handleUserAvatar = async (userId: string) => {
    const user = await supabaseClient
        .from('users')
        .select('id, name, email, image, bio, color, metadata')
        .eq('id', userId)
        .single()
    if (user && user.data) {
        const avatarUrl = user.data.image // 根據你的用戶資料獲取頭像 URL
        const mainColor = await getAvatarColor(avatarUrl)
        user.data.color = mainColor // 更新用戶顏色
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    callbacks: {
        async signIn({ user }) {
            try {
                if (!user.id) {
                    console.error('找不到用戶!')
                    return false
                }

                const { data: existingUser, error: selectError } = await supabaseClient
                    .from('users')
                    .select('id')
                    .eq('email', user.email)
                    .single()

                if (selectError && selectError.code !== 'PGRST116') {
                    console.error('Supabase select error:', selectError)
                    return false
                }

                if (!existingUser) {
                    const { error: insertError } = await supabaseClient.from('users').insert([
                        {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            bio: '',
                            color: handleUserAvatar(user.id), // 這裡可以獲取用戶的顏色
                            metadata: {},
                        },
                    ])

                    if (insertError) {
                        console.error('Supabase insert error:', insertError)
                        return false
                    }
                }

                return true
            } catch (error) {
                console.error('SignIn Error:', error)
                return false
            }
        },

        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },

        async session({ session }) {
            if (session?.user?.email) {
                const { data: userData, error } = await supabaseClient
                    .from('users')
                    .select('id, name, email, image, bio, color, metadata')
                    .eq('email', session.user.email)
                    .single()

                if (error) {
                    console.error('Error fetching user data:', error)
                } else if (userData) {
                    ;(session as CustomSession).user.id = userData.id
                    ;(session as CustomSession).user.image = userData.image
                    ;(session as CustomSession).user.bio = userData.bio
                    ;(session as CustomSession).user.color = userData.color
                    ;(session as CustomSession).user.metadata = userData.metadata
                }
            }

            return session as CustomSession
        },
    },
}

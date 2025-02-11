import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'
import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CustomUser extends DefaultUser {
    id: string
    bio: string
}

interface CustomSession extends DefaultSession {
    user: CustomUser
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    adapter: SupabaseAdapter({
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!
    }),
    callbacks: {
        async signIn({ user }) {
            try {
                if (!user.email) {
                    console.error('找不到電子郵件!')
                    return false
                }

                const { data: existingUser, error: selectError } = await supabaseClient
                    .from('Users')
                    .select('id')
                    .eq('email', user.email)
                    .single()

                if (selectError && selectError.code !== 'PGRST116') {
                    console.error('Supabase select error:', selectError)
                    return false
                }

                if (!existingUser) {
                    const { error: insertError } = await supabaseClient.from('Users').insert([
                        {
                            email: user.email,
                            name: user.name,
                            image: user.image, // 🚀 存入 image
                            bio: '' // 🚀 新用戶的 bio 預設為空
                        }
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
            if (session?.user) {
                const { data: userData, error } = await supabaseClient
                    .from('Users')
                    .select('id, name, email, image, bio') // 🚀 讀取 bio
                    .eq('email', session.user.email)
                    .single()

                if (error) {
                    console.error('Error fetching user data:', error)
                } else if (userData) {
                    ;(session as CustomSession).user.id = userData.id
                    ;(session as CustomSession).user.image = userData.image
                    ;(session as CustomSession).user.bio = userData.bio // 🚀 新增 bio
                }
            }
            return session
        }
    }
}

import { SupabaseAdapter } from '@next-auth/supabase-adapter'
import { createClient } from '@supabase/supabase-js'
import { NextAuthOptions, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CustomUser {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
}

interface CustomSession extends Session {
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
                    console.error('No email found')
                    return false
                }

                // 使用正確的 `Users` 表名稱（大小寫要一致）
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
                    // 如果使用者不存在，則插入新用戶
                    const { error: insertError } = await supabaseClient.from('Users').insert([
                        {
                            email: user.email,
                            name: user.name,
                            image: user.image
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

        async session({ session, token }) {
            if (session?.user) {
                ;(session as CustomSession).user.id = token.sub || ''
            }
            return session
        },

        async jwt({ token, user }) {
            // 確保 `sub` 被加入到 token
            if (user?.id) {
                token.sub = user.id
            }
            return token
        }
    }
}

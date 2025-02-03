import { createClient } from '@supabase/supabase-js'
import NextAuth, { NextAuthOptions, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                // 檢查資料庫是否已有該用戶
                const { data: existingUser } = await supabase
                    .from('Users')
                    .select('*')
                    .eq('email', user.email)
                    .single()

                if (!existingUser) {
                    // 如果使用者不存在，則插入新用戶
                    const { error: insertError } = await supabase.from('users').insert([
                        {
                            id: user.id, // Google UID
                            email: user.email,
                            name: user.name,
                            image: user.image
                        }
                    ])
                    if (insertError) throw insertError
                }
                return true
            } catch (error) {
                console.error('SignIn Error:', error)
                return false
            }
        },
        async session({ session, token }) {
            if (session?.user) {
                ;(session as CustomSession).user.id = token.sub
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

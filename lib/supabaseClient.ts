import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getSupabaseServerClient() {
    return createServerComponentClient({ cookies })
}

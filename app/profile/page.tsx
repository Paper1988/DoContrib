'use client'

import Loading from '@/components/loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfileRedirect() {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if ((session?.user as { id?: string })?.id) {
            router.replace(`/profile/${(session?.user as { id?: string })?.id}`)
        }
    }, [session, router])

    return <Loading />
}

'use client'

import Loading from '@/components/loading'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfileRedirect() {
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.user?.id) {
            router.replace(`/user/${session?.user?.id}`)
        }
    }, [session, router])

    return <Loading />
}

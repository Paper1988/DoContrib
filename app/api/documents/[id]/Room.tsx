'use client'

import { ReactNode } from 'react'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import Loading from '@/components/loading'

async function fetchUsers(userIds: string[]) {
    if (userIds.length === 0) {
        return []
    }

    try {
        const response = await fetch(`/api/users?ids=${userIds.join(',')}`)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }

        const users = await response.json()
        return users
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

export function Room({ children, params }: { children: ReactNode; params: { docId: string } }) {
    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                const users = await fetchUsers(userIds)
                return users // 返回用戶資料
            }}
        >
            <RoomProvider id={`doc-${params.docId}`} initialPresence={{ cursor: null }}>
                <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

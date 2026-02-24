'use client'

import Loading from '@/components/loading'
import { ClientSideSuspense, LiveblocksProvider, RoomProvider } from '@liveblocks/react/suspense'
import { ReactNode, useCallback, useEffect, useState } from 'react'

interface User {
    id: string
    name: string
    email?: string
    image?: string
}

async function fetchUsers(userIds: string[]): Promise<User[]> {
    if (userIds.length === 0) {
        return []
    }
    try {
        const response = await fetch(`/api/users?ids=${userIds.join(',')}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const users = await response.json()
        return Array.isArray(users) ? users : []
    } catch (error) {
        console.error('Error fetching users:', error)
        return []
    }
}

async function fetchAllUsers(): Promise<User[]> {
    try {
        const response = await fetch('/api/users')
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const users = await response.json()
        return Array.isArray(users) ? users : []
    } catch (error) {
        console.error('Error fetching all users:', error)
        return []
    }
}

interface RoomProps {
    children: ReactNode
    params: Promise<{ documentId: string }>
}

export function Room({ children, params }: RoomProps) {
    const [documentId, setDocumentId] = useState<string>('')

    // 解析 params Promise
    useEffect(() => {
        params.then((resolvedParams) => {
            setDocumentId(resolvedParams.documentId)
        })
    }, [params])

    const resolveUsers = useCallback(async ({ userIds }: { userIds: string[] }) => {
        const users = await fetchUsers(userIds)
        return userIds.map((id) => {
            const user = users.find((u) => u.id === id)
            return user
                ? {
                      name: user.name,
                      avatar: user.image,
                  }
                : undefined
        })
    }, [])

    const resolveMentionSuggestions = useCallback(
        async ({ text, roomId }: { text: string; roomId: string }) => {
            try {
                let users = await fetchAllUsers()
                if (text && text.trim()) {
                    const searchText = text.toLowerCase()
                    users = users.filter((user: User) =>
                        user.name?.toLowerCase().includes(searchText)
                    )
                }
                return users.map((user: User) => user.id)
            } catch (error) {
                console.error('Error resolving mention suggestions:', error)
                return []
            }
        },
        []
    )

    // 等待 documentId 解析完成
    if (!documentId) {
        return <Loading />
    }

    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={resolveUsers}
            resolveMentionSuggestions={resolveMentionSuggestions}
        >
            <RoomProvider id={`doc-${documentId}`}>
                <ClientSideSuspense fallback={<Loading />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

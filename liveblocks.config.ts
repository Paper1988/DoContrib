import { createClient, LiveObject } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

type Presence = {
    cursor: { x: number; y: number } | null
    name: string
    color: string
}

export type Storage = {
    doc: LiveObject<{
        content: string
    }>
}

type UserMeta = {
    id: string
    info: {
        name?: string
        avatar?: string
    }
}

type RoomEvent = never

const client = createClient({
    authEndpoint: '/api/liveblocks-auth',
})

export const {
    RoomProvider,
    useRoom,
    useSelf,
    useOthers,
    useUpdateMyPresence,
    useCanRedo,
    useCanUndo,
    useUndo,
    useRedo,
    useStorage,
    useMutation,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client)

declare global {
    interface Liveblocks {
        UserMeta: {
            id: string
            info: {
                name?: string
                avatar?: string
                color?: string
            }
        }
    }
}

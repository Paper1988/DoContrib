import { createClient, LiveObject } from '@liveblocks/client' // ✅ 這邊改對
import { createRoomContext } from '@liveblocks/react'
import { Liveblocks } from '@liveblocks/node'

type Presence = {
    cursor: { x: number; y: number } | null
    name: string
    color: string
}

// 2. 定義 shared storage 型別（可以先空的）
export type Storage = {
    doc: LiveObject<{
        content: string // 或你要儲存的其他資料結構
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
    authEndpoint: '/api/auth/liveblocks-auth',
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

export const liveblocksNode = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET!,
})

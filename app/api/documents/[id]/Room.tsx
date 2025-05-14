'use client'

import { ReactNode } from 'react'
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import Loading from '@/components/loading'
import { v4 as uuidv4 } from 'uuid' // 引入 uuid 庫

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

export function Room({ children }: { children: ReactNode }) {
    return (
        <LiveblocksProvider
            authEndpoint="/api/liveblocks-auth"
            resolveUsers={async ({ userIds }) => {
                console.log(userIds) // 這裡可以用來檢查傳入的 userIds
                // 根據 userIds 返回用戶資料
                return userIds.map((userId) => ({
                    name: userId, // 假設 userId 是用戶的名稱，根據你的實際情況調整
                    color: getRandomColor(),
                    avatar: '', // 預設頭像，根據需要調整
                }))
            }}
        >
            <RoomProvider id={uuidv4()}>
                <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    )
}

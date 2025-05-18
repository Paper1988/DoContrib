'use client'

import { useOthers } from '@/liveblocks.config'
import { useRoom } from '@liveblocks/react'
import Image from 'next/image'

const Room = useRoom()

interface AvatarGroupProps {
    room: typeof Room // 確保這裡有 room 屬性
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ room }) => {
    const others = useOthers()

    return (
        <div className="flex items-center space-x-[-8px]">
            {others.map(({ connectionId, info }: { connectionId: any; info: any }) => {
                if (!info?.name || !info?.picture) return null

                return (
                    <Image
                        key={connectionId}
                        src={info.picture}
                        alt={info.name}
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-black"
                    />
                )
            })}
        </div>
    )
}

export default AvatarGroup

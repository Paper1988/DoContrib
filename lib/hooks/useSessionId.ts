'use client'

import { useSelf } from '@/liveblocks.config'

export function useSessionId(): string | null {
    const self = useSelf()
    return self?.connectionId?.toString() || null
}

import { createClient } from '@liveblocks/client'

export const liveblocks = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!
})

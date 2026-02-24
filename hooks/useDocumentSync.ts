import { supabase } from '@/lib/supabase/supabase'
import { AppUser } from '@/types/user'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'

interface BroadcastPayload {
	content: string
	user_id: string
	user_name: string
	timestamp: string
}

export const useDocumentSync = (
	roomId: string,
	currentUser: AppUser | null | undefined,
	onContentUpdate: (content: string) => void
) => {
	const channelRef = useRef<RealtimeChannel | null>(null)
	const [syncStatus, setSyncStatus] = useState<string>('disconnected')
	const isLocalUpdate = useRef(false)

	useEffect(() => {
		if (!currentUser || !roomId) return

		const channel = supabase.channel(`document:${roomId}`)

		channel
			.on('broadcast', { event: 'content-update' }, ({ payload }) => {
				const data = payload as BroadcastPayload
				// 只處理來自其他用戶的更新
				if (data.user_id !== currentUser.id) {
					isLocalUpdate.current = true
					onContentUpdate(data.content)
					setTimeout(() => {
						isLocalUpdate.current = false
					}, 100)
				}
			})
			.subscribe((status) => {
				setSyncStatus(status)
			})

		channelRef.current = channel

		return () => {
			if (channelRef.current) {
				channelRef.current.unsubscribe()
			}
		}
	}, [roomId, currentUser, onContentUpdate])

	const broadcastUpdate = async (content: string) => {
		if (!channelRef.current || isLocalUpdate.current || !currentUser) return

		await channelRef.current.send({
			type: 'broadcast',
			event: 'content-update',
			payload: {
				content,
				user_id: currentUser.id,
				user_name: currentUser.name || currentUser.email?.split('@')[0] || 'Anonymous',
				timestamp: new Date().toISOString(),
			},
		})
	}

	return { broadcastUpdate, syncStatus, isLocalUpdate }
}

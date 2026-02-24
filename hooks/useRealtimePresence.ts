import { supabase } from '@/lib/supabase/supabase'
import { AppUser } from '@/types/user'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useEffect, useRef, useState } from 'react'

interface UserPresence {
	user_id: string
	user: AppUser
	online_at: string
}

export const useRealtimePresence = (roomId: string, currentUser: AppUser | null | undefined) => {
	const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
	const channelRef = useRef<RealtimeChannel | null>(null)

	useEffect(() => {
		if (!currentUser || !roomId) return

		const channel = supabase.channel(`room:${roomId}`, {
			config: {
				presence: {
					key: currentUser.id,
				},
			},
		})

		channel
			.on('presence', { event: 'sync' }, () => {
				const state = channel.presenceState()
				const users = Object.values(state).flat() as unknown as UserPresence[]
				setOnlineUsers(users)
			})
			.on('presence', { event: 'join' }, ({ newPresences }) => {
				setOnlineUsers((prev) => [...prev, ...(newPresences as unknown as UserPresence[])])
			})
			.on('presence', { event: 'leave' }, ({ leftPresences }) => {
				setOnlineUsers((prev) =>
					prev.filter(
						(u) =>
							!(leftPresences as unknown as UserPresence[]).some((l) => l.user_id === u.user_id)
					)
				)
			})
			.subscribe(async (status) => {
				if (status === 'SUBSCRIBED') {
					await channel.track({
						user_id: currentUser.id,
						user: currentUser,
						online_at: new Date().toISOString(),
					})
				}
			})

		channelRef.current = channel

		return () => {
			if (channelRef.current) {
				channelRef.current.untrack()
				channelRef.current.unsubscribe()
			}
		}
	}, [roomId, currentUser])

	return onlineUsers
}

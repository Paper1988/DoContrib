import { supabase } from '@/lib/supabase/supabase'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const useSupabaseAuth = () => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// 獲取當前用戶
		supabase.auth.getUser().then(({ data: { user } }) => {
			setUser(user)
			setLoading(false)
		})

		// 監聽認證狀態變化
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null)
		})

		return () => subscription.unsubscribe()
	}, [])

	return { user, loading }
}

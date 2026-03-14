import axios from 'axios'
import { supabase } from '@/lib/supabase/supabase'

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
	timeout: 15000,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.request.use(
	async (config) => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (session?.access_token) {
				config.headers.Authorization = `Bearer ${session.access_token}`
			}
		} catch (error) {
			console.error('Axios Auth Interceptor Error:', error)
		}

		return config
	},
	(error) => {
		return Promise.reject(error)
	}
)

api.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		const status = error.response?.status

		if (status === 401 && typeof window !== 'undefined') {
			const currentPath = window.location.pathname + window.location.search
			window.location.href = `/signIn?callbackUrl=${encodeURIComponent(currentPath)}`
		}

		const errorMessage = error.response?.data?.error || '發生未知錯誤'

		return Promise.reject({
			...error,
			message: errorMessage,
		})
	}
)

export default api

import axios from 'axios'

// 建立 axios 實例
const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// 請求攔截器
api.interceptors.request.use(
    (config) => {
        // 可以在這裡加入認證 token
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 回應攔截器
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // 統一錯誤處理
        if (error.response?.status === 401) {
            // 未授權,重導向到登入頁面,並帶上當前頁面的 URL
            const currentPath = window.location.pathname + window.location.search
            window.location.href = `/auth/signIn?callbackUrl=${encodeURIComponent(currentPath)}`
        }
        return Promise.reject(error)
    }
)

export default api

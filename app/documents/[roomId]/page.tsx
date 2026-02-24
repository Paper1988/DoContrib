'use client'

import { CollaborativeEditor } from '@/components/CollaborativeEditor'
import Loading from '@/components/loading'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Room } from './Room'

export default function DocumentPage({ params }: { params: Promise<{ documentId: string }> }) {
    console.log('🚀 DocumentPage 開始渲染')

    const router = useRouter()
    const { data: session, status } = useSession()

    console.log('📊 Session 狀態:', { status, hasUser: !!session?.user })

    const [documentId, setDocumentId] = useState<string>('')
    const [documentData, setDocumentData] = useState({ title: '', content: '', docId: '' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    console.log('📝 State:', { documentId, loading, error })

    // 解析 params
    useEffect(() => {
        console.log('🔧 useEffect [params] 執行')
        params.then((resolvedParams) => {
            console.log('✅ Params 解析完成:', resolvedParams.documentId)
            setDocumentId(resolvedParams.documentId)
        }).catch(err => {
            console.error('❌ Params 解析失敗:', err)
        })
    }, [params])

    // 處理未登入
    useEffect(() => {
        console.log('🔧 useEffect [status] 執行:', status)
        if (status === 'unauthenticated') {
            console.log('🔄 重定向到登入頁')
            router.push('/auth/signIn')
        }
    }, [status, router])

    // 獲取文件
    useEffect(() => {
        console.log('🔧 useEffect [fetchDocument] 執行')

        async function fetchDocument() {
            console.log('🔍 fetchDocument 條件:', {
                status,
                documentId,
                hasSession: !!session?.user
            })

            if (status === 'loading' || !documentId) {
                console.log('⏸️ 等待中... status:', status, 'documentId:', documentId)
                return
            }

            if (!session?.user) {
                console.log('❌ 無 session')
                setLoading(false)
                return
            }

            console.log('📡 開始獲取文件:', documentId)
            setLoading(true)
            setError('')

            try {
                const res = await api.get(`/documents/${documentId}`)
                console.log('✅ 文件獲取成功:', res.data)
                const data = res.data.document
                setDocumentData({
                    title: data.title || '未命名文件',
                    content: data.content || '',
                    docId: data.id,
                })
            } catch (error: any) {
                const errorMessage = error.response?.data?.error || '文件載入失敗'
                console.error('❌ 文件獲取失敗:', error)
                setError(errorMessage)
            } finally {
                console.log('🏁 fetchDocument 完成')
                setLoading(false)
            }
        }

        fetchDocument()
    }, [documentId, session, status])

    console.log('🎨 準備渲染, loading:', loading, 'status:', status)

    // Loading 狀態
    if (status === 'loading' || !documentId) {
        console.log('🔄 顯示 Loading (1)')
        return <Loading />
    }

    // 未登入（等待重定向）
    if (!session?.user) {
        console.log('🔄 顯示 Loading (2) - 無 session')
        return <Loading />
    }

    // 錯誤狀態
    if (error) {
        console.log('❌ 顯示錯誤:', error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <h2 className="text-lg font-semibold mb-2">載入失敗</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/documents')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        返回文件列表
                    </button>
                </div>
            </div>
        )
    }

    // 載入中
    if (loading) {
        console.log('🔄 顯示 Loading (3)')
        return <Loading />
    }

    console.log('✨ 渲染 CollaborativeEditor')
    return (
        <Room params={params}>
            <CollaborativeEditor
                roomId={documentId}
                title={documentData.title}
                content={documentData.content}
            />
        </Room>
    )
}

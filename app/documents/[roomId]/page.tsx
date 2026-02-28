'use client'

import { CollaborativeEditor } from '@/components/CollaborativeEditor'
import Loading from '@/components/loading'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Room } from './Room'

export default function DocumentPage({ params }: { params: Promise<{ documentId: string }> }) {
    const router = useRouter()
    const { data: session, status } = useSession()

    const [documentId, setDocumentId] = useState<string>('')
    const [documentData, setDocumentData] = useState({ title: '', content: '', docId: '' })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>('')

    // 解析 params
    useEffect(() => {
        params.then((resolvedParams) => {
            setDocumentId(resolvedParams.documentId)
        }).catch(err => {
            console.error('❌ Params 解析失敗:', err)
        })
    }, [params])

    // 處理未登入
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signIn')
        }
    }, [status, router])

    // 獲取文件
    useEffect(() => {
        async function fetchDocument() {

            if (status === 'loading' || !documentId) {
                return
            }

            if (!session?.user) {
                setLoading(false)
                return
            }
            setLoading(true)
            setError('')

            try {
                const res = await api.get(`/documents/${documentId}`)
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
                setLoading(false)
            }
        }

        fetchDocument()
    }, [documentId, session, status])

    // Loading 狀態
    if (status === 'loading' || !documentId) {
        return <Loading />
    }

    // 未登入（等待重定向）
    if (!session?.user) {
        return <Loading />
    }

    // 錯誤狀態
    if (error) {
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
        return <Loading />
    }

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

'use client'

import Loading from '@/components/loading'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Room } from '@/app/api/documents/[id]/Room'
import { Editor } from '@/components/Editor'

export default function EditorPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const [documentData, setDocumentData] = useState({ title: '', content: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        async function fetchDocument() {
            if (!session?.user) return

            setLoading(true)
            const res = await fetch(`/api/documents/${id}`)
            const data = await res.json()
            if (res.ok) {
                setDocumentData({
                    title: data.document.title,
                    content: data.document.content || '',
                })
            } else {
                alert(data.error || '文件載入失敗')
            }
            setLoading(false)
        }
        fetchDocument()
    }, [id, session, status, router])

    // 處理標題變更
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentData({ ...documentData, title: e.target.value })
    }

    // 儲存
    const handleSave = async () => {
        if (!session?.user) return

        setSaving(true)
        const res = await fetch(`/api/documents/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: documentData.title,
                content: documentData.content,
            }),
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.error || '儲存失敗')
        } else {
            alert('儲存成功')
        }
        setSaving(false)
    }

    // 刪除
    const handleDelete = async () => {
        if (!session?.user) return

        if (!confirm('確定要刪除這份文件嗎？')) return
        const res = await fetch(`/api/documents/${id}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.error || '刪除失敗')
        } else {
            alert('文件已刪除')
            router.push('/documents')
        }
    }

    if (status === 'loading' || loading) return <Loading />
    if (status === 'unauthenticated') return null

    return (
        <Room>
            <div className="p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">編輯文件</h1>
                <input
                    type="text"
                    className="w-full p-2 mb-4 bg-neutral-800 text-white rounded"
                    value={documentData.title}
                    onChange={handleTitleChange}
                    placeholder="標題"
                />
                <div className="w-full p-2 mb-4 bg-neutral-800 text-white rounded">
                    <Editor
                        initialContent={documentData.content}
                        onContentChange={(content: string) =>
                            setDocumentData({ ...documentData, content })
                        }
                    />
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={handleSave}
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
                        disabled={saving}
                    >
                        {saving ? '儲存中...' : '儲存文件'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        刪除文件
                    </button>
                </div>
            </div>
        </Room>
    )
}

'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditorPage() {
    const { id } = useParams()
    const router = useRouter()
    const [documentData, setDocumentData] = useState({ title: '', content: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchDocument() {
            setLoading(true)
            const res = await fetch(`/api/documents/${id}`)
            const data = await res.json()
            if (res.ok) {
                setDocumentData({
                    title: data.document.title,
                    content: data.document.content || ''
                })
            } else {
                alert(data.error || '文件載入失敗')
            }
            setLoading(false)
        }
        fetchDocument()
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        const res = await fetch(`/api/documents/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: documentData.title,
                content: documentData.content
            })
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.error || '儲存失敗')
        } else {
            alert('儲存成功')
        }
        setSaving(false)
    }

    const handleDelete = async () => {
        if (!confirm('確定要刪除這份文件嗎？')) return
        const res = await fetch(`/api/documents/${id}`, {
            method: 'DELETE'
        })
        const data = await res.json()
        if (!res.ok) {
            alert(data.error || '刪除失敗')
        } else {
            alert('文件已刪除')
            router.push('/documents')
        }
    }

    if (loading) return <p>載入中...</p>

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">編輯文件</h1>
            <input
                type="text"
                className="w-full p-2 mb-4 bg-neutral-800 text-white rounded"
                value={documentData.title}
                onChange={(e) =>
                    setDocumentData({ ...documentData, title: e.target.value })
                }
                placeholder="標題"
            />
            <textarea
                className="w-full h-64 p-2 mb-4 bg-neutral-800 text-white rounded"
                value={documentData.content}
                onChange={(e) =>
                    setDocumentData({ ...documentData, content: e.target.value })
                }
                placeholder="文件內容"
            />
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
    )
}

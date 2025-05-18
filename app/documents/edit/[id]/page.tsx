'use client'

import Loading from '@/components/loading'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Room } from '@/app/api/documents/[id]/Room'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Placeholder from '@tiptap/extension-placeholder'
import { useRoom } from '@liveblocks/react'
import { useSessionId } from '@/lib/hooks/useSessionId' // 取得當前 userId 的自定 hook

import Toolbar from '@/components/editor/Toolbar'
import AvatarGroup from '@/components/editor/AvatarGroup'

export default function EditorPage() {
    const { id } = useParams()
    const router = useRouter()
    const { data: session, status } = useSession()
    const [documentData, setDocumentData] = useState({ title: '', content: '', docId: '' })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const sessionId = useSessionId() // 取得 userId or sessionId

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
                    docId: data.document.id,
                })
            } else {
                alert(data.error || '文件載入失敗')
            }
            setLoading(false)
        }
        fetchDocument()
    }, [id, session, status, router])

    const room = useRoom()
    const editor = useEditor({
        extensions: [
            StarterKit,
            Collaboration.configure({ document: room.get('doc') }),
            CollaborationCursor.configure({
                provider: room,
                user: {
                    name: session?.user?.name || '未知使用者',
                    color: '#ffa3ef',
                },
            }),
            Placeholder.configure({
                placeholder: '輸入 / 來新增區塊...',
            }),
        ],
        autofocus: 'end',
    })

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocumentData({ ...documentData, title: e.target.value })
    }

    const handleSave = async () => {
        if (!session?.user) return
        setSaving(true)
        const res = await fetch(`/api/documents/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: documentData.title,
                content: editor?.getHTML(),
            }),
        })
        const data = await res.json()
        if (!res.ok) alert(data.error || '儲存失敗')
        else alert('儲存成功')
        setSaving(false)
    }

    const handleDelete = async () => {
        if (!session?.user) return
        if (!confirm('確定要刪除這份文件嗎？')) return
        const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
        const data = await res.json()
        if (!res.ok) alert(data.error || '刪除失敗')
        else {
            alert('文件已刪除')
            router.push('/documents')
        }
    }

    if (status === 'loading' || loading) return <Loading />
    if (status === 'unauthenticated') return null

    return (
        <RoomProvider params={{ docId: documentData.docId }}>
            <div className="min-h-screen bg-neutral-900 text-white px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <input
                        type="text"
                        className="bg-transparent border-none text-3xl font-bold outline-none w-full"
                        placeholder="無標題"
                        value={documentData.title}
                        onChange={handleTitleChange}
                    />
                    <AvatarGroup room={room} />
                </div>
                <Toolbar editor={editor} />
                <div className="prose prose-invert max-w-full">
                    <EditorContent editor={editor} className="focus:outline-none" />
                </div>
                <div className="flex space-x-4 mt-8">
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
        </RoomProvider>
    )
}

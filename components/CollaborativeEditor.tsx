'use client'

import { useDocumentSync } from '@/hooks/useDocumentSync'
import { useRealtimePresence } from '@/hooks/useRealtimePresence'
import { useTiptapEditor } from '@/hooks/useTiptapEditor'
import { EditorContent } from '@tiptap/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef } from 'react'
import { MenuBar } from './MenuBar'
import { OnlineUsersList } from './OnlineUsersList'
import { UserAvatar } from './UserAvatar'

interface CollaborativeEditorProps {
    roomId: string
    title: string
    content: string
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ roomId }) => {
    const router = useRouter()
    const { data: session, status } = useSession()
    const currentUser = session?.user

    const onlineUsers = useRealtimePresence(roomId, currentUser)
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // 未登入時重定向
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    // 生成用戶顏色
    const getUserColor = useCallback((userId: string) => {
        const colors = [
            '#3b82f6', '#ec4899', '#10b981', '#f59e0b',
            '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'
        ]
        const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
        return colors[index]
    }, [])

    const userName = currentUser?.name || currentUser?.email?.split('@')[0] || '匿名使用者'
    const userColor = currentUser ? getUserColor(currentUser.id) : '#3b82f6'

    const editor = useTiptapEditor(roomId, userName, userColor)

    const handleRemoteContentUpdate = useCallback((newContent: string) => {
        if (editor && newContent !== editor.getHTML()) {
            editor.commands.setContent(newContent)
        }
    }, [editor])

    const { broadcastUpdate, syncStatus } = useDocumentSync(
        roomId,
        currentUser,
        handleRemoteContentUpdate
    )

    const handleLocalContentChange = useCallback(() => {
        if (!editor) return

        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current)
        }

        updateTimeoutRef.current = setTimeout(() => {
            broadcastUpdate(editor.getHTML())
        }, 300)
    }, [editor, broadcastUpdate])

    useEffect(() => {
        if (!editor) return

        editor.on('update', handleLocalContentChange)

        return () => {
            editor.off('update', handleLocalContentChange)
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current)
            }
        }
    }, [editor, handleLocalContentChange])

    // Loading 狀態
    if (status === 'loading') {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">載入中...</p>
                </div>
            </div>
        )
    }

    // 未登入狀態（在重定向前顯示）
    if (!currentUser) {
        return null
    }

    return (
        <div className="h-screen bg-white flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between max-w-5xl mx-auto">
                    <div>
                        <h1 className="text-xl font-semibold">Collaborative Document</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-gray-500">Room: {roomId}</p>
                            <div className="flex items-center gap-1">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        syncStatus === 'SUBSCRIBED'
                                            ? 'bg-green-500'
                                            : syncStatus === 'CHANNEL_ERROR'
                                            ? 'bg-red-500'
                                            : 'bg-yellow-500'
                                    }`}
                                ></div>
                                <span className="text-xs text-gray-500">
                                    {syncStatus === 'SUBSCRIBED'
                                        ? '已同步'
                                        : syncStatus === 'CHANNEL_ERROR'
                                        ? '連線錯誤'
                                        : '連線中...'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <OnlineUsersList users={onlineUsers} currentUserId={currentUser.id} />
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-2">
                            <UserAvatar user={currentUser!} size="md" />
                            <span className="text-sm text-gray-600 hidden md:block">{userName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            {editor && <MenuBar editor={editor} />}

            {/* Editor */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-5xl mx-auto bg-white shadow-sm my-8 rounded-lg p-8">
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    )
}

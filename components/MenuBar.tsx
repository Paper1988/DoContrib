'use client'

import { Editor } from '@tiptap/react'
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from 'lucide-react'
import React from 'react'

interface MenuBarProps {
    editor: Editor
}

interface ButtonProps {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    children: React.ReactNode
    title: string
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    if (!editor) return null

    const Button = ({ onClick, isActive = false, disabled = false, children, title }: ButtonProps) => (
        <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded transition-colors ${
            isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    )

    return (
        <div className="border-b border-gray-200 bg-white px-4 py-2 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-1 max-w-5xl mx-auto flex-wrap">
                <Button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="粗體 (Ctrl+B)"
                >
                    <Bold size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="斜體 (Ctrl+I)"
                >
                    <Italic size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="刪除線"
                >
                    <Strikethrough size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive('code')}
                    title="行內程式碼"
                >
                    <Code size={18} />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="標題 1"
                >
                    <Heading1 size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="標題 2"
                >
                    <Heading2 size={18} />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="項目符號列表"
                >
                    <List size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="編號列表"
                >
                    <ListOrdered size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="引用區塊"
                >
                    <Quote size={18} />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <Button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="復原 (Ctrl+Z)"
                >
                    <Undo size={18} />
                </Button>

                <Button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="重做 (Ctrl+Y)"
                >
                    <Redo size={18} />
                </Button>
            </div>
        </div>
    )
}

'use client'

import { Editor } from '@tiptap/react'
import { Bold, Italic, Code, Heading1, Heading2, Heading3 } from 'lucide-react'
import { Button } from '@mui/material'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

export default function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null

    return (
        <div className="flex items-center gap-2 border-b border-neutral-700 px-4 py-2 bg-neutral-900">
            <ToggleButtonGroup className="flex gap-1">
                <ToggleButton
                    value="bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-white/10' : ''}
                >
                    <Bold size={16} />
                </ToggleButton>
                <ToggleButton
                    value="italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-white/10' : ''}
                >
                    <Italic size={16} />
                </ToggleButton>
                <ToggleButton
                    value="code"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-white/10' : ''}
                >
                    <Code size={16} />
                </ToggleButton>
            </ToggleButtonGroup>

            <div className="ml-4 flex gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-white/10' : ''}
                >
                    <Heading1 size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-white/10' : ''}
                >
                    <Heading2 size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'bg-white/10' : ''}
                >
                    <Heading3 size={16} />
                </Button>
            </div>
        </div>
    )
}

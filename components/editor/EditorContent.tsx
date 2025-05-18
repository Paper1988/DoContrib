'use client'

import { EditorContent as TiptapEditorContent } from '@tiptap/react'

export default function EditorContent({ editor }: { editor: any }) {
    return (
        <div className="prose prose-invert dark:prose-invert max-w-none p-4">
            <TiptapEditorContent editor={editor} />
        </div>
    )
}

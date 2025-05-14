"use client";

import { useLiveblocksExtension, FloatingToolbar } from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Threads } from "@/components/Threads";
import { useEffect } from "react";

export function Editor({
    initialContent,
    onContentChange,
}: {
    initialContent?: string;
    onContentChange?: (content: string) => void;
}) {
    const liveblocks = useLiveblocksExtension();

    const editor = useEditor({
        extensions: [
            liveblocks,
            StarterKit.configure({
                history: false,
            }),
        ],
        content: initialContent || "",
        onUpdate: ({ editor }) => {
            if (onContentChange) {
                onContentChange(editor.getHTML());
            }
        },
        immediatelyRender: true,
    });

    // 若 initialContent 變動時同步內容
    useEffect(() => {
        if (editor && initialContent !== undefined) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor]);

    return (
        <div>
            <EditorContent editor={editor} className="editor" />
            <Threads editor={editor} />
            <FloatingToolbar editor={editor} />
        </div>
    );
}
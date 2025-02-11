import { loadDocument, saveDocument } from "@/lib/document";
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { WebrtcProvider } from 'y-webrtc'; // 使用 WebRTC 來同步資料
import * as Y from 'yjs';

const documentId = "example-doc"; // 這裡是你的文件 ID
const ydoc = new Y.Doc(); // 建立 Yjs 文件

// 使用 WebRTC Provider 來同步數據
const provider = new WebrtcProvider(documentId, ydoc);

// 每 10 秒自動存檔
setInterval(() => saveDocument(documentId, ydoc), 10000);

// 頁面載入時讀取文件
loadDocument(documentId, ydoc);

export default function TipTapEditor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Collaboration.configure({ document: ydoc }),
            CollaborationCursor.configure({
                provider,
                user: {
                    name: "User " + Math.floor(Math.random() * 1000), // 設定用戶名稱
                    color: `hsl(${Math.random() * 360}, 100%, 70%)`, // 隨機顏色
                },
            }),
        ],
    });

    return (
        <div className="editor-container">
            <EditorContent editor={editor} />
        </div>
    );
}

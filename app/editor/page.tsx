'use client'
import TipTapEditor from "@/components/TipTapEditor";
import { useEffect } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export default function EditorPage() {
    const ydoc = new Y.Doc(); // 建立 Yjs 文檔

    useEffect(() => {
        // 連接 WebSocket（y-websocket 伺服器）
        const wsProvider = new WebsocketProvider("wss://localhost:1234", "doc-room-123", ydoc);

        return () => {
            wsProvider.disconnect();
        };
    }, []);

    return (
        <>
            <TipTapEditor/>
        </>
    );
}
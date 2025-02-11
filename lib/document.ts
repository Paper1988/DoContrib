import { supabase } from '@/lib/supabase'
import * as Y from 'yjs'

export async function saveDocument(documentId: string, ydoc: Y.Doc) {
    const content = JSON.stringify(Y.encodeStateAsUpdate(ydoc)) // 把 Yjs 內容轉成 JSON
    await supabase.from('documents').upsert({ id: documentId, content })
}

export async function loadDocument(documentId: string, ydoc: Y.Doc) {
    const { data } = await supabase
        .from('documents')
        .select('content')
        .eq('id', documentId)
        .single()
    if (data) {
        Y.applyUpdate(ydoc, new Uint8Array(data.content)) // 把 JSON 轉回 Yjs 文檔
    }
}

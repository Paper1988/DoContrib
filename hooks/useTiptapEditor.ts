'use client'

import { useRoom } from '@liveblocks/react/suspense'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import * as Y from 'yjs'

export const useTiptapEditor = (roomId: string, userName: string, userColor: string) => {
	const room = useRoom()
	const [doc] = useState(() => new Y.Doc())
	const [provider, setProvider] = useState<LiveblocksYjsProvider>()

	useEffect(() => {
		const yProvider = new LiveblocksYjsProvider(room, doc)
		setProvider(yProvider)

		return () => {
			yProvider?.destroy()
		}
	}, [room, doc])

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				undoRedo: false, // Yjs 提供 undo/redo
			}),
			Collaboration.configure({
				document: doc,
			}),
			CollaborationCursor.configure({
				provider: provider,
				user: {
					name: userName,
					color: userColor,
				},
			}),
			Placeholder.configure({
				placeholder: '開始輸入內容...',
			}),
		],
		editorProps: {
			attributes: {
				class:
					'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
			},
		},
	})

	return editor
}

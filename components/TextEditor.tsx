'use client'

import { Avatars } from '@/components/Avatars'
import { DocumentSpinner } from '@/primitives/Spinner'
import { FloatingComposer, FloatingThreads, useLiveblocksExtension } from '@liveblocks/react-tiptap'
import { ClientSideSuspense, useThreads } from '@liveblocks/react/suspense'
import Highlight from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import Youtube from '@tiptap/extension-youtube'
import { Placeholder } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { motion } from 'framer-motion'
import { CustomTaskItem } from './CustomTaskItem'
import { StaticToolbar } from './Toolbars'

export function TextEditor() {
	return (
		<ClientSideSuspense fallback={<DocumentSpinner />}>
			<Editor />
		</ClientSideSuspense>
	)
}

export function Editor() {
	const liveblocks = useLiveblocksExtension()

	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					'focus:outline-none min-h-[700px] py-16 px-8 md:px-20 prose prose-blue dark:prose-invert max-w-none',
			},
		},
		extensions: [
			liveblocks,
			StarterKit.configure({
				undoRedo: false,
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Highlight,
			Image,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-blue-500 underline cursor-pointer',
				},
			}),
			Placeholder.configure({
				placeholder: '從這裡開始輸入...',
				emptyEditorClass: 'tiptap-empty',
			}),
			CustomTaskItem,
			TaskList,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
				alignments: ['left', 'center', 'right'],
			}),
			Typography,
			Youtube,
		],
	})

	const { threads } = useThreads()

	return (
		<div className="relative flex flex-col w-full h-screen overflow-hidden">
			<header
				className="sticky top-0 z-50 flex flex-none items-center justify-between px-6 py-3
							  backdrop-blur-md border-b dark:bg-black/40 bg-white/60
							  dark:border-white/10 border-gray-200"
			>
				<StaticToolbar editor={editor} />
				<Avatars />
			</header>
			<main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-transparent custom-scroll">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4 }}
					className="relative w-full max-w-225 mx-auto my-12
							   rounded-3xl border shadow-2xl
							   dark:bg-black/40 bg-white/80
							   dark:border-white/10 border-gray-200 backdrop-blur-sm
								bg"
				>
					<EditorContent editor={editor} />

					<FloatingComposer
						editor={editor}
						className="z-50 shadow-2xl rounded-xl border dark:border-white/10 border-gray-200 dark:bg-gray-900 bg-white"
						style={{ width: 350 }}
					/>
					<FloatingThreads threads={threads} editor={editor} />
				</motion.div>

				{/* 底部裝飾空間 */}
				<div className="h-20" />
			</main>
		</div>
	)
}

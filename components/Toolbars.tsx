'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { ToolbarInlineAdvanced } from './TextInlineAdvanced'
import { ToolbarAlignment } from './ToolbarAlignment'
import { ToolbarBlockSelector } from './ToolbarBlockSelector'
import { ToolbarMedia } from './ToolbarMedia'

type Props = {
	editor: Editor | null
}

const TOOLBAR_STYLING = [
	'flex items-center gap-1 p-1',
	'bg-transparent',
	'transition-all duration-300 ease-out relative z-[60]',
	'whitespace-nowrap shrink-0',

	'[&_button]:!bg-transparent [&_button]:!border-none [&_button]:!shadow-none',
	'[&_button]:flex [&_button]:items-center [&_button]:justify-center',
	'[&_button]:w-9 [&_button]:h-9 [&_button]:rounded-xl',
	'[&_button]:transition-all [&_button]:duration-200',
	'[&_button]:shrink-0',

	'dark:[&_button]:text-gray-500 [&_button]:text-gray-400',
	'dark:hover:[&_button]:text-white hover:[&_button]:text-gray-900',
	'dark:hover:[&_button]:bg-white/5 hover:[&_button]:bg-black/5',

	'dark:[&_button[data-active]]:text-white [&_button[data-active]]:text-blue-600',
	'dark:[&_button[data-active]]:bg-blue-500/15 [&_button[data-active]]:bg-blue-50',
	'[&_button[data-active]]:ring-1',
	'dark:[&_button[data-active]]:ring-blue-500/30 [&_button[data-active]]:ring-blue-200',

	'[&_.blockSelector]:!bg-transparent [&_.blockSelector]:!border-none',
	'dark:[&_.blockSelector]:text-gray-300 [&_.blockSelector]:text-gray-700',
	'[&_.blockSelector]:font-medium [&_.blockSelector]:text-sm',
].join(' ')

const SEPARATOR_STYLING = 'w-px h-4 mx-1 dark:bg-white/8 bg-gray-200 shrink-0'

export function StaticToolbar({ editor }: Props) {
	const [, setUpdate] = useState(0)

	useEffect(() => {
		if (!editor) return
		const handler = () => setUpdate((prev) => prev + 1)
		editor.on('transaction', handler)
		editor.on('selectionUpdate', handler)
		return () => {
			editor.off('transaction', handler)
			editor.off('selectionUpdate', handler)
		}
	}, [editor])

	if (!editor) return null

	return (
		<div className="w-full flex justify-center no-scrollbar scroll-smooth">
			<Toolbar editor={editor} className={clsx(TOOLBAR_STYLING)}>
				<Toolbar.SectionHistory />
				<div className={SEPARATOR_STYLING} />
				<ToolbarBlockSelector editor={editor} />
				<div className={SEPARATOR_STYLING} />
				<Toolbar.SectionInline />
				<ToolbarInlineAdvanced editor={editor} />
				<div className={SEPARATOR_STYLING} />
				<ToolbarAlignment editor={editor} />
				<div className={SEPARATOR_STYLING} />
				<ToolbarMedia editor={editor} />
			</Toolbar>
		</div>
	)
}

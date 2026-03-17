'use client'

import { FloatingToolbar, Toolbar } from '@liveblocks/react-tiptap'
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

const TOOLBAR_STYLING = `
  flex items-center gap-1.5 p-1.5
  dark:bg-black/40 bg-[#fdfbfa] backdrop-blur-3xl
  rounded-[24px] border dark:border-white/10 border-gray-200
  transition-all duration-500 ease-out relative z-[60]
  whitespace-nowrap shrink-0

  [&_button]:!bg-transparent [&_button]:!border-none [&_button]:!shadow-none
  [&_button]:flex [&_button]:items-center [&_button]:justify-center
  [&_button]:w-10 [&_button]:h-10 [&_button]:rounded-[18px]
  [&_button]:transition-all [&_button]:duration-300
  [&_button]:shrink-0

  dark:[&_button]:text-white/30 [&_button]:text-gray-400
  dark:hover:[&_button]:text-white hover:[&_button]:text-gray-900
  dark:hover:[&_button]:bg-white/10 hover:bg-black/5
  [&_button]:hover:scale-105 [&_button]:hover:-translate-y-0.5

  dark:[&_button[data-active]]:text-white [&_button[data-active]]:text-blue-600
  dark:[&_button[data-active]]:bg-blue-500/20 [&_button[data-active]]:bg-blue-50/80
  dark:[&_button[data-active]]:shadow-[0_0_20px_rgba(59,130,246,0.3)]
  [&_button[data-active]]:ring-1 dark:[&_button[data-active]]:ring-blue-500/50 [&_button[data-active]]:ring-blue-200

  [&_.blockSelector]:!bg-transparent [&_.blockSelector]:!border-none
  dark:[&_.blockSelector]:text-white/80 [&_.blockSelector]:text-gray-700
  [&_.blockSelector]:font-bold [&_.blockSelector]:tracking-tight

  /* 強制提升所有 Radix 浮動層，不論是否在 Portal 內 */
  [data-radix-popper-content-wrapper] { z-index: 9999 !important; }
  [role="tooltip"] { z-index: 9999 !important; }
`

const SEPARATOR_STYLING =
	'w-px h-4 mx-1.5 dark:bg-white/10 bg-gray-900/10 shadow-[0_0_8px_rgba(255,255,255,0.05)] shrink-0'

export function StaticToolbar({ editor }: Props) {
	const [, setUpdate] = useState(0)

	useEffect(() => {
		if (!editor) return

		const updateHandler = () => {
			setUpdate((prev) => prev + 1)
		}

		editor.on('transaction', updateHandler)
		editor.on('selectionUpdate', updateHandler)

		return () => {
			editor.off('transaction', updateHandler)
			editor.off('selectionUpdate', updateHandler)
		}
	}, [editor])

	if (!editor) return null

	return (
		<div className="max-w-full flex lg:justify-center justify-start overflow-x-auto no-scrollbar scroll-smooth">
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

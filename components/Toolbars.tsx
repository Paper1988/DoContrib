'use client'

import clsx from 'clsx'
import { FloatingToolbar, Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { ToolbarMedia } from './ToolbarMedia'
import { ToolbarInlineAdvanced } from './TextInlineAdvanced'
import { ToolbarAlignment } from './ToolbarAlignment'
import { ToolbarBlockSelector } from './ToolbarBlockSelector'
import { useState, useEffect } from 'react'

type Props = {
	editor: Editor | null
}

const TOOLBAR_STYLING = `
  flex items-center gap-1.5 p-1.5
  dark:bg-black/40 bg-white/60 backdrop-blur-3xl
  rounded-[24px] border dark:border-white/10 border-gray-200
  transition-all duration-500 ease-out relative z-[60]

  /* Button 基礎樣式 */
  [&_button]:!bg-transparent [&_button]:!border-none [&_button]:!shadow-none
  [&_button]:flex [&_button]:items-center [&_button]:justify-center
  [&_button]:w-10 [&_button]:h-10 [&_button]:rounded-[18px]
  [&_button]:transition-all [&_button]:duration-300

  /* 預設顏色：更有透明感 */
  dark:[&_button]:text-white/30 [&_button]:text-gray-400
  /* Hover 效果：加入呼吸感與微光 */
  dark:hover:[&_button]:text-white hover:[&_button]:text-gray-900
  dark:hover:[&_button]:bg-white/10 hover:bg-black/5
  [&_button]:hover:scale-105 [&_button]:hover:-translate-y-0.5

  /* Active 狀態：Z-Gen 霓虹發光感 */
  dark:[&_button[data-active]]:text-white [&_button[data-active]]:text-blue-600
  dark:[&_button[data-active]]:bg-blue-500/20 [&_button[data-active]]:bg-blue-50/80
  dark:[&_button[data-active]]:shadow-[0_0_20px_rgba(59,130,246,0.3)]
  [&_button[data-active]]:ring-1 dark:[&_button[data-active]]:ring-blue-500/50 [&_button[data-active]]:ring-blue-200

  /* Block Selector 優化 */
  [&_.blockSelector]:!bg-transparent [&_.blockSelector]:!border-none
  dark:[&_.blockSelector]:text-white/80 [&_.blockSelector]:text-gray-700
  [&_.blockSelector]:font-bold [&_.blockSelector]:tracking-tight
  [&_[data-radix-popper-content-wrapper]]:z-[100]
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
		<div className="w-full py-2 flex justify-center">
			<Toolbar editor={editor} className={TOOLBAR_STYLING}>
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

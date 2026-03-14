'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from '@/icons'

type Props = {
	editor: Editor | null
}

export function ToolbarAlignment({ editor }: Props) {
	return (
		<div className="flex items-center gap-0.5 px-0.5 py-0.5 rounded-xl dark:bg-white/5 bg-gray-50/50">
			<Toolbar.Toggle
				name="靠左對齊"
				icon={<AlignLeftIcon className="w-4 h-4" />}
				active={editor?.isActive({ textAlign: 'left' }) ?? false}
				onClick={() => editor?.chain().focus().setTextAlign('left').run()}
				disabled={!editor?.can().chain().focus().setTextAlign('left').run()}
				className="hover:scale-110 active:scale-90"
			/>

			<Toolbar.Toggle
				name="置中對齊"
				icon={<AlignCenterIcon className="w-4 h-4" />}
				active={editor?.isActive({ textAlign: 'center' }) ?? false}
				onClick={() => editor?.chain().focus().setTextAlign('center').run()}
				disabled={!editor?.can().chain().focus().setTextAlign('center').run()}
				className="hover:scale-110 active:scale-90"
			/>

			<Toolbar.Toggle
				name="靠右對齊"
				icon={<AlignRightIcon className="w-4 h-4" />}
				active={editor?.isActive({ textAlign: 'right' }) ?? false}
				onClick={() => editor?.chain().focus().setTextAlign('right').run()}
				disabled={!editor?.can().chain().focus().setTextAlign('right').run()}
				className="hover:scale-110 active:scale-90"
			/>

			<Toolbar.Toggle
				name="分散對齊"
				icon={<AlignJustifyIcon className="w-4 h-4" />}
				active={editor?.isActive({ textAlign: 'justify' }) ?? false}
				onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
				disabled={!editor?.can().chain().focus().setTextAlign('justify').run()}
				className="hover:scale-110 active:scale-90"
			/>
		</div>
	)
}

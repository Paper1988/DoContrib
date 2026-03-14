'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { useState } from 'react'
import { CrossIcon, HighlightIcon, LinkIcon } from '@/icons'
import { Button } from '@/primitives/Button'
import { Input } from '@/primitives/Input'
import { Popover } from '@/primitives/Popover'

type Props = {
	editor: Editor | null
}

export function ToolbarInlineAdvanced({ editor }: Props) {
	function toggleLink(link: string) {
		editor?.chain().focus().toggleLink({ href: link }).run()
	}

	return (
		<div className="flex items-center gap-0.5">
			<Toolbar.Toggle
				name="螢光筆標記"
				icon={<HighlightIcon style={{ width: '17.5px' }} />}
				active={editor?.isActive('highlight') ?? false}
				onClick={() => editor?.chain().focus().toggleHighlight().run()}
				disabled={!editor?.can().chain().focus().toggleHighlight().run()}
			/>

			<Popover
				content={
					<LinkPopover
						onSubmit={toggleLink}
						onRemoveLink={() => editor?.chain().focus().unsetLink().run()}
						showRemove={!!editor?.getAttributes('link').href}
					/>
				}
			>
				<Toolbar.Toggle
					name="超連結"
					icon={<LinkIcon style={{ width: '17px' }} />}
					active={editor?.isActive('link') ?? false}
					disabled={!editor?.can().chain().focus().setLink({ href: '' }).run()}
				/>
			</Popover>
		</div>
	)
}

type LinkPopoverProps = {
	onSubmit: (url: string) => void
	onRemoveLink: () => void
	showRemove: boolean
}

function LinkPopover({ onSubmit, onRemoveLink, showRemove }: LinkPopoverProps) {
	const [value, setValue] = useState('')

	return (
		<form
			className="flex flex-col gap-3 p-4 w-72 md:w-80 rounded-2xl border backdrop-blur-xl shadow-2xl dark:bg-black/60 bg-white/90 dark:border-white/10 border-gray-200"
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit(value)
			}}
		>
			<label className="text-[10px] font-bold uppercase tracking-widest dark:text-gray-400 text-gray-500">
				為選取的文字加入連結
			</label>

			<div className="flex gap-2">
				<div className="relative flex-1">
					<Input
						autoFocus
						placeholder="https://example.com"
						className="w-full h-10 px-3 pr-10 rounded-lg border dark:bg-white/5 bg-gray-50 dark:border-white/10 border-gray-200 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					{showRemove && (
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault()
								onRemoveLink()
							}}
							className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-red-500/10 text-red-500 transition-color"
							aria-label="移除連結"
						>
							<CrossIcon className="w-4 h-4" />
						</button>
					)}
				</div>
				<Button className="px-3 h-10 rounded-lg font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.95] dark:bg-white dark:text-black bg-gray-900 text-white">
					儲存
				</Button>
			</div>
		</form>
	)
}

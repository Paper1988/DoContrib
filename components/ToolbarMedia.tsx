'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { useState } from 'react'
import { CodeBlockIcon, ImageIcon, YouTubeIcon } from '@/icons'
import { Button } from '@/primitives/Button'
import { Input } from '@/primitives/Input'
import { Popover } from '@/primitives/Popover'

type Props = {
	editor: Editor | null
}

export function ToolbarMedia({ editor }: Props) {
	function addImage(url: string) {
		if (!url.length || !editor) return
		editor.chain().setImage({ src: url }).run()
	}

	function addYouTube(url: string) {
		if (!url.length || !editor) return
		editor.chain().setYoutubeVideo({ src: url }).run()
	}

	return (
		<div className="flex items-center gap-0.5">
			<Toolbar.Toggle
				name="Code block"
				icon={<CodeBlockIcon className="w-4 h-4" />}
				active={editor?.isActive('codeBlock') ?? false}
				onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
				disabled={!editor?.can().chain().focus().toggleCodeBlock().run()}
			/>

			<Popover content={<MediaPopover variant="image" onSubmit={addImage} />}>
				<Toolbar.Toggle
					name="Image"
					icon={<ImageIcon className="w-4 h-4" />}
					active={editor?.isActive('image') ?? false}
					disabled={!editor?.can().chain().setImage({ src: '' }).run()}
				/>
			</Popover>

			<Popover content={<MediaPopover variant="youtube" onSubmit={addYouTube} />}>
				<Toolbar.Toggle
					name="YouTube"
					icon={<YouTubeIcon className="w-4 h-4" />}
					active={editor?.isActive('youtube') ?? false}
					disabled={!editor?.can().chain().setYoutubeVideo({ src: '' }).run()}
				/>
			</Popover>
		</div>
	)
}

function MediaPopover({
	variant,
	onSubmit,
}: {
	variant: 'image' | 'youtube'
	onSubmit: (url: string) => void
}) {
	const [value, setValue] = useState('')

	return (
		<form
			className="flex flex-col gap-5 p-6 w-80 rounded-[28px] border backdrop-blur-3xl shadow-2xl
                       dark:bg-black/60 bg-white/80 dark:border-white/10 border-gray-900/5"
			onSubmit={(e) => {
				e.preventDefault()
				onSubmit(value)
			}}
		>
			<label className="text-[10px] font-bold uppercase tracking-[0.25em] dark:text-white/40 text-gray-400 px-1">
				Insert {variant}
			</label>

			<div className="flex flex-col gap-4">
				<div className="relative group">
					<Input
						autoFocus
						placeholder={variant === 'image' ? '貼上圖片網址...' : '貼上影片網址...'}
						className="w-full bg-transparent border-none px-1 py-2 text-sm focus:ring-0 placeholder:text-gray-500/50 transition-all"
						value={value}
						onChange={(e) => setValue(e.target.value)}
					/>
					{/* 輸入框底部的裝飾線 */}
					<div className="absolute bottom-0 left-0 h-px w-full dark:bg-white/10 bg-gray-900/10 group-focus-within:dark:bg-blue-400 group-focus-within:bg-blue-500 transition-all duration-500" />
				</div>

				<Button
					className="group relative w-full h-11 overflow-hidden rounded-xl font-bold text-xs tracking-widest
                               dark:bg-white bg-gray-900 dark:text-black text-white
                               transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                               hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:hover:shadow-white/10"
				>
					<span className="relative z-10 flex items-center justify-center gap-2">
						{variant === 'image' ? '📸' : '📺'} 確認插入
					</span>
					{/* 按鈕內部的微光動畫 */}
					<div className="absolute inset-0 -translate-x-ful group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
				</Button>
			</div>
		</form>
	)
}

'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { useState, useEffect, FormEvent } from 'react'
import { CrossIcon, HighlightIcon, LinkIcon } from '@/icons'
import { Button } from '@/primitives/Button'
import { Input } from '@/primitives/Input'
import { Popover } from '@/primitives/Popover'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

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
	initialUrl?: string // 新增：傳入當前選取文字的連結
}

export function LinkPopover({
	onSubmit,
	onRemoveLink,
	showRemove,
	initialUrl = '',
}: LinkPopoverProps) {
	const [value, setValue] = useState(initialUrl)

	useEffect(() => {
		setValue(initialUrl)
	}, [initialUrl])

	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault()
		const trimmedValue = value.trim()

		if (trimmedValue) {
			const finalUrl = /^https?:\/\//i.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`
			onSubmit(finalUrl)
		}
	}

	return (
		<motion.form
			initial={{ opacity: 0, y: 8, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			className={clsx(
				'flex flex-col gap-3 p-3 w-72 md:w-80',
				'rounded-[24px] border shadow-2xl z-[70]',
				'backdrop-blur-3xl dark:bg-black/80 bg-white/90',
				'dark:border-white/10 border-gray-100'
			)}
			onSubmit={handleFormSubmit}
		>
			<div className="px-1 flex justify-between items-center">
				<label className="text-[10px] font-black uppercase tracking-[0.2em] dark:text-gray-500 text-gray-400">
					Edit Hyperlink
				</label>

				<AnimatePresence>
					{showRemove && (
						<motion.button
							initial={{ opacity: 0, x: 5 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 5 }}
							type="button"
							onClick={onRemoveLink}
							className="text-[10px] font-bold text-red-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
						>
							<CrossIcon className="w-3 h-3" />
							Remove
						</motion.button>
					)}
				</AnimatePresence>
			</div>

			<div className="flex gap-2 items-center">
				<div className="relative flex-1 group">
					<Input
						autoFocus
						placeholder="貼上連結或輸入 URL..."
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className={clsx(
							'h-10 text-sm rounded-xl transition-all duration-300',
							'dark:bg-white/[0.03] bg-black/[0.03]',
							'border-white/5 focus:border-blue-500/40',
							'placeholder:dark:text-white/20 placeholder:text-black/20'
						)}
					/>

					{value && (
						<button
							type="button"
							onClick={() => setValue('')}
							className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<CrossIcon className="w-3 h-3 opacity-40 hover:opacity-100" />
						</button>
					)}
				</div>

				<Button
					type="submit"
					disabled={!value.trim()}
					className={clsx(
						'h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all',
						'bg-blue-600 text-white hover:bg-blue-500 active:scale-90',
						'shadow-lg shadow-blue-500/20 disabled:opacity-30 disabled:grayscale disabled:pointer-events-none'
					)}
				>
					Apply
				</Button>
			</div>

			<div className="px-1 text-[9px] dark:text-white/20 text-black/20 italic">
				💡 提示：按下 Enter 鍵即可快速儲存
			</div>
		</motion.form>
	)
}

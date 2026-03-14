'use client'

import { TaskItem } from '@tiptap/extension-list'
import {
	NodeViewContent,
	NodeViewProps,
	NodeViewWrapper,
	ReactNodeViewRenderer,
} from '@tiptap/react'
import { Checkbox } from '@/primitives/Checkbox'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

export const CustomTaskItem = TaskItem.extend({
	addNodeView: () => {
		return ReactNodeViewRenderer(TiptapCheckbox)
	},
})

function TiptapCheckbox({ node, updateAttributes }: NodeViewProps) {
	const isChecked = node.attrs.checked

	return (
		<NodeViewWrapper
			className={clsx(
				'flex items-start pl-2 md:pl-8 my-4 group transition-all duration-500 rounded-xl',
				// 你的風格 Hover：整個 Container 稍微變亮，文字更清晰
				'hover:dark:bg-white/2 hover:bg-gray-900/1'
			)}
		>
			<label
				className="flex-none mr-4 md:mr-6 mt-1 cursor-pointer select-none"
				contentEditable={false}
			>
				<motion.div
					whileHover={{ scale: 1.15 }}
					whileTap={{ scale: 0.85 }}
					className="relative flex items-center justify-center"
				>
					{/* 進化 1: 醒目的 Hover 光暈 (平常隱形，Hover 時浮現) */}
					<div className="absolute inset-0 rounded-full dark:bg-white/5 bg-gray-900/3 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

					{/* 進化 2: 已選狀態更亮 (加強 Glow effect) */}
					<AnimatePresence>
						{isChecked && (
							<motion.div
								initial={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1.2 }}
								exit={{ opacity: 0, scale: 0.5 }}
								className="absolute inset-0 dark:bg-white/15 bg-gray-900/10 blur-xl rounded-full pointer-events-none"
							/>
						)}
					</AnimatePresence>

					<Checkbox
						initialValue={false}
						checked={isChecked}
						onValueChange={(checked: boolean) => updateAttributes({ checked })}
						className={`
              w-5 h-5 transition-all duration-500 rounded-md border
              ${
								isChecked
									? 'dark:bg-white bg-gray-900 dark:border-white border-gray-900 shadow-[0_0_25px_rgba(255,255,255,0.2)]'
									: 'dark:bg-white/5 bg-gray-900/5 dark:border-white/10 border-gray-900/10'
							}
              // Hover 時 Checkbox 邊框和背景都更亮一點
              group-hover:dark:border-white/40 group-hover:border-gray-900/30
              group-hover:dark:bg-white/10 group-hover:bg-gray-900/10
            `}
					/>
				</motion.div>
			</label>

			{/* 內容區域 */}
			<motion.div
				animate={{
					opacity: isChecked ? 0.25 : 1, // 已選取降低透明度，但要更「乾淨」
					x: isChecked ? 6 : 0,
					filter: isChecked ? 'blur(0.4px)' : 'blur(0px)',
				}}
				transition={{ type: 'spring', stiffness: 200, damping: 25 }}
				className={`
          flex-auto min-w-0 transition-all duration-700 leading-relaxed
          ${
						isChecked
							? 'line-through dark:text-white/20 text-gray-400 italic'
							: 'dark:text-white/80 text-gray-800 font-medium group-hover:dark:text-white group-hover:text-gray-950 transition-colors'
					}
        `}
			>
				<NodeViewContent className="outline-none focus:outline-none selection:dark:bg-white/10 selection:bg-gray-900/10" />
			</motion.div>
		</NodeViewWrapper>
	)
}

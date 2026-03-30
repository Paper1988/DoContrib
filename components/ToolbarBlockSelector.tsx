'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { CheckboxIcon } from '@/icons'
import clsx from 'clsx'

type Props = {
	editor: Editor | null
}

export function ToolbarBlockSelector({ editor }: Props) {
	return (
		<Toolbar.BlockSelector
			className={clsx(
				'w-32 relative px-3 py-1.5 transition-all duration-200',
				'dark:hover:bg-white/5 hover:bg-black/5',
				'dark:text-gray-300 text-gray-700 font-medium text-sm',
				'flex items-center gap-2 rounded-xl',
				'[&_ul]:absolute [&_ul]:z-100 [&_ul]:top-[calc(100%+8px)]',
				'[&_ul]:rounded-2xl [&_ul]:border [&_ul]:backdrop-blur-3xl',
				'[&_ul]:dark:bg-black/80 [&_ul]:bg-white/90',
				'[&_ul]:dark:border-white/10 [&_ul]:border-gray-200',
				'[&_ul]:shadow-2xl [&_ul]:p-1.5 [&_ul]:mt-2',
				'[&_li]:rounded-lg [&_li]:px-3 [&_li]:py-2 [&_li]:text-xs [&_li]:font-bold',
				'[&_li]:dark:text-gray-400 [&_li]:text-gray-500',
				'[&_li:hover]:dark:bg-white/10 [&_li:hover]:bg-gray-100 [&_li:hover]:dark:text-white',
				'[&_li[data-active=true]]:dark:bg-blue-500/15 [&_li[data-active=true]]:bg-blue-50',
				'[&_li[data-active=true]]:text-blue-500'
			)}
			items={(defaultBlockItems) => [
				...defaultBlockItems,
				{
					name: 'Task list',
					icon: <CheckboxIcon style={{ width: 17 }} />,
					isActive: () => editor?.isActive('taskList') ?? false,
					setActive: () => editor?.chain().focus().toggleTaskList().run(),
				},
			]}
		/>
	)
}

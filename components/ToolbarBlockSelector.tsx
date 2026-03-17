'use client'

import { Toolbar } from '@liveblocks/react-tiptap'
import { Editor } from '@tiptap/react'
import { CheckboxIcon } from '@/icons'

type Props = {
	editor: Editor | null
}

export function ToolbarBlockSelector({ editor }: Props) {
	return (
		<Toolbar.BlockSelector
			className={`w-32.5
                relative px-3 py-1.5 transition-all duration-200
                dark:hover:bg-white/10 hover:bg-black/5
                dark:text-gray-200 text-gray-700 font-medium text-sm
                flex items-center gap-2
                [&_select]:cursor-pointer [&_select]:bg-transparent
                [&_ul]:rounded-xl [&_ul]:border [&_ul]:backdrop-blur-xl
                [&_ul]:dark:bg-black/80 [&_ul]:bg-[#fdfbfa]
                [&_ul]:dark:border-white/10 [&_ul]:border-gray-200
                [&_ul]:shadow-2xl [&_ul]:p-1 [&_ul]:mt-2
                [&_li]:rounded-lg [&_li]:px-3 [&_li]:py-2
                [&_li]:dark:text-gray-300 [&_li]:text-gray-700
                [&_li:hover]:dark:bg-white/10 [&_li:hover]:bg-black/5
                [&_li[data-active=true]]:dark:bg-blue-500/20 [&_li[data-active=true]]:text-blue-500
                rounded-xl border dark:border-white/10 dark:bg-black/60 bg-[#fdfbfa] backdrop-blur-3xl shadow-sm
            `}
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

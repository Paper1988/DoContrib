import api from '@/lib/api'
import { showCustomToast } from '@/lib/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function EditableTitle({ initialTitle, roomId }: { initialTitle: string; roomId: string }) {
	const [isEditing, setIsEditing] = useState(false)
	const [title, setTitle] = useState(initialTitle)
	const [isSaving, setIsSaving] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setTitle(initialTitle)
	}, [initialTitle])

	const handleSave = async () => {
		if (title === initialTitle || !title.trim()) {
			setIsEditing(false)
			return
		}

		setIsSaving(true)
		try {
			await api.patch(`/projects/documents/${roomId}`, {
				title: title.trim(),
			})
			setIsEditing(false)
		} catch (error: any) {
			showCustomToast({
				title: '❌ 更新失敗',
				message: error.response?.data?.error || '無法更新標題',
				duration: 2000,
				type: 'error',
			})
			setTitle(initialTitle)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="relative flex items-center gap-1 group">
			<AnimatePresence mode="wait">
				{!isEditing ? (
					<motion.div
						key="display"
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 10 }}
						onClick={() => setIsEditing(true)}
						className="flex items-center gap-2 cursor-pointer group/title"
					>
						<h1 className="text-lg font-black tracking-tight dark:text-white text-gray-900 px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all">
							{title || '未命名文件'}
						</h1>
						<Pencil className="w-3 h-3 text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity" />
					</motion.div>
				) : (
					<motion.div
						key="edit"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						className="relative"
					>
						<input
							ref={inputRef}
							autoFocus
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={handleSave}
							onKeyDown={(e) => e.key === 'Enter' && handleSave()}
							className="text-lg font-black tracking-tight bg-transparent outline-none dark:text-white text-gray-900 border-none px-2 py-1 w-[250px]"
						/>
						<motion.div
							layoutId="underline"
							className="absolute -bottom-1 left-0 h-[2px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
							initial={{ width: 0 }}
							animate={{ width: '100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{isSaving && (
				<div className="ml-2">
					<Loader2 className="w-3 h-3 animate-spin text-blue-500" />
				</div>
			)}
		</div>
	)
}

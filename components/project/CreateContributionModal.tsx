'use client'

import { supabase } from '@/lib/supabase/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, Sparkles, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
	isOpen: boolean
	onClose: () => void
	projectId: string
}

export default function CreateContributionModal({ isOpen, onClose, projectId }: Props) {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [loading, setLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!title) return

		setLoading(true)
		const {
			data: { user },
		} = await supabase.auth.getUser()

		const { error } = await supabase.from('contributions').insert({
			project_id: projectId,
			user_id: user?.id,
			title,
			content,
			status: 'active',
		})

		if (!error) {
			setTitle('')
			setContent('')
			onClose()
		}
		setLoading(false)
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* 背景遮罩：強磨砂感 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-xl"
					/>

					{/* Modal 本體 */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-lg px-4"
					>
						<div className="relative p-10 rounded-[40px] border dark:border-white/10 border-gray-200 dark:bg-black/60 bg-white/90 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
							{/* 背景微光裝飾 */}
							<div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

							<div className="flex justify-between items-center mb-10">
								<div>
									<h3 className="text-2xl font-black tracking-tight dark:text-white text-gray-950">
										New Synergy
									</h3>
									<p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-500 mt-1">
										Push your contribution
									</p>
								</div>
								<button
									onClick={onClose}
									className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
								>
									<X className="w-5 h-5 dark:text-gray-400 text-gray-500" />
								</button>
							</div>

							<form onSubmit={handleSubmit} className="space-y-10">
								{/* 標題輸入框：Z-Gen 底部單線設計 */}
								<div className="relative group">
									<input
										type="text"
										required
										placeholder="標題：你在忙什麼？"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										className="w-full bg-transparent border-b-2 dark:border-white/10 border-gray-100 py-3 outline-none focus:placeholder:opacity-0 transition-all text-xl font-bold dark:text-white text-gray-900"
									/>
									{/* Focus 時的橫向滑動擴張動畫 */}
									<div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 group-focus-within:w-full transition-all duration-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
								</div>

								{/* 內容輸入框 */}
								<div className="relative group">
									<textarea
										rows={4}
										placeholder="詳細描述一下你的進度... (選填)"
										value={content}
										onChange={(e) => setContent(e.target.value)}
										className="w-full bg-transparent border-b-2 dark:border-white/10 border-gray-100 py-3 outline-none focus:placeholder:opacity-0 transition-all text-sm font-medium dark:text-gray-300 text-gray-700 resize-none"
									/>
									<div className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 group-focus-within:w-full transition-all duration-500" />
								</div>

								<div className="flex justify-end pt-4">
									<button
										disabled={loading || !title}
										className="group relative px-10 py-4 rounded-2xl bg-gray-950 dark:bg-white dark:text-black text-white font-black overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
									>
										{/* 按鈕發光感 (Glow) */}
										<div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

										<span className="relative flex items-center gap-2">
											{loading ? (
												<span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
											) : (
												<>
													<Sparkles className="w-4 h-4" />
													<span>發布貢獻</span>
												</>
											)}
										</span>
									</button>
								</div>
							</form>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

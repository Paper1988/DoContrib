'use client'

import api from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Rocket, Sparkles, X } from 'lucide-react'
import { useState } from 'react'

interface Props {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
}

export default function CreateProjectModal({ isOpen, onClose, onSuccess }: Props) {
	const [projectName, setProjectName] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!projectName.trim()) return

		setLoading(true)
		setError(null)
		try {
			await api.post('/projects', { name: projectName.trim() })
			setProjectName('')
			onSuccess()
			onClose()
		} catch (err: any) {
			console.error('建立專案失敗:', err)
			setError(err?.message || '建立失敗，請稍後再試')
		} finally {
			setLoading(false)
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
					{/* Backdrop: 強磨砂感 */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
					/>

					{/* Modal Card */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className="relative w-full max-w-lg p-10 rounded-[40px] border dark:border-white/10 border-gray-200 dark:bg-black/60 bg-white/90 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
					>
						{/* 動態霓虹光暈 (Glow) */}
						<div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse" />

						<div className="flex justify-between items-start mb-12">
							<div>
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">
									<Sparkles className="w-3 h-3" />
									New Workspace
								</div>
								<h2 className="text-3xl font-black tracking-tight dark:text-white text-gray-950">
									開啟新的協作。
								</h2>
							</div>
							<button
								onClick={onClose}
								className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
							>
								<X className="w-5 h-5 text-gray-400" />
							</button>
						</div>

						<form onSubmit={handleCreate} className="space-y-12">
							{/* Z-Gen Input: 底部單線設計 */}
							<div className="relative group">
								<label className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">
									Project Name
								</label>
								<input
									autoFocus
									type="text"
									placeholder="為你的想法命名..."
									value={projectName}
									onChange={(e) => setProjectName(e.target.value)}
									className="w-full bg-transparent border-b-2 dark:border-white/10 border-gray-200 py-4 outline-none text-2xl font-bold dark:text-white text-gray-900 transition-all focus:placeholder:opacity-0"
								/>
								{/* Focus 時的橫向滑動擴張動畫 */}
								<div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 w-0 group-focus-within:w-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
							</div>

							<div className="flex flex-col gap-4">
								<button
									type="submit"
									disabled={loading || !projectName}
									className="group relative h-16 w-full rounded-2xl bg-gray-950 dark:bg-white text-white dark:text-black font-black text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
								>
									{/* Hover 產生的 blur-xl 光暈 */}
									<div className="absolute inset-0 bg-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

									<span className="relative flex items-center justify-center gap-3">
										{loading ? (
											<Loader2 className="w-6 h-6 animate-spin" />
										) : (
											<>
												<Rocket className="w-5 h-5" />
												立即發射專案
											</>
										)}
									</span>
								</button>
								{error && (
								<p className="text-red-500 text-sm font-bold text-center py-2 px-4 rounded-2xl bg-red-500/10">
									{error}
								</p>
							)}
							<p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
								系統將自動為你生成專屬邀請碼 (◐‿◑)﻿
							</p>
						</div>
					</form>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}

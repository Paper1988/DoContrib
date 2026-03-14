'use client'

import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import api from '@/lib/api'
import { showCustomToast } from '@/lib/ui'
import {
	Dialog,
	Switch,
	Transition,
	TransitionChild,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FilePlus, MoreVertical, Share2, Trash2, ExternalLink, Sparkles } from 'lucide-react'

type Document = {
	id: string
	title: string
	updated_at: string
}

export default function DocumentsPage() {
	const [isDark, setIsDark] = useState(true) // 優先使用 dark 模式視覺
	const [documents, setDocuments] = useState<Document[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [newDocTitle, setNewDocTitle] = useState('')
	const [selectedGroupId, setSelectedGroupId] = useState('')
	const [creating, setCreating] = useState(false)
	const [isPublic, setIsPublic] = useState(false)
	const router = useRouter()

	const fetchDocuments = async () => {
		try {
			setLoading(true)
			const res = await api.get('/documents')
			setDocuments(res.data.documents)
		} catch (err: any) {
			setError(err?.response?.data?.message || '載入文件失敗')
		} finally {
			setLoading(false)
		}
	}

	const deleteDocument = async (documentId: string) => {
		try {
			const res = await api.delete(`/documents/${documentId}`)
			if (res.status === 200) {
				fetchDocuments()
			}
		} catch (err: any) {
			setError(err?.response?.data?.message || '刪除文件失敗')
		}
	}

	const createDocument = async () => {
		if (!newDocTitle.trim()) {
			setError('請輸入文件標題')
			return
		}

		try {
			setCreating(true)
			setError(null)
			await api
				.post(
					'/documents',
					{
						title: newDocTitle.trim(),
						group_id: selectedGroupId || null,
						is_public: isPublic,
					},
					{
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)
				.then((res) => {
					setIsCreateModalOpen(false)
					router.push(`/documents/${res.data.document.id}`)
				})
				.catch((error) =>
					setError(error?.message || error?.response?.data?.message || '創建文件失敗')
				)
		} catch (err: unknown) {
			setError((err as Error)?.message || '創建文件時發生錯誤')
		} finally {
			setCreating(false)
		}
	}

	useEffect(() => {
		fetchDocuments()
	}, [])

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center dark:bg-gray-950">
				<Loading />
			</div>
		)

	return (
		<div className="min-h-screen relative dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500 overflow-hidden">
			{/* 背景裝飾 (規範核心) */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02]" />
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full" />
			</div>

			<div className="container mx-auto max-w-6xl px-6 py-20 relative z-10">
				{/* Header Section */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
					<div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							className="flex items-center gap-2 mb-4"
						>
							<Sparkles className="w-4 h-4 text-blue-500" />
							<span className="text-[10px] font-bold tracking-[0.2em] uppercase dark:text-gray-400 text-gray-500">
								Workspace
							</span>
						</motion.div>
						<h1 className="text-5xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900">
							我的文件
						</h1>
					</div>

					<Button
						onClick={() => {
							setNewDocTitle('')
							setIsCreateModalOpen(true)
						}}
						className="group relative px-8 py-6 rounded-full font-black text-lg transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black bg-gray-900 text-white shadow-2xl overflow-hidden"
					>
						<div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
						<span className="relative flex items-center gap-2">
							<FilePlus size={20} /> 創建新文件
						</span>
					</Button>
				</div>

				{/* Documents Grid */}
				<AnimatePresence mode="popLayout">
					{documents.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="text-center py-40 border-2 border-dashed dark:border-white/5 border-gray-200 rounded-[32px]"
						>
							<h3 className="text-2xl font-bold mb-2">這裡空空如也...</h3>
							<p className="dark:text-gray-500 text-gray-400 mb-8 font-medium">
								開始寫下你的第一個傳奇故事吧！
							</p>
						</motion.div>
					) : (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{documents.map((doc, index) => (
								<motion.div
									key={doc.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
								>
									<ContextMenu>
										<ContextMenuTrigger>
											<Card
												className="group relative p-8 cursor-pointer rounded-[32px] border transition-all duration-500 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:border-white/10 bg-white/50 hover:bg-white border-gray-200 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-1"
												onClick={() => router.push(`/documents/${doc.id}`)}
											>
												<div className="flex justify-between items-start mb-6">
													<div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
														<Share2 size={24} />
													</div>
													<MoreVertical className="opacity-0 group-hover:opacity-40 transition-opacity" />
												</div>
												<h3 className="text-xl font-bold mb-3 line-clamp-1 dark:text-white text-gray-900">
													{doc.title || '未命名文件'}
												</h3>
												<p className="text-xs font-bold tracking-widest dark:text-gray-500 text-gray-400 uppercase">
													{new Date(doc.updated_at).toLocaleDateString('zh-TW')} 更新
												</p>

												{/* Hover 邊框發光 */}
												<div className="absolute inset-0 rounded-[32px] border-2 border-blue-500/0 group-hover:border-blue-500/20 transition-all pointer-events-none" />
											</Card>
										</ContextMenuTrigger>

										<ContextMenuContent className="w-56 rounded-[20px] border dark:bg-black/80 dark:border-white/10 backdrop-blur-3xl p-2 shadow-3xl">
											<ContextMenuItem
												className="rounded-lg gap-2 font-medium py-3 cursor-pointer"
												onSelect={() => router.push(`/documents/${doc.id}`)}
											>
												<ExternalLink size={16} /> 開啟文件
											</ContextMenuItem>
											<ContextMenuItem
												className="rounded-lg gap-2 font-medium py-3 cursor-pointer"
												onSelect={() => {
													navigator.clipboard.writeText(
														`${window.location.origin}/documents/${doc.id}`
													)
													showCustomToast({
														isDark,
														title: '📄 連結已複製',
														message: `連結已存至剪貼簿`,
														duration: 2000,
														type: 'success',
													})
												}}
											>
												<Share2 size={16} /> 複製連結
											</ContextMenuItem>
											<ContextMenuSeparator className="dark:bg-white/5" />
											<ContextMenuItem
												className="rounded-lg gap-2 font-medium py-3 text-red-500 focus:bg-red-500/10 cursor-pointer"
												onSelect={() => {
													deleteDocument(doc.id)
												}}
											>
												<Trash2 size={16} /> 刪除文件
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</motion.div>
							))}
						</div>
					)}
				</AnimatePresence>
			</div>

			{/* Create Modal (進化版磨砂感) */}
			<Transition show={isCreateModalOpen} as={Fragment}>
				<Dialog as="div" className="relative z-[100]" onClose={() => setIsCreateModalOpen(false)}>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
					</TransitionChild>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4">
							<TransitionChild
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<DialogPanel className="w-full max-w-lg overflow-hidden border dark:border-white/10 dark:bg-black/60 bg-white/90 backdrop-blur-3xl p-10 rounded-[40px] shadow-3xl">
									<DialogTitle className="text-3xl font-black tracking-tight mb-8 dark:text-white">
										New Project
									</DialogTitle>

									<div className="space-y-10">
										<div className="relative group">
											<label className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-2 block">
												文件標題
											</label>
											<input
												autoFocus
												placeholder="幫你的傑作取個名字..."
												value={newDocTitle}
												onChange={(e) => setNewDocTitle(e.target.value)}
												className="w-full bg-transparent text-xl font-bold py-3 outline-none border-b-2 dark:border-white/10 border-gray-200 focus:border-blue-500 transition-all"
											/>
										</div>

										<div className="flex items-center justify-between p-6 rounded-3xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100">
											<div>
												<p className="font-bold dark:text-white">公開存取</p>
												<p className="text-xs dark:text-gray-500 text-gray-400">
													開啟後所有人皆可透過連結查看
												</p>
											</div>
											<Switch
												checked={isPublic}
												onChange={setIsPublic}
												className={`${isPublic ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'dark:bg-white/10 bg-gray-300'} relative inline-flex h-7 w-12 items-center rounded-full transition-all`}
											>
												<span
													className={`${isPublic ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
												/>
											</Switch>
										</div>

										<div className="flex gap-4">
											<button
												onClick={() => setIsCreateModalOpen(false)}
												className="flex-1 px-6 py-4 rounded-2xl font-bold dark:text-gray-400 text-gray-500 hover:dark:bg-white/5 transition-all"
											>
												取消
											</button>
											<button
												onClick={createDocument}
												disabled={creating || !newDocTitle.trim()}
												className="flex-1 px-6 py-4 rounded-2xl font-black dark:bg-white dark:text-black bg-gray-900 text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
											>
												{creating ? '處理中...' : '確認創建'}
											</button>
										</div>
									</div>
								</DialogPanel>
							</TransitionChild>
						</div>
					</div>
				</Dialog>
			</Transition>
		</div>
	)
}

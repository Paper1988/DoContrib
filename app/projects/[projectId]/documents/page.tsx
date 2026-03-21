'use client'

import Loading from '@/components/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import AppNavbar from '@/components/navigation/AppNavbar'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import api from '@/lib/api'
import { showCustomToast } from '@/lib/ui'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeft,
	ExternalLink,
	FileText,
	FilePlus,
	FolderKanban,
	Home,
	Share2,
	Settings,
	Trash2,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Document = {
	id: string
	title: string
	updated_at: string
}

export default function DocumentsPage() {
	const [documents, setDocuments] = useState<Document[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [newDocTitle, setNewDocTitle] = useState('')
	const [creating, setCreating] = useState(false)
	const [isPublic, setIsPublic] = useState(false)
	const [projectData, setProjectData] = useState<any>(null)

	const router = useRouter()
	const { projectId } = useParams()

	const fetchProjectData = async () => {
		try {
			const res = await api.get(`/projects/${projectId}`)
			setProjectData(res.data.project)
		} catch (err: any) {
			setError(err?.response?.data?.message || '載入專案失敗')
		}
	}

	const fetchDocuments = async () => {
		try {
			setLoading(true)
			const res = await api.get(`/projects/documents?projectId=${projectId}`)
			setDocuments(res.data.documents)
		} catch (err: any) {
			setError(err?.response?.data?.message || '載入文件失敗')
		} finally {
			setLoading(false)
		}
	}

	const deleteDocument = async (documentId: string) => {
		try {
			const res = await api.delete(`/projects/documents/${documentId}?projectId=${projectId}`)
			if (res.status === 200) fetchDocuments()
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
			const res = await api.post('/projects/documents', {
				title: newDocTitle.trim(),
				projectId,
				is_public: isPublic,
			})
			setIsCreateModalOpen(false)
			router.push(`/projects/${projectId}/documents/${res.data.document.id}`)
		} catch (err: any) {
			setError(err?.message || err?.response?.data?.message || '創建文件失敗')
		} finally {
			setCreating(false)
		}
	}

	useEffect(() => {
		if (projectId) {
			fetchDocuments()
			fetchProjectData()
		}
	}, [projectId])

	if (loading) return <Loading />

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 transition-colors duration-300"
		>
			<AppNavbar
				breadcrumbs={[
					{ label: '首頁', href: '/', icon: <Home className="w-3 h-3" /> },
					{ label: '專案', href: '/projects', icon: <FolderKanban className="w-3 h-3" /> },
					{ label: projectData?.name || '專案', href: `/projects/${projectId}` },
					{ label: '文件' },
				]}
				actions={
					<Button
						size="sm"
						onClick={() => {
							setNewDocTitle('')
							setIsCreateModalOpen(true)
						}}
						className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
					>
						<FilePlus className="w-3.5 h-3.5" /> 新增文件
					</Button>
				}
			/>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.push('/projects')}
							className="h-8 w-8 p-0 rounded-lg dark:hover:bg-white/5 hover:bg-gray-100"
						>
							<ArrowLeft className="w-4 h-4" />
						</Button>
						<div>
							<h1 className="text-xl font-bold dark:text-white text-gray-900">
								{projectData?.name || '專案文件'}
							</h1>
							<p className="text-sm dark:text-gray-500 text-gray-500 mt-0.5">
								管理此專案的所有文件
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => router.push(`/projects/${projectId}/settings`)}
							className="h-8 px-3 rounded-lg text-xs dark:text-gray-400 text-gray-500 hover:dark:text-white hover:text-gray-900 gap-1.5"
						>
							<Settings className="w-3.5 h-3.5" /> 設定
						</Button>
						<Badge className="text-xs px-3 py-1 dark:bg-white/5 bg-gray-100 dark:text-gray-400 text-gray-500 border-0 rounded-full font-medium">
							{documents.length} 份文件
						</Badge>
					</div>
				</div>

				{/* 文件列表 */}
				<AnimatePresence mode="popLayout">
					{documents.length === 0 ? (
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
							<CardContent className="flex flex-col items-center justify-center py-24 text-center">
								<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mb-4">
									<FileText className="w-5 h-5 dark:text-gray-600 text-gray-400" />
								</div>
								<p className="text-sm font-medium dark:text-gray-400 text-gray-500 mb-1">
									還沒有任何文件
								</p>
								<p className="text-xs dark:text-gray-600 text-gray-400 mb-6">
									建立第一份文件，開始協作吧
								</p>
								<Button
									size="sm"
									onClick={() => {
										setNewDocTitle('')
										setIsCreateModalOpen(true)
									}}
									className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
								>
									<FilePlus className="w-3.5 h-3.5" /> 新增文件
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{documents.map((doc, index) => (
								<motion.div
									key={doc.id}
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.04 }}
								>
									<ContextMenu>
										<ContextMenuTrigger>
											<Card
												onClick={() => router.push(`/projects/${projectId}/documents/${doc.id}`)}
												className="group cursor-pointer dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 dark:hover:border-white/15 hover:border-gray-300"
											>
												<CardContent className="p-5">
													<div className="w-9 h-9 rounded-xl dark:bg-blue-500/10 bg-blue-50 flex items-center justify-center mb-4">
														<FileText className="w-4 h-4 text-blue-500" />
													</div>
													<h3 className="font-semibold text-sm dark:text-white text-gray-900 mb-1 group-hover:text-blue-500 transition-colors line-clamp-1">
														{doc.title || '未命名文件'}
													</h3>
													<p className="text-xs dark:text-gray-500 text-gray-400">
														{new Date(doc.updated_at).toLocaleDateString('zh-TW')} 更新
													</p>
												</CardContent>
											</Card>
										</ContextMenuTrigger>

										<ContextMenuContent className="w-52 rounded-xl border dark:bg-[#1a1a1a] dark:border-white/10 bg-white border-gray-200 p-1.5 shadow-xl">
											<ContextMenuItem
												className="rounded-lg gap-2 text-sm px-3 py-2 cursor-pointer"
												onSelect={() => router.push(`/projects/${projectId}/documents/${doc.id}`)}
											>
												<ExternalLink className="w-3.5 h-3.5" /> 開啟文件
											</ContextMenuItem>
											<ContextMenuItem
												className="rounded-lg gap-2 text-sm px-3 py-2 cursor-pointer"
												onSelect={() => {
													navigator.clipboard.writeText(
														`${window.location.origin}/projects/${projectId}/documents/${doc.id}`
													)
													showCustomToast({
														title: '📄 連結已複製',
														message: '連結已存至剪貼簿',
														duration: 2000,
														type: 'success',
													})
												}}
											>
												<Share2 className="w-3.5 h-3.5" /> 複製連結
											</ContextMenuItem>
											<ContextMenuSeparator className="dark:bg-white/5 bg-gray-100 my-1" />
											<ContextMenuItem
												className="rounded-lg gap-2 text-sm px-3 py-2 text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
												onSelect={() => deleteDocument(doc.id)}
											>
												<Trash2 className="w-3.5 h-3.5" /> 刪除文件
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</motion.div>
							))}

							{/* 新增卡片 */}
							<motion.div
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: documents.length * 0.04 }}
							>
								<Card
									onClick={() => {
										setNewDocTitle('')
										setIsCreateModalOpen(true)
									}}
									className="group cursor-pointer dark:bg-[#111] bg-white border-2 border-dashed dark:border-white/8 border-gray-200 rounded-2xl dark:hover:border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 min-h-[110px]"
								>
									<CardContent className="flex flex-col items-center justify-center h-full py-8 gap-2">
										<div className="w-9 h-9 rounded-xl dark:bg-white/5 bg-gray-100 flex items-center justify-center dark:group-hover:bg-blue-500/10 group-hover:bg-blue-50 transition-colors">
											<FilePlus className="w-4 h-4 dark:text-gray-500 text-gray-400 group-hover:text-blue-500 transition-colors" />
										</div>
										<p className="text-xs font-medium dark:text-gray-500 text-gray-400 group-hover:text-blue-500 transition-colors">
											新增文件
										</p>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>

			{/* ── 建立文件 Dialog（shadcn） ── */}
			<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
				<DialogContent className="sm:max-w-md rounded-2xl dark:bg-[#111] dark:border-white/10 border-gray-200">
					<DialogHeader>
						<DialogTitle className="text-lg font-bold dark:text-white">新增文件</DialogTitle>
					</DialogHeader>

					<div className="space-y-6 py-2">
						<div className="space-y-2">
							<Label className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
								文件標題
							</Label>
							<Input
								autoFocus
								placeholder="幫你的文件取個名字..."
								value={newDocTitle}
								onChange={(e) => setNewDocTitle(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && createDocument()}
								className="dark:bg-white/5 dark:border-white/10 rounded-xl h-10 text-sm"
							/>
						</div>

						<div className="flex items-center justify-between p-4 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100">
							<div>
								<p className="text-sm font-semibold dark:text-white text-gray-900">公開存取</p>
								<p className="text-xs dark:text-gray-500 text-gray-400 mt-0.5">
									所有人皆可透過連結查看
								</p>
							</div>
							<Switch
								checked={isPublic}
								onCheckedChange={setIsPublic}
								className="data-[state=checked]:bg-blue-600"
							/>
						</div>

						{error && (
							<p className="text-xs text-red-500 dark:bg-red-500/10 bg-red-50 px-3 py-2 rounded-lg">
								{error}
							</p>
						)}
					</div>

					<DialogFooter className="gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsCreateModalOpen(false)}
							className="rounded-xl text-sm"
						>
							取消
						</Button>
						<Button
							onClick={createDocument}
							disabled={creating || !newDocTitle.trim()}
							className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm gap-1.5"
						>
							{creating ? '建立中...' : '確認建立'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</motion.div>
	)
}

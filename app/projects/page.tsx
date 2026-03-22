'use client'

import CreateProjectModal from '@/components/project/CreateProjectModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { showCustomToast } from '@/lib/ui'
import { AnimatePresence, motion } from 'framer-motion'
import {
	Folder,
	FolderKanban,
	Home,
	Loader2,
	Plus,
	Share2,
	Users,
	ExternalLink,
	Settings2,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppNavbar from '@/components/navigation/AppNavbar'
import { useTheme } from 'next-themes'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'

interface Project {
	id: string
	name: string
	invite_code: string
	owner_id: string
	created_at: string
}

export default function ProjectsPage() {
	const { data: session } = useSession()
	const router = useRouter()
	const [projects, setProjects] = useState<Project[]>([])
	const [loading, setLoading] = useState(true)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { resolvedTheme } = useTheme()

	useEffect(() => {
		if (session?.user) fetchProjects()
	}, [session])

	const fetchProjects = async () => {
		try {
			setLoading(true)
			const res: any = await api.get('/projects')
			if (res.data?.projects) setProjects(res.data.projects)
		} catch (error) {
			console.error('獲取專案失敗:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen dark:bg-[#0a0a0a] bg-[#fdfbfa] transition-colors duration-300"
		>
			<AppNavbar
				breadcrumbs={[
					{ label: '首頁', href: '/', icon: <Home className="w-3 h-3" /> },
					{ label: '專案', icon: <FolderKanban className="w-3 h-3 text-blue-500" /> },
				]}
				actions={
					<Button
						size="sm"
						onClick={() => setIsModalOpen(true)}
						className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
					>
						<Plus className="w-3.5 h-3.5" /> 建立專案
					</Button>
				}
			/>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-xl font-bold dark:text-white text-gray-900">我的專案</h1>
						<p className="text-sm dark:text-gray-500 text-gray-500 mt-0.5">
							管理你參與的所有協作空間
						</p>
					</div>
					<Badge className="text-xs px-3 py-1 dark:bg-white/5 bg-gray-100 dark:text-gray-400 text-gray-500 border-0 rounded-full font-medium">
						{projects.length} 個專案
					</Badge>
				</div>

				{loading ? (
					<div className="flex flex-col items-center justify-center py-40 gap-3">
						<Loader2 className="w-6 h-6 animate-spin text-blue-500" />
						<span className="text-xs dark:text-gray-600 text-gray-400">載入中...</span>
					</div>
				) : projects.length === 0 ? (
					<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
						<CardContent className="flex flex-col items-center justify-center py-24 text-center">
							<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mb-4">
								<Folder className="w-5 h-5 dark:text-gray-600 text-gray-400" />
							</div>
							<p className="text-sm font-medium dark:text-gray-400 text-gray-500 mb-1">
								還沒有任何專案
							</p>
							<p className="text-xs dark:text-gray-600 text-gray-400 mb-6">
								建立第一個專案，開始你的協作之旅
							</p>
							<Button
								onClick={() => setIsModalOpen(true)}
								size="sm"
								className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
							>
								<Plus className="w-3.5 h-3.5" /> 建立專案
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<AnimatePresence mode="popLayout">
							{projects.map((project, index) => (
								<motion.div
									key={project.id}
									layout
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.04 }}
								>
									<ContextMenu>
										<ContextMenuTrigger>
											<Card
												onClick={() => router.push(`/projects/${project.id}`)}
												className="group cursor-pointer dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 dark:hover:border-white/15 hover:border-gray-300"
											>
												<CardContent className="p-5">
													<div className="flex items-start justify-between gap-3 mb-4">
														<div className="w-10 h-10 rounded-xl dark:bg-blue-500/10 bg-blue-50 flex items-center justify-center shrink-0">
															<Folder className="w-5 h-5 text-blue-500" />
														</div>
														{project.owner_id === session?.user?.id && (
															<Badge className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 border-blue-500/20 border rounded-full font-semibold shrink-0">
																Owner
															</Badge>
														)}
													</div>
													<h3 className="font-semibold text-sm dark:text-white text-gray-900 mb-1 group-hover:text-blue-500 transition-colors truncate">
														{project.name}
													</h3>
													<p className="text-xs dark:text-gray-500 text-gray-400">
														建立於 {new Date(project.created_at).toLocaleDateString('zh-TW')}
													</p>
													<Separator className="my-4 dark:bg-white/5 bg-gray-100" />
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-1.5 dark:text-gray-500 text-gray-400">
															<Users className="w-3.5 h-3.5" />
															<span className="text-xs font-medium">Workspace</span>
														</div>
														<button
															onClick={(e) => {
																e.stopPropagation()
																navigator.clipboard.writeText(
																	`${window.location.origin}/projects/join/${project.invite_code}`
																)
																showCustomToast({
																	isDark: resolvedTheme === 'dark',
																	title: '📄 連結已複製',
																	message: '連結已存至剪貼簿',
																	duration: 2000,
																	type: 'success',
																})
															}}
															className="p-2 rounded-lg dark:hover:bg-white/10 hover:bg-gray-100 dark:text-gray-500 text-gray-400 hover:text-blue-500 transition-all"
														>
															<Share2 className="w-3.5 h-3.5" />
														</button>
													</div>
												</CardContent>
											</Card>
										</ContextMenuTrigger>

										<ContextMenuContent className="w-52 rounded-xl border dark:bg-[#1a1a1a] dark:border-white/10 bg-white border-gray-200 p-1.5 shadow-xl">
											<ContextMenuItem
												className="rounded-lg gap-2 text-sm px-3 py-2 cursor-pointer"
												onSelect={() => router.push(`/projects/${project.id}`)}
											>
												<ExternalLink className="w-3.5 h-3.5" /> 開啟專案
											</ContextMenuItem>
											<ContextMenuItem
												className="rounded-lg gap-2 text-sm px-3 py-2 cursor-pointer"
												onSelect={() => {
													navigator.clipboard.writeText(
														`${window.location.origin}/projects/join/${project.invite_code}`
													)
													showCustomToast({
														isDark: resolvedTheme === 'dark',
														title: '📄 連結已複製',
														message: '連結已存至剪貼簿',
														duration: 2000,
														type: 'success',
													})
												}}
											>
												<Share2 className="w-3.5 h-3.5" /> 複製邀請連結
											</ContextMenuItem>
											<ContextMenuSeparator className="dark:bg-white/5 bg-gray-100 my-1" />
											<ContextMenuItem
												className="rounded-lg gap-2 text-sm px-3 py-2 cursor-pointer"
												onSelect={() => router.push(`/projects/${project.id}/settings`)}
											>
												<Settings2 className="w-3.5 h-3.5" /> 專案設定
											</ContextMenuItem>
										</ContextMenuContent>
									</ContextMenu>
								</motion.div>
							))}

							<motion.div
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: projects.length * 0.04 }}
							>
								<Card
									onClick={() => setIsModalOpen(true)}
									className="group cursor-pointer dark:bg-[#111] bg-white border-2 border-dashed dark:border-white/8 border-gray-200 rounded-2xl dark:hover:border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 h-full min-h-[160px]"
								>
									<CardContent className="flex flex-col items-center justify-center h-full py-10 gap-2">
										<div className="w-9 h-9 rounded-xl dark:bg-white/5 bg-gray-100 flex items-center justify-center dark:group-hover:bg-blue-500/10 group-hover:bg-blue-50 transition-colors">
											<Plus className="w-4 h-4 dark:text-gray-500 text-gray-400 group-hover:text-blue-500 transition-colors" />
										</div>
										<p className="text-xs font-medium dark:text-gray-500 text-gray-400 group-hover:text-blue-500 transition-colors">
											建立新專案
										</p>
									</CardContent>
								</Card>
							</motion.div>
						</AnimatePresence>
					</div>
				)}
			</div>

			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchProjects}
			/>
		</motion.div>
	)
}

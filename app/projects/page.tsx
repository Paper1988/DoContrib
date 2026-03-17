'use client'

import CreateProjectModal from '@/components/project/CreateProjectModal'
import api from '@/lib/api'
import { showCustomToast } from '@/lib/ui'
import { AnimatePresence, motion } from 'framer-motion'
import { Folder, Loader2, Plus, Share2, Users } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

	useEffect(() => {
		if (session?.user) {
			fetchProjects()
		}
	}, [session])

	const fetchProjects = async () => {
		try {
			setLoading(true)
			const res: any = await api.get('/projects')
			if (res.data?.projects) {
				setProjects(res.data.projects)
			}
		} catch (error) {
			console.error('獲取專案失敗:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500">
			{/* 背景裝飾 */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.01]" />
				<div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
			</div>

			<main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
				<header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
					<div className="space-y-2">
						<h1 className="text-5xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900">
							My Spaces
						</h1>
						<p className="text-lg text-gray-500 font-medium tracking-tight">
							管理你參與的所有協作空間。
						</p>
					</div>

					<button
						onClick={() => setIsModalOpen(true)}
						className="group relative h-16 px-8 rounded-3xl bg-blue-600 text-white font-black text-lg flex items-center gap-3 shadow-[0_20px_40px_-12px_rgba(37,99,235,0.3)] hover:scale-105 active:scale-95 transition-all"
					>
						<div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
						<Plus className="w-6 h-6" />
						<span>建立新專案</span>
					</button>
				</header>

				{loading ? (
					<div className="flex flex-col items-center justify-center py-40 gap-4">
						<Loader2 className="w-10 h-10 animate-spin text-blue-500" />
						<span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">
							Loading Spaces...
						</span>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<AnimatePresence mode="popLayout">
							{projects.map((project, index) => (
								<motion.div
									key={project.id}
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.05 }}
									whileHover={{ y: -8 }}
									onClick={() => router.push(`/projects/${project.id}`)}
									className="group cursor-pointer p-8 rounded-[40px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/70 backdrop-blur-3xl shadow-xl relative overflow-hidden"
								>
									{/* 背景微光 */}
									<div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors" />

									<div className="relative space-y-6">
										<div className="w-14 h-14 rounded-[20px] bg-blue-500/10 flex items-center justify-center text-blue-500">
											<Folder className="w-7 h-7" />
										</div>

										<div>
											<h3 className="text-2xl font-black tracking-tight dark:text-white text-gray-950 mb-1 group-hover:text-blue-500 transition-colors">
												{project.name}
											</h3>
											<p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
												Created {new Date(project.created_at).toLocaleDateString()}
											</p>
										</div>

										<div className="pt-6 border-t dark:border-white/5 border-gray-100 flex items-center justify-between">
											<div className="flex items-center gap-2 text-gray-500">
												<Users className="w-4 h-4" />
												<span className="text-xs font-bold">Workspace</span>
											</div>

											<button
												onClick={(e) => {
													e.stopPropagation()
													navigator.clipboard.writeText(
														`${window.location.origin}/projects/join/${project.invite_code}`
													)
													showCustomToast({
														title: '📄 連結已複製',
														message: `連結已存至剪貼簿`,
														duration: 2000,
														type: 'success',
													})
												}}
												className="p-3 rounded-2xl dark:bg-white/5 bg-gray-100 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
											>
												<Share2 className="w-4 h-4" />
											</button>
										</div>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</div>
				)}
			</main>

			<CreateProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={fetchProjects}
			/>
		</div>
	)
}

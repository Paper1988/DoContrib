'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import AppNavbar from '@/components/navigation/AppNavbar'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	Check,
	Copy,
	FolderKanban,
	Home,
	Link,
	Loader2,
	Settings,
	Trash2,
	Users,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { showCustomToast } from '@/lib/ui'
import Image from 'next/image'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useSession } from 'next-auth/react'

interface Member {
	id: string
	name: string
	email: string
	image: string
	role: string
}

interface ProjectData {
	id: string
	name: string
	invite_code: string
	members: Member[]
}

export default function ProjectSettings() {
	const { projectId } = useParams()
	const router = useRouter()
	const [project, setProject] = useState<ProjectData | null>(null)
	const [loading, setLoading] = useState(true)
	const [copied, setCopied] = useState(false)
	const { data: session } = useSession()
	const isOwner = project?.members?.find((m) => m.id === session?.user?.id)?.role === 'owner'

	const handleRoleChange = async (memberId: string, role: string) => {
		try {
			await api.patch(`/projects/${projectId}/members/${memberId}`, { role })
			setProject((prev) =>
				prev
					? {
							...prev,
							members: prev.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
						}
					: prev
			)
		} catch (err) {
			console.error('修改權限失敗:', err)
		}
	}

	useEffect(() => {
		const fetchProjectData = async () => {
			try {
				const res = await api.get(`/projects/${projectId}`)
				setProject(res.data.project)
			} catch (err) {
				console.error('載入專案失敗:', err)
			} finally {
				setLoading(false)
			}
		}
		if (projectId) fetchProjectData()
	}, [projectId])

	const handleCopyInvite = () => {
		if (!project?.invite_code) return
		navigator.clipboard.writeText(`${window.location.origin}/projects/join/${project.invite_code}`)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
		showCustomToast({
			title: '🔗 連結已複製',
			message: '邀請連結已存至剪貼簿',
			duration: 2000,
			type: 'success',
		})
	}

	const handleRemoveMember = async (memberId: string) => {
		try {
			await api.delete(`/projects/${projectId}/members/${memberId}`)
			setProject((prev) =>
				prev ? { ...prev, members: prev.members.filter((m) => m.id !== memberId) } : prev
			)
		} catch (err) {
			console.error('移除成員失敗:', err)
		}
	}

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
					{ label: project?.name || '專案', href: `/projects/${projectId}` },
					{ label: '設定', icon: <Settings className="w-3 h-3" /> },
				]}
			/>

			<div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
				<div className="mb-6">
					<h1 className="text-xl font-bold dark:text-white text-gray-900">專案設定</h1>
					<p className="text-sm dark:text-gray-500 text-gray-500 mt-0.5">管理邀請連結與成員權限</p>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-40">
						<Loader2 className="w-6 h-6 animate-spin text-blue-500" />
					</div>
				) : (
					<div className="space-y-4">
						{/* 邀請連結 */}
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
							<CardHeader className="px-6 pt-6 pb-0">
								<CardTitle className="text-sm font-semibold dark:text-white text-gray-900 flex items-center gap-2">
									<Link className="w-4 h-4 text-blue-500" />
									邀請連結
								</CardTitle>
								<p className="text-xs dark:text-gray-500 text-gray-400 mt-1">
									分享此連結讓成員加入專案
								</p>
							</CardHeader>
							<CardContent className="px-6 py-5">
								<div className="flex items-center gap-3">
									<div className="flex-1 px-4 py-2.5 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/8 border-gray-200 font-mono text-xs dark:text-gray-400 text-gray-500 truncate">
										{project?.invite_code
											? `${window.location.origin}/projects/join/${project.invite_code}`
											: '載入中...'}
									</div>
									<Button
										size="sm"
										onClick={handleCopyInvite}
										className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 shrink-0 transition-all"
									>
										{copied ? (
											<>
												<Check className="w-3.5 h-3.5" /> 已複製
											</>
										) : (
											<>
												<Copy className="w-3.5 h-3.5" /> 複製
											</>
										)}
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* 成員列表 */}
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
							<CardHeader className="px-6 pt-6 pb-0 flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-sm font-semibold dark:text-white text-gray-900 flex items-center gap-2">
										<Users className="w-4 h-4 text-blue-500" />
										協作成員
									</CardTitle>
									<p className="text-xs dark:text-gray-500 text-gray-400 mt-1">
										共 {project?.members?.length ?? 0} 位成員
									</p>
								</div>
							</CardHeader>
							<CardContent className="px-6 py-5">
								<div className="space-y-1">
									{project?.members?.map((member, index) => (
										<div key={member.id}>
											<div className="flex items-center justify-between py-3 group">
												<div className="flex items-center gap-3">
													<div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 dark:bg-white/5 bg-gray-100">
														{member.image ? (
															<Image
																src={member.image}
																alt={member.name}
																width={36}
																height={36}
																className="object-cover w-full h-full"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center text-xs font-bold dark:text-gray-400 text-gray-500">
																{member.name?.[0]}
															</div>
														)}
													</div>
													<div>
														<p className="text-sm font-medium dark:text-white text-gray-900">
															{member.name}
														</p>
														<p className="text-xs dark:text-gray-500 text-gray-400">
															{member.email}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-2">
													{member.role === 'owner' || member.role === 'OWNER' ? (
														<Badge className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-500 border-orange-500/20 border rounded-full font-semibold">
															Owner
														</Badge>
													) : (
														<>
															{isOwner ? (
																<Select
																	value={member.role}
																	onValueChange={(role) => handleRoleChange(member.id, role)}
																>
																	<SelectTrigger className="h-7 w-24 text-xs rounded-lg dark:bg-white/5 bg-gray-50 dark:border-white/8 border-gray-200 dark:text-gray-300 text-gray-600 focus:ring-0">
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent className="rounded-xl dark:bg-[#1a1a1a] dark:border-white/10 text-xs">
																		<SelectItem value="editor" className="text-xs rounded-lg">
																			Editor
																		</SelectItem>
																		<SelectItem value="viewer" className="text-xs rounded-lg">
																			Viewer
																		</SelectItem>
																	</SelectContent>
																</Select>
															) : (
																<Badge className="text-[10px] px-2 py-0.5 dark:bg-white/5 bg-gray-100 dark:text-gray-400 text-gray-500 border-0 rounded-full font-medium capitalize">
																	{member.role}
																</Badge>
															)}
															{isOwner && (
																<button
																	onClick={() => handleRemoveMember(member.id)}
																	className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 dark:hover:bg-red-500/10 hover:bg-red-50 text-red-500 transition-all"
																>
																	<Trash2 className="w-3.5 h-3.5" />
																</button>
															)}
														</>
													)}
												</div>
											</div>
											{index < (project?.members?.length ?? 0) - 1 && (
												<Separator className="dark:bg-white/5 bg-gray-100" />
											)}
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</motion.div>
	)
}

'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
	BarChart3,
	Home,
	Layout,
	LogOut,
	Settings,
	User,
	Activity,
	FolderKanban,
	ChevronRight,
	Plus,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppNavbar from '@/components/navigation/AppNavbar'

export default function DashboardPage() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [mounted, setMounted] = useState(false)
	const [stats, setStats] = useState({ projectCount: 0, contributionCount: 0 })

	useEffect(() => {
		setMounted(true)
		if (status === 'authenticated' && session?.user?.email) {
			fetchUserStats()
		}
	}, [status, session])

	const fetchUserStats = async () => {
		try {
			const res = await api.get(`/profile/${session?.user?.id}/stats`)
			setStats({
				projectCount: res.data.projectCount,
				contributionCount: res.data.contributionCount,
			})
		} catch (error) {
			console.error('獲取統計資料失敗:', error)
		}
	}

	if (status === 'unauthenticated') {
		router.push('/signIn')
		return null
	}

	if (!mounted || status === 'loading') return null

	const firstName = session?.user?.name?.split(' ')[0] ?? '用戶'

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 transition-colors duration-300"
		>
			<AppNavbar
				breadcrumbs={[
					{ label: '首頁', href: '/', icon: <Home className="w-3 h-3" /> },
					{
						label: '個人檔案',
						href: `/user/${session?.user?.id}`,
						icon: <FolderKanban className="w-3 h-3" />,
					},
					{
						label: '儀表板',
						icon: <BarChart3 className="w-3 h-3 text-blue-500" />,
					},
				]}
			/>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
				<div className="flex flex-col lg:flex-row gap-6">
					<aside className="lg:w-72 shrink-0 space-y-4">
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl overflow-hidden">
							<div className="h-20 dark:bg-white/5 bg-gray-100" />
							<CardContent className="px-5 pb-5 -mt-8">
								<Avatar className="w-14 h-14 ring-4 dark:ring-[#111] ring-white shadow-lg mb-3">
									<AvatarImage src={session?.user?.image ?? ''} />
									<AvatarFallback className="text-lg bg-blue-500/20 text-blue-500 font-bold">
										{firstName[0]}
									</AvatarFallback>
								</Avatar>

								<div className="flex items-start justify-between gap-2 mb-1">
									<div className="min-w-0">
										<h2 className="font-bold text-sm dark:text-white text-gray-900 truncate">
											{session?.user?.name}
										</h2>
										<p className="text-xs dark:text-gray-500 text-gray-400 truncate mt-0.5">
											{session?.user?.email}
										</p>
									</div>
									<Badge className="shrink-0 text-[10px] px-2 py-0.5 bg-blue-500/15 text-blue-500 border-blue-500/20 border rounded-full font-semibold">
										Pro
									</Badge>
								</div>

								<Separator className="my-4 dark:bg-white/5 bg-gray-100" />

								{/* 統計 */}
								<div className="grid grid-cols-2 gap-3">
									{[
										{ label: 'Projects', value: stats.projectCount },
										{ label: 'Contribs', value: stats.contributionCount },
									].map(({ label, value }) => (
										<div
											key={label}
											className="text-center p-3 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100"
										>
											<p className="text-base font-bold dark:text-white text-gray-900">{value}</p>
											<p className="text-[10px] uppercase tracking-wider dark:text-gray-500 text-gray-400 font-medium mt-0.5">
												{label}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* 導覽選單 */}
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
							<CardContent className="p-2">
								<nav className="space-y-0.5">
									{[
										{
											icon: BarChart3,
											label: '儀表板',
											active: true,
											onClick: undefined,
										},
										{
											icon: FolderKanban,
											label: '我的專案',
											onClick: () => router.push('/projects'),
										},
										{
											icon: User,
											label: '個人頁面',
											onClick: () => router.push(`/user/${session?.user?.id}`),
										},
										{
											icon: Activity,
											label: '活動紀錄',
											onClick: undefined,
											soon: true,
										},
										{
											icon: Settings,
											label: '偏好設定',
											onClick: undefined,
											soon: true,
										},
									].map(({ icon: Icon, label, active, onClick, soon }) => (
										<button
											key={label}
											onClick={onClick}
											disabled={soon}
											className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
												active
													? 'dark:bg-white/10 bg-gray-100 dark:text-white text-gray-900'
													: soon
														? 'opacity-40 cursor-not-allowed dark:text-gray-500 text-gray-400'
														: 'dark:text-gray-400 text-gray-600 dark:hover:bg-white/5 hover:bg-gray-50 dark:hover:text-white hover:text-gray-900'
											}`}
										>
											<Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-500' : ''}`} />
											<span className="flex-1 text-left">{label}</span>
											{soon && (
												<Badge className="text-[9px] px-1.5 py-0 dark:bg-white/5 bg-gray-100 dark:text-gray-500 text-gray-400 border-0 font-medium rounded-md">
													soon
												</Badge>
											)}
											{!active && !soon && (
												<ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-500 text-gray-400" />
											)}
										</button>
									))}
								</nav>

								<Separator className="my-2 dark:bg-white/5 bg-gray-100" />

								<button
									onClick={() => signOut({ callbackUrl: '/' })}
									className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 dark:hover:bg-red-500/10 hover:bg-red-50 transition-all duration-150 group"
								>
									<LogOut className="w-4 h-4 shrink-0" />
									<span className="flex-1 text-left">登出帳號</span>
								</button>
							</CardContent>
						</Card>
					</aside>

					{/* ── 右側主內容 ── */}
					<main className="flex-1 min-w-0 space-y-6">
						{/* 歡迎標題列 */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div>
								<h1 className="text-xl font-bold dark:text-white text-gray-900">
									晚安，{firstName} 👋
								</h1>
								<p className="text-sm dark:text-gray-500 text-gray-500 mt-0.5">
									今天想創造些什麼？
								</p>
							</div>
							<Button
								onClick={() => router.push('/projects')}
								className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-2 shadow-sm self-start sm:self-auto"
							>
								<Layout className="w-3.5 h-3.5" /> 我的專案看板
							</Button>
						</div>

						{/* 快速統計卡 */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{[
								{
									label: '參與專案',
									value: stats.projectCount,
									icon: FolderKanban,
									color: 'text-blue-500',
								},
								{
									label: '貢獻次數',
									value: stats.contributionCount,
									icon: Activity,
									color: 'text-violet-500',
								},
								{ label: '本月活躍', value: '—', icon: BarChart3, color: 'text-emerald-500' },
							].map(({ label, value, icon: Icon, color }) => (
								<Card
									key={label}
									className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl"
								>
									<CardContent className="p-5">
										<div className="flex items-center justify-between mb-3">
											<p className="text-xs font-medium dark:text-gray-500 text-gray-500">
												{label}
											</p>
											<Icon className={`w-4 h-4 ${color}`} />
										</div>
										<p className="text-2xl font-bold dark:text-white text-gray-900">{value}</p>
									</CardContent>
								</Card>
							))}
						</div>

						{/* 主要空白區域（數據追蹤 Coming Soon） */}
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
							<CardHeader className="px-6 pt-6 pb-0">
								<CardTitle className="text-sm font-semibold dark:text-white text-gray-900 flex items-center gap-2">
									<BarChart3 className="w-4 h-4 text-blue-500" />
									活動總覽
								</CardTitle>
							</CardHeader>
							<CardContent className="px-6 py-16 flex flex-col items-center text-center">
								<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mb-3">
									<BarChart3 className="w-5 h-5 dark:text-gray-600 text-gray-400" />
								</div>
								<p className="text-sm font-medium dark:text-gray-400 text-gray-500 mb-1">
									數據追蹤系統開發中
								</p>
								<p className="text-xs dark:text-gray-600 text-gray-400 max-w-xs leading-relaxed">
									我們正在串接實時活動指標，讓你的每一份貢獻都能轉化為視覺化的成長曲線。
								</p>
								<button className="mt-5 px-4 py-2 rounded-lg dark:bg-white/5 bg-gray-100 text-xs font-semibold dark:text-gray-400 text-gray-500 dark:hover:bg-white/10 hover:bg-gray-200 transition-colors">
									查看 Roadmap
								</button>
							</CardContent>
						</Card>
					</main>
				</div>
			</div>
		</motion.div>
	)
}

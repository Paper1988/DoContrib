'use client'

import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/supabase'
import { Avatar } from '@mui/material'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { ArrowUpRight, BarChart3, Home, Layout, LogOut, Settings, Sparkles } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
			const { count: projectCount } = await supabase
				.from('project_members')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', session?.user?.id)

			const { count: contributionCount } = await supabase
				.from('contributions')
				.select('*', { count: 'exact', head: true })
				.eq('user_id', session?.user?.id)

			setStats({
				projectCount: projectCount || 0,
				contributionCount: contributionCount || 0,
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

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.1 },
		},
	}

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 },
	}

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="min-h-screen dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500 overflow-x-hidden selection:bg-blue-500/30"
		>
			{/* 核心網格背景與霓虹光暈 */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.01]" />
				<div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
				<div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full" />
			</div>

			<main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
				{/* Header: 歡迎語 */}
				<header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
					<div className="space-y-4">
						<motion.div
							variants={itemVariants}
							className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 text-[10px] font-bold tracking-[0.2em] uppercase"
						>
							<Sparkles className="w-3 h-3" />
							Synergy Hub v1.0
						</motion.div>
						<motion.h1
							variants={itemVariants}
							className="text-5xl md:text-7xl font-black tracking-tight dark:text-white text-gray-900"
						>
							晚安，{session?.user?.name?.split(' ')[0]}
						</motion.h1>
						<motion.p
							variants={itemVariants}
							className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-lg leading-relaxed"
						>
							今天想創造些什麼？這裡是你所有想法的發源地。
						</motion.p>
					</div>

					<motion.button
						variants={itemVariants}
						whileHover={{ scale: 1.02, y: -2 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => router.push('/projects')}
						className="group relative h-16 px-10 rounded-[24px] bg-gray-950 dark:bg-white text-white dark:text-black font-black text-lg flex items-center gap-3 shadow-2xl overflow-hidden transition-all"
					>
						<div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
						<span className="relative flex items-center gap-2">
							我的專案看板 <Layout className="w-5 h-5" />
						</span>
					</motion.button>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
					{/* 左側：個人狀態 (4 col) */}
					<div className="lg:col-span-4 space-y-6">
						<motion.div variants={itemVariants}>
							<Card className="p-10 rounded-[32px] border backdrop-blur-3xl dark:bg-black/40 bg-white/80 dark:border-white/10 border-gray-200 overflow-hidden relative">
								<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />
								<div className="flex flex-col items-center text-center">
									<div className="relative group">
										<div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
										<Avatar
											sx={{ width: 110, height: 110 }}
											src={session?.user?.image ?? ''}
											className="relative ring-4 ring-white dark:ring-white/10 shadow-2xl transition-transform group-hover:scale-105 duration-500"
										/>
									</div>
									<h2 className="mt-8 text-3xl font-black tracking-tight">{session?.user?.name}</h2>
									<p className="text-sm font-bold text-gray-500 mt-2 tracking-wide">
										{session?.user?.email}
									</p>

									<div className="w-full h-px dark:bg-white/10 bg-gray-100 my-8" />

									<div className="grid grid-cols-2 w-full gap-4">
										<div className="text-center p-5 rounded-[24px] dark:bg-white/5 bg-gray-50/50 border border-transparent dark:hover:border-white/10 transition-colors group">
											<div className="text-2xl font-black group-hover:text-blue-500 transition-colors">
												{stats.projectCount}
											</div>
											<div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">
												Projects
											</div>
										</div>
										<div className="text-center p-5 rounded-[24px] dark:bg-white/5 bg-gray-50/50 border border-transparent dark:hover:border-white/10 transition-colors group">
											<div className="text-2xl font-black group-hover:text-purple-500 transition-colors">
												{stats.contributionCount}
											</div>
											<div className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">
												Contribs
											</div>
										</div>
									</div>
								</div>
							</Card>
						</motion.div>

						<motion.div variants={itemVariants} className="grid grid-cols-1 gap-3">
							<QuickActionBtn
								icon={<Home className="w-5 h-5 text-blue-500" />}
								label="返回首頁"
								onClick={() => router.push('/')}
							/>
							<QuickActionBtn
								icon={<Settings className="w-5 h-5 text-gray-400" />}
								label="偏好設定"
							/>
							<QuickActionBtn
								icon={<LogOut className="w-5 h-5 text-red-500" />}
								label="登出帳號"
								onClick={() => signOut({ callbackUrl: '/' })}
								danger
							/>
						</motion.div>
					</div>

					{/* 右側：主要內容區 (8 col) */}
					<div className="lg:col-span-8 space-y-8">
						<motion.div variants={itemVariants} className="h-full">
							<Card className="relative h-full overflow-hidden p-12 rounded-[32px] border dark:bg-black/20 bg-white/40 border-dashed dark:border-white/10 border-gray-300 flex flex-col items-center justify-center text-center min-h-[500px]">
								<div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] to-transparent pointer-events-none" />
								<div className="relative z-10 flex flex-col items-center">
									<div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-8 transform -rotate-6 hover:rotate-0 transition-all duration-700 shadow-xl border dark:border-white/10 border-gray-200">
										<BarChart3 className="w-12 h-12 text-gray-400" />
									</div>
									<h3 className="text-3xl font-black tracking-tight mb-4">數據追蹤系統開發中</h3>
									<p className="text-gray-500 dark:text-gray-400 max-w-md text-lg leading-relaxed font-medium">
										我們正在串接實時活動指標，讓你的每一份貢獻都能轉化為視覺化的成長曲線。
									</p>
									<div className="mt-10 flex gap-4">
										<button className="px-8 py-3 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold tracking-widest uppercase hover:bg-blue-500/20 transition-all">
											Roadmap
										</button>
									</div>
								</div>
							</Card>
						</motion.div>
					</div>
				</div>
			</main>
		</motion.div>
	)
}

function QuickActionBtn({
	icon,
	label,
	onClick,
	danger = false,
}: {
	icon: any
	label: string
	onClick?: () => void
	danger?: boolean
}) {
	return (
		<button
			onClick={onClick}
			className={clsx(
				'flex items-center justify-between px-8 py-5 rounded-[24px] border transition-all duration-300 group shadow-sm',
				danger
					? 'dark:border-red-500/20 border-red-100 dark:bg-red-500/5 bg-red-50/30 hover:bg-red-500 text-red-500 hover:text-white'
					: 'dark:bg-white/5 bg-white/60 border-transparent hover:border-gray-200 dark:hover:border-white/10 dark:hover:bg-white/10 backdrop-blur-md'
			)}
		>
			<div className="flex items-center gap-4 font-black tracking-tight text-lg">
				<span className="transition-transform group-hover:scale-110 duration-300">{icon}</span>
				{label}
			</div>
			<ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
		</button>
	)
}

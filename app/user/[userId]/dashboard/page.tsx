'use client'

import { Card } from '@/components/ui/card'
import { Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import {
	BarChart3,
	FileText,
	Home,
	LogOut,
	ArrowRight,
	Settings,
	ArrowUpRight,
	Sparkles,
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'

export default function DashboardPage() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

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
			className="min-h-screen dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500 overflow-x-hidden"
		>
			{/* 核心網格背景與霓虹光暈 */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />
				<div className="absolute top-0 -left-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full" />
				<div className="absolute bottom-0 -right-20 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full" />
			</div>

			<main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
				{/* Header: 歡迎語 */}
				<header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
					<div>
						<motion.div
							variants={itemVariants}
							className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500 text-xs font-bold mb-4"
						>
							<Sparkles className="w-3 h-3" />
							DASHBOARD ALPHA
						</motion.div>
						<motion.h1
							variants={itemVariants}
							className="text-4xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900"
						>
							晚安，{session?.user?.name?.split(' ')[0]}
						</motion.h1>
						<motion.p
							variants={itemVariants}
							className="mt-3 text-lg text-gray-500 dark:text-gray-400 font-medium"
						>
							今天想創造些什麼？這裡是你所有想法的發源地。
						</motion.p>
					</div>

					<motion.button
						variants={itemVariants}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => router.push('/documents')}
						className="h-14 px-8 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold flex items-center gap-2 shadow-2xl transition-all"
					>
						前往文件管理 <ArrowRight className="w-5 h-5 text-gray-500" />
					</motion.button>
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
					{/* 左側：個人狀態與核心操作 (4 col) */}
					<div className="lg:col-span-4 space-y-6">
						<motion.div variants={itemVariants}>
							<Card className="p-8 rounded-[32px] border backdrop-blur-3xl dark:bg-black/40 bg-white/80 dark:border-white/10 border-gray-200">
								<div className="flex flex-col items-center text-center">
									<div className="relative group">
										<div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
										<Avatar
											sx={{ width: 100, height: 100 }}
											src={session?.user?.image ?? ''}
											className="relative ring-4 ring-white dark:ring-white/10 shadow-2xl"
										/>
									</div>
									<h2 className="mt-6 text-2xl font-bold">{session?.user?.name}</h2>
									<p className="text-sm text-gray-500 mt-1">{session?.user?.email}</p>

									<div className="w-full h-px dark:bg-white/10 bg-gray-200 my-6" />

									<div className="grid grid-cols-2 w-full gap-4">
										<div className="text-center p-3 rounded-2xl dark:bg-white/5 bg-gray-50">
											<div className="text-xl font-black">0</div> {/** TODO */}
											<div className="text-[10px] uppercase tracking-wider text-gray-500">
												文件數
											</div>
										</div>
										<div className="text-center p-3 rounded-2xl dark:bg-white/5 bg-gray-50">
											<div className="text-xl font-black">0</div> {/** TODO */}
											<div className="text-[10px] uppercase tracking-wider text-gray-500">貢獻</div>
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
								icon={<Settings className="w-5 h-5 text-gray-500" />}
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
						{/* 統計區域 Placeholder */}
						<motion.div variants={itemVariants}>
							<Card className="relative overflow-hidden p-8 rounded-[32px] border dark:bg-black/20 bg-white/40 border-dashed dark:border-white/10 border-gray-300 min-h-[400px] flex flex-col items-center justify-center text-center">
								<div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
								<div className="relative z-10">
									<div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-[24px] flex items-center justify-center mb-6 mx-auto transform rotate-12 group-hover:rotate-0 transition-transform">
										<BarChart3 className="w-10 h-10 text-gray-400" />
									</div>
									<h3 className="text-2xl font-bold tracking-tight">數據追蹤系統開發中</h3>
									<p className="text-gray-500 dark:text-gray-400 max-w-sm mt-3 text-lg leading-relaxed">
										我們正在串接 Liveblocks
										的活動指標，讓你的每一份筆記與協作都能轉化為視覺化的成長曲線。
									</p>
									<button className="mt-8 px-6 py-2 rounded-full border dark:border-white/10 border-gray-200 text-sm font-semibold hover:bg-white/10 transition-colors">
										了解更多計畫
									</button>
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
				'flex items-center justify-between px-6 py-4 rounded-[22px] border transition-all duration-300 group',
				danger
					? 'dark:border-red-500/10 border-red-100 dark:hover:bg-red-500/10 hover:bg-red-50 text-red-500'
					: 'dark:bg-white/5 bg-white border-transparent hover:border-gray-200 dark:hover:border-white/10 dark:hover:bg-white/10 shadow-sm'
			)}
		>
			<div className="flex items-center gap-4 font-bold">
				{icon}
				{label}
			</div>
			<ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
		</button>
	)
}

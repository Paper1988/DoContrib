'use client'

import { motion } from 'framer-motion'
import { Cookie, PieChart, Settings, RefreshCw } from 'lucide-react'

export default function CookiesPolicy() {
	return (
		<div className="relative min-h-screen w-full dark:bg-gray-950 bg-[#fdfbfa] overflow-x-hidden">
			{/* 背景裝飾：規範內的極淡網格與動態光暈 */}
			<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] pointer-events-none" />
			<div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

			<main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
				{/* 標題區 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-20 text-center md:text-left"
				>
					<h2 className="font-bold uppercase tracking-[0.2em] text-blue-500 text-sm mb-4">
						Data Tracking
					</h2>
					<h1 className="text-5xl md:text-7xl font-black tracking-tight dark:text-white text-gray-900">
						Cookie 政策
					</h1>
					<p className="mt-6 dark:text-gray-400 text-gray-600 font-medium text-lg">
						我們使用小型文字檔案來優化您的操作流程，確保一切運行絲滑。
					</p>
				</motion.div>

				{/* 內容區塊 */}
				<section className="space-y-8">
					{[
						{
							title: '什麼是 Cookie？',
							desc: 'Cookie 是網站儲存在您裝置上的小型文字檔案。這些檔案能協助網站記住您的偏好設定，提供更好的使用體驗。',
							icon: Cookie,
						},
						{
							title: '我們如何使用 Cookie？',
							desc: '我們根據用途將其分為以下幾類：',
							categories: [
								{ label: '必要性', detail: '確保網站正常運作的基本功能' },
								{ label: '分析性', detail: '幫助我們了解使用者行為' },
								{ label: '功能性', detail: '記住您的偏好設定' },
							],
							icon: PieChart,
						},
						{
							title: '如何管理 Cookie？',
							desc: '您可以透過瀏覽器設定來管理或刪除 Cookie。請注意，停用某些 Cookie 可能會影響網站的功能。',
							icon: Settings,
						},
						{
							title: '更新政策',
							desc: '我們保留隨時更新本 Cookie 政策的權利。重大變更時，我們會在網站上發布通知。',
							icon: RefreshCw,
						},
					].map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="group relative p-8 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
						>
							<div className="flex items-start gap-6">
								<div className="hidden sm:flex p-4 rounded-2xl dark:bg-white/5 bg-gray-100 text-blue-500">
									<item.icon size={24} />
								</div>
								<div className="flex-1">
									<h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900 tracking-tight">
										{item.title}
									</h2>
									<p className="dark:text-gray-400 text-gray-600 leading-relaxed font-medium">
										{item.desc}
									</p>

									{item.categories && (
										<div className="mt-6 space-y-3">
											{item.categories.map((cat) => (
												<div
													key={cat.label}
													className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-2xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100"
												>
													<span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-500">
														{cat.label}
													</span>
													<span className="text-sm dark:text-gray-300 text-gray-700 font-semibold">
														{cat.detail}
													</span>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</motion.div>
					))}
				</section>

				<footer className="mt-20 text-center dark:text-gray-500 text-gray-400 text-sm font-medium">
					最後更新日期：2026年3月12日
				</footer>
			</main>
		</div>
	)
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Zap,
	Layout,
	ShieldCheck,
	Search,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Lock,
	User,
	CheckCircle2,
} from 'lucide-react'

const features = [
	{
		id: 'feat-1',
		title: '貢獻透明化',
		desc: '每一行程式碼都有價值，讓 Carry 全場的隊友被看見。',
		icon: Zap,
		score: 85,
	},
	{
		id: 'feat-2',
		title: '磨砂 UI 介面',
		desc: '採用極簡玻璃擬態設計，讓管理工作也變成視覺享受。',
		icon: Layout,
		score: 92,
	},
	{
		id: 'feat-3',
		title: '安全權限控管',
		desc: '基於 Discord 機器人開發經驗，提供最穩定的管理機制。',
		icon: ShieldCheck,
		score: 78,
	},
]

export default function FeatureSection() {
	const [activeId, setActiveId] = useState(features[0].id)
	const activeFeature = features.find((f) => f.id === activeId)

	return (
		<section className="py-20 sm:py-32 px-5 sm:px-8 relative z-10 w-full overflow-hidden">
			<div className="max-w-6xl mx-auto">
				{/* 標題區 */}
				<div className="mb-12 sm:mb-20 text-center md:text-left">
					<h2 className="font-bold uppercase tracking-[0.2em] text-blue-500 text-xs sm:text-sm mb-4">
						Core Features
					</h2>
					<h3 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight dark:text-white text-gray-900 leading-tight">
						不僅是管理，
						<br className="md:hidden" />
						是藝術。
					</h3>
				</div>

				{/* 佈局：手機版展示板在上(flex-col-reverse)，桌面版並排 */}
				<div className="flex flex-col-reverse md:grid md:grid-cols-12 gap-8 lg:gap-12 items-start">
					{/* 左側：互動 List */}
					<div className="w-full md:col-span-5 space-y-4">
						{features.map((f) => {
							const isActive = activeId === f.id

							return (
								<div
									key={f.id}
									onClick={() => setActiveId(f.id)}
									className="group relative cursor-pointer"
								>
									{/* 效能優化 1：捨棄 layoutId，改用常駐 DOM + opacity 切換發光背景 */}
									<div
										className={`absolute inset-0 rounded-[32px] bg-blue-500/10 blur-xl transition-opacity duration-500 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}
									/>

									<motion.div
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.98 }}
										className={`relative p-6 sm:p-7 rounded-[32px] border transition-all duration-500 z-10 ${
											isActive
												? 'dark:bg-white/10 bg-white dark:border-white/20 border-blue-500/30 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]'
												: 'dark:bg-black/20 bg-gray-50/50 border-transparent dark:hover:border-white/10 hover:border-gray-200'
										}`}
									>
										<div className="flex items-start gap-4">
											<div
												className={`p-3 rounded-2xl transition-all duration-500 shrink-0 mt-0.5 ${
													isActive
														? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
														: 'dark:bg-white/5 bg-white text-gray-400 border dark:border-white/10 border-gray-200'
												}`}
											>
												<f.icon size={20} />
											</div>
											<div className="flex-1 min-w-0">
												<h4
													className={`font-black tracking-tight transition-colors text-lg ${
														isActive
															? 'dark:text-white text-gray-900'
															: 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
													}`}
												>
													{f.title}
												</h4>

												{/* 效能優化 2：文字展開動畫簡化，使用 grid-rows 技巧或 AnimatePresence (不加 blur) */}
												<AnimatePresence initial={false}>
													{isActive && (
														<motion.div
															initial={{ height: 0, opacity: 0 }}
															animate={{ height: 'auto', opacity: 1 }}
															exit={{ height: 0, opacity: 0 }}
															transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
															className="overflow-hidden"
														>
															<p className="text-sm dark:text-gray-400 text-gray-600 mt-2 leading-relaxed font-medium">
																{f.desc}
															</p>
														</motion.div>
													)}
												</AnimatePresence>
											</div>
										</div>
									</motion.div>
								</div>
							)
						})}
					</div>
					<div className="w-full md:col-span-7 md:sticky md:top-32 z-20">
						<div className="relative p-6 sm:p-10 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-center">
							<AnimatePresence mode="wait">
								{/* 情境一：貢獻透明化 (模擬排行榜) */}
								{activeId === 'feat-1' && (
									<motion.div
										key="feat-1"
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -15 }}
										transition={{ duration: 0.3 }}
										className="w-full z-10 space-y-5"
									>
										<div className="mb-6">
											<h5 className="text-xs font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">
												Live Contributions
											</h5>
											<p className="text-2xl font-black dark:text-white text-gray-900 tracking-tight">
												本週專案貢獻榜
											</p>
										</div>
										{/* 模擬三個隊友的貢獻條 */}
										{[
											{ name: 'You', score: 92, color: 'bg-blue-500' },
											{ name: 'Teammate A', score: 78, color: 'bg-purple-500' },
											{ name: 'Teammate B', score: 45, color: 'bg-gray-400' },
										].map((user, i) => (
											<div key={i} className="space-y-2">
												<div className="flex justify-between text-sm font-bold">
													<span className="dark:text-gray-300 text-gray-700">{user.name}</span>
													<span className="dark:text-white text-gray-900">
														{user.score} Commits
													</span>
												</div>
												<div className="h-2 w-full dark:bg-white/5 bg-gray-100 rounded-full overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														animate={{ width: `${user.score}%` }}
														transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
														className={`h-full ${user.color}`}
													/>
												</div>
											</div>
										))}
									</motion.div>
								)}

								{/* 情境二：磨砂 UI 介面 (模擬浮動工具列) */}
								{activeId === 'feat-2' && (
									<motion.div
										key="feat-2"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.3 }}
										className="w-full z-10 flex flex-col items-center justify-center h-full"
									>
										<div className="mb-8 text-center">
											<p className="text-xl font-black dark:text-white text-gray-900 tracking-tight">
												Try to hover me
											</p>
										</div>
										{/* 模擬一個極致的玻璃擬態工具列 */}
										<motion.div
											whileHover={{
												scale: 1.05,
												boxShadow: '0 20px 40px -15px rgba(59,130,246,0.3)',
											}}
											className="flex items-center gap-4 p-4 rounded-2xl dark:bg-black/50 bg-white/50 backdrop-blur-2xl border dark:border-white/20 border-gray-300 shadow-xl cursor-pointer"
										>
											{['AlignLeft', 'AlignCenter', 'AlignRight'].map((icon, i) => (
												<div
													key={i}
													className="p-3 rounded-xl dark:hover:bg-white/10 hover:bg-gray-200 transition-colors dark:text-gray-300 text-gray-700"
												>
													<div className="w-5 h-5 rounded bg-current opacity-80" />{' '}
													{/* 這裡可以用真實的 Lucide Icon 代替 */}
												</div>
											))}
											<div className="w-[1px] h-8 dark:bg-white/20 bg-gray-300 mx-2" />
											<div className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]">
												Publish
											</div>
										</motion.div>
									</motion.div>
								)}

								{/* 情境三：安全權限控管 (模擬成員管理) */}
								{activeId === 'feat-3' && (
									<motion.div
										key="feat-3"
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.3 }}
										className="w-full z-10"
									>
										<div className="mb-6 flex justify-between items-end">
											<div>
												<h5 className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase mb-2">
													Access Control
												</h5>
												<p className="text-2xl font-black dark:text-white text-gray-900 tracking-tight">
													專案成員管理
												</p>
											</div>
											<Lock className="text-gray-400" size={24} />
										</div>

										<div className="space-y-3">
											{/* 模擬成員名單與權限切換 */}
											{[
												{ role: 'Owner', name: 'You', active: true },
												{ role: 'Editor', name: 'Teammate A', active: false },
												{ role: 'Viewer', name: 'Teammate B', active: false },
											].map((user, i) => (
												<div
													key={i}
													className="flex items-center justify-between p-3 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100"
												>
													<div className="flex items-center gap-3">
														<div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
															{user.name[0]}
														</div>
														<span className="text-sm font-bold dark:text-gray-200 text-gray-800">
															{user.name}
														</span>
													</div>
													<div
														className={`text-xs font-bold px-3 py-1 rounded-lg ${user.active ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' : 'dark:bg-white/10 bg-gray-200 dark:text-gray-400 text-gray-600'}`}
													>
														{user.role}
													</div>
												</div>
											))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* 背景裝飾光暈 */}
							<div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none will-change-transform" />
							<div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none will-change-transform" />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Layout, ShieldCheck } from 'lucide-react'

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

	return (
		<section className="py-24 px-6 relative z-10">
			<div className="max-w-6xl mx-auto">
				{/* 標題區 */}
				<div className="mb-16 text-center md:text-left">
					<h2 className="font-bold uppercase tracking-[0.2em] text-blue-500 text-sm mb-4">
						Core Features
					</h2>
					<h3 className="text-4xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900">
						不僅是管理，是藝術。
					</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
					{/* 左側：互動 List */}
					<div className="md:col-span-5 space-y-4">
						{features.map((f) => (
							<motion.div
								key={f.id}
								onClick={() => setActiveId(f.id)}
								className={`group relative cursor-pointer p-6 rounded-[32px] border transition-all duration-500 ${
									activeId === f.id
										? 'dark:bg-white/10 bg-white border-blue-500/50 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]'
										: 'dark:bg-black/20 bg-gray-50/50 border-transparent dark:hover:border-white/10 hover:border-gray-200'
								}`}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								<div className="flex items-center gap-4 relative z-10">
									<div
										className={`p-3 rounded-2xl transition-all duration-500 ${
											activeId === f.id
												? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
												: 'dark:bg-white/5 bg-white text-gray-400 border dark:border-white/10 border-gray-200'
										}`}
									>
										<f.icon size={20} />
									</div>
									<div className="flex-1">
										<h4
											className={`font-bold tracking-tight transition-colors ${
												activeId === f.id ? 'dark:text-white text-gray-900' : 'text-gray-500'
											}`}
										>
											{f.title}
										</h4>
										<AnimatePresence>
											{activeId === f.id && (
												<motion.p
													initial={{ opacity: 0, height: 0, y: -5 }}
													animate={{ opacity: 1, height: 'auto', y: 0 }}
													exit={{ opacity: 0, height: 0 }}
													className="text-sm dark:text-gray-400 text-gray-600 mt-2 leading-relaxed"
												>
													{f.desc}
												</motion.p>
											)}
										</AnimatePresence>
									</div>
								</div>

								{/* Active 時的微弱底色發光 */}
								{activeId === f.id && (
									<motion.div
										layoutId="glow"
										className="absolute inset-0 rounded-[32px] bg-blue-500/[0.03] blur-xl"
									/>
								)}
							</motion.div>
						))}
					</div>

					{/* 右側：展示看板 */}
					<div className="md:col-span-7 sticky top-32">
						<div className="relative p-10 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_32px_64px_-20px_rgba(0,0,0,0.4)] overflow-hidden min-h-[420px] flex flex-col justify-center">
							{/* 內部單線 Input 展示 */}
							<div className="mb-12 relative z-10">
								<label className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 block">
									快速搜尋貢獻者
								</label>
								<div className="relative group">
									<input
										type="text"
										placeholder="Search..."
										className="w-full bg-transparent border-b border-gray-200 dark:border-white/10 py-3 outline-none focus:placeholder:opacity-0 transition-all text-xl font-bold dark:text-white"
									/>
									<motion.div
										className="absolute bottom-0 left-0 h-[2px] bg-blue-500 w-0"
										whileFocus={{ width: '100%' }}
										transition={{ type: 'spring', stiffness: 100, damping: 20 }}
									/>
								</div>
							</div>

							<AnimatePresence mode="wait">
								<motion.div
									key={activeId}
									initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
									animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
									exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
									transition={{ type: 'spring', damping: 25, stiffness: 200 }}
									className="space-y-8 relative z-10"
								>
									<div className="flex justify-between items-end">
										<div>
											<p className="text-5xl font-black tracking-tighter dark:text-white text-gray-900">
												Team Productivity
											</p>
											<p className="text-blue-500 font-bold mt-2 tracking-widest text-xs uppercase">
												Active Analysis
											</p>
										</div>
										<div className="text-right">
											<motion.p
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												className="text-7xl font-black tracking-tighter text-blue-500"
											>
												{features.find((f) => f.id === activeId)?.score}%
											</motion.p>
										</div>
									</div>

									<div className="h-3 w-full dark:bg-white/5 bg-gray-100 rounded-full overflow-hidden border dark:border-white/5 border-gray-200">
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${features.find((f) => f.id === activeId)?.score}%` }}
											transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
											className="h-full bg-linear-to-r from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
										/>
									</div>
								</motion.div>
							</AnimatePresence>

							{/* 背景裝飾光暈 */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
							<div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

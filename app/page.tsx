'use client'

import FeatureSection from '@/components/Home/FeatureSection'
import Navbar from '@/components/navigation/Navbar'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
	const { status } = useSession()
	const router = useRouter()

	const handleSignIn = async () => {
		if (status === 'authenticated') {
			router.push('/user')
		} else {
			try {
				await signIn('google', { callbackUrl: '/user' })
			} catch (error) {
				console.error('Sign in error:', error)
			}
		}
	}

	return (
		<>
			<motion.div
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ type: 'spring', damping: 25, delay: 0.8 }}
				className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 sm:bottom-6 z-[9999] w-[calc(100vw-2rem)] max-w-[280px] pointer-events-none"
			>
				<div className="pointer-events-auto relative p-4 sm:p-5 rounded-[28px] sm:rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/60 bg-white/80 backdrop-blur-3xl shadow-2xl overflow-hidden group">
					<div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
					<div className="relative flex gap-3 items-start">
						<div className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_12px_rgba(234,179,8,0.6)]" />
						<div className="space-y-1">
							<h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-yellow-600 dark:text-yellow-500">
								System Alert
							</h4>
							<p className="text-xs leading-relaxed dark:text-gray-300 text-gray-700 font-medium">
								DoContrib 測試中。請勿使用真實敏感資料。
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0.1 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
				className="cursor-default min-h-screen transition-colors duration-300 dark:bg-gray-950 dark:text-white bg-[#fdfbfa] text-gray-900"
			>
				<Navbar />

				<div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden dark:bg-black/40 bg-[#fdfbfa]">
					<div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center py-24 sm:py-28">
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.1 }}
							className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border dark:border-white/10 border-gray-200 dark:bg-white/5 bg-white/60 backdrop-blur-sm mb-2"
						>
							<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
							<span className="text-[11px] font-bold tracking-[0.15em] uppercase dark:text-gray-400 text-gray-500">
								Beta
							</span>
						</motion.div>

						<motion.h1
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							// clamp 讓字型在任何寬度都不 overflow
							className="font-bold font-geist-sans leading-none tracking-tight dark:text-white text-gray-900"
							style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}
						>
							DoContrib
						</motion.h1>

						<motion.p
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.35 }}
							className="max-w-lg text-sm sm:text-base md:text-lg dark:text-gray-400 text-gray-600 font-medium leading-relaxed px-4"
						>
							讓團隊貢獻更透明、協作更高效的開源平台
						</motion.p>

						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.5 }}
							className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto px-4 sm:px-0"
						>
							<button
								onClick={handleSignIn}
								className="w-full sm:w-auto px-8 py-4 rounded-full font-extrabold text-base transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black bg-gray-950 text-white shadow-xl"
							>
								免費開始使用
							</button>

							<a
								href="#about"
								className="w-full sm:w-auto px-8 py-4 rounded-full font-extrabold text-base transition-all hover:scale-105 active:scale-95 border dark:border-white/10 border-gray-200 dark:hover:bg-white/5 hover:bg-gray-100 text-center"
							>
								了解更多
							</a>
						</motion.div>
					</div>

					<div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 hidden md:block dark:text-white text-gray-900">
						<ChevronDown className="w-6 h-6" />
					</div>
				</div>

				<FeatureSection />

				{/* About Section */}
				<div
					className="relative overflow-hidden border-y dark:bg-black/40 dark:border-white/10 bg-[#fdfbfa] border-gray-200"
					id="about"
				>
					{/* 背景裝飾：增加動態感 */}
					<div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

					<div className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
						>
							{/* 左側：核心論點 (佔 5 格) */}
							<div className="lg:col-span-5 space-y-8">
								<div>
									<h2 className="inline-block px-4 py-1 rounded-full border border-blue-500/30 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 bg-blue-500/5">
										About DoContrib
									</h2>
									<h3 className="text-4xl sm:text-5xl font-black tracking-tight dark:text-white text-gray-900 leading-[1.1]">
										誰說努力
										<br />
										不該被量化？
									</h3>
								</div>

								<div className="space-y-6 text-base sm:text-lg leading-relaxed dark:text-gray-400 text-gray-600 font-medium">
									<p>
										在協作中，最怕的是有人默默 Carry 卻沒人發現，或者有人搭便車卻理所當然。
										<span className="dark:text-white text-gray-900 font-bold"> DoContrib </span>
										是為了終結這種不公而生的「貢獻追蹤引擎」。
									</p>
									<p>
										我們不只管理任務，更紀錄每一幀的付出。透過即時同步的編輯數據與權限模型，讓每一位成員的勞動價值都能轉化為可見的影響力。
									</p>
								</div>

								<div className="flex gap-4">
									<div className="flex -space-x-3">
										{[1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className="w-10 h-10 rounded-full border-2 dark:border-gray-900 border-white bg-gray-200 overflow-hidden shadow-xl"
											>
												<img
													src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
													alt="user"
												/>
											</div>
										))}
									</div>
									<div className="text-sm font-bold dark:text-gray-300 text-gray-600 flex flex-col justify-center">
										<span className="text-blue-500 tracking-tighter">770+ Servers</span>
										<span className="text-[10px] uppercase tracking-widest opacity-60">
											Already Collaborating
										</span>
									</div>
								</div>
							</div>

							{/* 右側：功能特色卡片 (佔 7 格) */}
							<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
								{/* 卡片 1：即時協作 */}
								<div className="group p-8 rounded-[32px] border dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-white border-gray-200 transition-all duration-500 hover:-translate-y-2">
									<div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.1)]">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2.5}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<h4 className="text-xl font-black mb-3 dark:text-white text-gray-900">
										同步無感
									</h4>
									<p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">
										基於 Liveblocks 的 CRDT 技術，讓毫秒級的文字同步成為日常，遠端協作就像坐在對面。
									</p>
								</div>

								{/* 卡片 2：數據驅動 */}
								<div className="group p-8 rounded-[32px] border dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-white border-gray-200 transition-all duration-500 hover:-translate-y-2">
									<div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.1)]">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2.5}
												d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
											/>
										</svg>
									</div>
									<h4 className="text-xl font-black mb-3 dark:text-white text-gray-900">
										貢獻透視
									</h4>
									<p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">
										自動解析成員參與度，將枯燥的修改紀錄轉化為精美的貢獻圖表。
									</p>
								</div>

								{/* 卡片 3：安全性 */}
								<div className="group p-8 rounded-[32px] border dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-white border-gray-200 transition-all duration-500 hover:-translate-y-2">
									<div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.1)]">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2.5}
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
									</div>
									<h4 className="text-xl font-black mb-3 dark:text-white text-gray-900">
										嚴密控管
									</h4>
									<p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">
										承襲 Discord Bot 等級的權限架構，確保每一筆數據都在正確的人手中。
									</p>
								</div>

								{/* 卡片 4：開放原始碼 */}
								<div className="group p-8 rounded-[32px] border dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-white border-gray-200 transition-all duration-500 hover:-translate-y-2">
									<div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(249,115,22,0.1)]">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2.5}
												d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
											/>
										</svg>
									</div>
									<h4 className="text-xl font-black mb-3 dark:text-white text-gray-900">開源魂</h4>
									<p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed font-medium">
										不只是工具，是社群。我們擁抱開源，讓全世界的開發者都能參與這場協作革命。
									</p>
								</div>
							</div>
						</motion.div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="py-16 sm:py-24 px-4 sm:px-6 text-center border-t dark:bg-black/60 dark:border-white/10 bg-[#fdfbfa] border-gray-200">
					<div className="max-w-2xl mx-auto">
						<h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 dark:text-white text-gray-900">
							準備好提升團隊效率了嗎？
						</h3>
						<p className="mb-8 sm:mb-10 text-sm sm:text-base md:text-lg dark:text-gray-400 text-gray-600 font-medium">
							加入數百個使用 DoContrib 的團隊，開始透明化您的協作流程。
						</p>
						<button
							onClick={handleSignIn}
							className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full font-extrabold text-base sm:text-lg md:text-xl transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:shadow-[0_0_30px_rgba(255,255,255,0.15)] bg-gray-950 text-white hover:bg-black shadow-xl"
						>
							現在就免費加入
						</button>
					</div>
				</div>

				{/* Footer */}
				<footer className="relative border-t overflow-hidden dark:bg-linear-to-b dark:from-black/80 dark:to-black dark:border-white/10 dark:text-white bg-linear-to-b from-gray-50 to-white border-gray-200 text-gray-900">
					<div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
						<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
							{/* Brand block — 手機佔滿兩欄 */}
							<div className="col-span-2 sm:col-span-2 md:col-span-2">
								<h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-linear-to-r dark:from-white dark:to-gray-400 from-gray-900 to-gray-600 bg-clip-text text-transparent">
									DoContrib
								</h3>
								<p className="text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm dark:text-gray-400 text-gray-600">
									讓團隊貢獻更透明、協作更高效的開源平台。打造更好的團隊協作體驗。
								</p>
								<div className="flex gap-3">
									{[
										{ icon: Github, href: 'https://github.com/DoContrib', label: 'GitHub' },
										{ icon: Twitter, href: '#', label: 'Twitter' },
										{ icon: Linkedin, href: '#', label: 'LinkedIn' },
										{ icon: Mail, href: 'mailto:docontrib@gmail.com', label: 'Email' },
									].map((social) => (
										<a
											key={social.label}
											href={social.href}
											className="w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 hover:-translate-y-0.5"
											aria-label={social.label}
										>
											<social.icon className="w-5 h-5" />
										</a>
									))}
								</div>
							</div>

							{/* Link groups — 手機各佔一欄 */}
							{[
								{
									title: '產品',
									links: [
										{ name: '功能', href: '/features' },
										{ name: '定價', href: '/pricing' },
										{ name: '更新日誌', href: '/changelog' },
										{ name: '文件', href: '/docs' },
									],
								},
								{
									title: '公司',
									links: [
										{ name: '關於我們', href: '/about' },
										{ name: '部落格', href: '/blog' },
										{ name: '職缺', href: '/jobs' },
										{ name: '聯絡我們', href: '/contact' },
									],
								},
								{
									title: '法律',
									links: [
										{ name: '隱私權政策', href: '/privacy-policy' },
										{ name: '服務條款', href: '/terms-of-service' },
										{ name: 'Cookie 政策', href: '/cookies' },
									],
								},
							].map((section) => (
								<div key={section.title} className="col-span-1">
									<h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base dark:text-white text-gray-900">
										{section.title}
									</h4>
									<ul className="space-y-2 sm:space-y-3">
										{section.links.map((link) => (
											<li key={link.name}>
												<a
													href={link.href}
													className="text-xs sm:text-sm inline-block hover:translate-x-1 transition-transform duration-200 dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900"
												>
													{link.name}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>

						<div className="pt-6 sm:pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 border-gray-200 dark:border-white/10">
							<p className="text-xs sm:text-sm dark:text-gray-400 text-gray-600">
								© {new Date().getFullYear()} DoContrib. All rights reserved.
							</p>
							<div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm dark:text-gray-400 text-gray-600">
								<motion.span
									whileHover={{ scale: 1.05 }}
									className="cursor-pointer dark:hover:text-white hover:text-gray-900"
								>
									Made with ❤️ in Taiwan
								</motion.span>
							</div>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent dark:via-white/20 via-gray-300" />
				</footer>
			</motion.div>
		</>
	)
}

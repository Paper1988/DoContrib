'use client'

import Navbar from '@/components/navigation/Navbar'
import { Alert, CssBaseline } from '@mui/material'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
	const [isDark, setIsDark] = useState(false)
	const [isLoaded, setIsLoaded] = useState(false)

	const session = useSession()
	const router = useRouter()

	useEffect(() => {
		// Only run the following code after the component has mounted in the client
		// This avoids calling setState synchronously inside the effect
		requestAnimationFrame(() => {
			setIsLoaded(true)
			const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
			setIsDark(darkMode)
		})
	}, [])

	const toggleTheme = () => {
		setIsDark(!isDark)
	}

	const handleSignIn = async () => {
		if (session.status == 'authenticated') {
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
		<motion.div
		initial={{ opacity: 0.1 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.4 }}
		className={`cursor-default min-h-screen transition-colors duration-300 dark:bg-gray-950 dark:text-white bg-[#fdfbfa] text-gray-900`}
		>
			<CssBaseline enableColorScheme />

			<Navbar isDark={isDark} toggleTheme={toggleTheme} />
			<div className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden dark:bg-black/40 bg-linear-to-br`}>
				<Alert severity="warning" className={`fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 md:left-auto md:right-4 md:max-w-md z-50 dark:bg-black/80 dark:border-yellow-500/50 dark:text-white bg-white/90 border-yellow-400/50 text-gray-900 backdrop-blur-md border rounded-xl shadow-2xl`}>
					<p className="text-xs sm:text-sm text-gray-900">This is a demo site for DoContrib. It&apos;s a work in progress and not ready for production. Please don&apos;t use real data.</p>
				</Alert>

					<div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-6 sm:gap-8 text-center py-16 sm:py-20 ">
						<motion.h1
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className={`font-bold font-geist-sans text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl dark:text-white text-gray-900`}
						>
							DoContrib
							</motion.h1>
					</div>

				<div className={`absolute bottom-10 left-1/2 -translate-x-1/2 text-xl animate-bounce z-10 hidden md:block dark:text-white text-gray-900`}>
					<i className="fa fa-arrow-down">▼</i>
				</div>
			</div>

			{/* About Section */}
			<div className={`relative backdrop-blur-sm border-y dark:bg-black/40 dark:border-white/10 bg-[#fdfbfa] border-gray-200`} id="about">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="space-y-12 sm:space-y-16"
					>
						<div className="text-center md:text-left">
							<h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-linear-to-r dark:from-white dark:to-gray-400 from-gray-900 to-gray-600 bg-clip-text text-transparent`}>DoContrib 是什麼？</h2>
							<div className={`space-y-3 sm:space-y-4 text-base sm:text-lg leading-relaxed dark:text-gray-300 text-gray-700`}>
								<p>
									DoContrib 是一個開源的團隊貢獻追蹤和管理平台。我們的目標是幫助團隊更有效地追蹤和管理貢獻，提高團隊協作效率。
								</p>
								<p>我們提供了多種功能，包括貢獻進度追蹤、任務分配、團隊成員管理等，讓您能夠輕鬆地管理團隊，提高工作效率。</p>
								<p>此外，DoContrib 還提供了詳細的數據分析和報表，讓您能夠更好地了解團隊的工作狀況，做出更明智的決策。</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
							<div className={`p-6 sm:p-8 rounded-2xl border transition-colors dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-white/80 border-gray-200 hover:bg-white`}>
								<h2 className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 dark:text-white text-gray-900`}>我們的使命</h2>
								<p className={`leading-relaxed dark:text-gray-300 text-gray-700`}>
									我們的使命是讓每個團隊都能更好地追蹤和管理貢獻，提高工作效率，實現更好的團隊合作。
								</p>
							</div>

							<div className={`p-6 sm:p-8 rounded-2xl border transition-colors dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-white/80 border-gray-200 hover:bg-white`}>
								<h2 className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 dark:text-white text-gray-900`}>我們的價值觀</h2>
								<ul className="grid grid-cols-1 gap-3">
									{['用戶至上', '開源透明', '持續創新', '團隊合作'].map((item) => (
										<li key={item} className={`flex items-center gap-2 dark:text-gray-300 text-gray-700`}>
											<span className={`w-1.5 h-1.5 rounded-full dark:bg-white bg-gray-900`} />
											{item}
										</li>
									))}
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			<div className={`py-16 sm:py-24 px-4 sm:px-6 text-center border-t dark:bg-black/60 dark:border-white/10 bg-white border-gray-200`}>
				<div className="max-w-2xl mx-auto">
					<h3 className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-6 sm:mb-8 dark:text-white text-gray-900`}>準備好提升團隊效率了嗎？</h3>
					<p className={`mb-8 sm:mb-10 text-base sm:text-lg dark:text-gray-400 text-gray-600`}>
						加入數百個使用 DoContrib 的團隊，開始透明化您的協作流程。
					</p>
					<button
						onClick={handleSignIn}
						className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 rounded-full font-extrabold text-lg sm:text-xl transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:shadow-[0_0_30px_rgba(255,255,255,0.15)] bg-gray-900 text-white hover:bg-gray-800 shadow-lg`}
					>
						現在就免費加入
					</button>
				</div>
			</div>

			<footer
				className="relative border-t overflow-hidden dark:bg-linear-to-b dark:from-black/80 dark:to-black dark:border-white/10 dark:text-white bg-linear-to-b from-gray-50 to-white border-gray-200 text-gray-900"
			>
				<div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
						<div className="sm:col-span-2">
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
									{ icon: Mail, href: 'mailto:docontrib@gmail.com', label: 'Email' }
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

						{[
							{
								title: '產品',
								links: [
									{ name: '功能', href: '/features' },
									{ name: '定價', href: '/pricing' },
									{ name: '更新日誌', href: '/changelog' },
									{ name: '文件', href: '/docs' }
								]
							},
							{
								title: '公司',
								links: [
									{ name: '關於我們', href: '/about' },
									{ name: '部落格', href: '/blog' },
									{ name: '職缺', href: '/jobs' },
									{ name: '聯絡我們', href: '/contact' }
								]
							},
							{
								title: '法律',
								links: [
									{ name: '隱私權政策', href: '/privacy-policy' },
									{ name: '服務條款', href: '/terms-of-service' },
									{ name: 'Cookie 政策', href: '/cookies' }
								]
							}
						].map((section) => (
							<div
								key={section.title}
								className="sm:col-span-1"
							>
								<h4 className="font-semibold mb-3 sm:mb-4 dark:text-white text-gray-900">{section.title}</h4>
								<ul className="space-y-2 sm:space-y-3">
									{section.links.map((link) => (
										<li key={link.name}>
											<a
												href={link.href}
												className="text-sm inline-block hover:translate-x-1 transition-transform duration-200 dark:text-gray-400 dark:hover:text-white text-gray-600 hover:text-gray-900"
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
								className={`cursor-pointer dark:hover:text-white hover:text-gray-900`}
							>
								Made with ❤️ in Taiwan
							</motion.span>
						</div>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent dark:via-white/20 via-gray-300" />
			</footer>

		</motion.div>
	)
}

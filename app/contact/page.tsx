'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, MessageCircle } from 'lucide-react'

export default function Contact() {
	return (
		<div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden dark:bg-gray-950 bg-[#fdfbfa] p-6">
			{/* 背景裝飾：極淡網格與動態光暈 */}
			<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative z-10 w-full max-w-2xl"
			>
				{/* 標題排版 */}
				<div className="text-center mb-12">
					<h2 className="font-bold uppercase tracking-[0.2em] text-blue-500 text-sm mb-4">
						Get In Touch
					</h2>
					<h1 className="text-5xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900">
						聯繫我們
					</h1>
					<p className="mt-4 dark:text-gray-400 text-gray-600 font-medium">
						如果您有任何問題或建議，請隨時與我們聯繫。
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
					{/* 左側：聯絡卡片 */}
					<div className="space-y-4">
						{[
							{
								title: '電子郵件',
								value: 'docontrib@gmail.com',
								href: 'mailto:docontrib@gmail.com',
								icon: Mail,
								color: 'bg-blue-500',
							},
							{
								title: 'Discord 社群',
								value: '加入伺服器',
								href: 'https://discord.gg/EqA35cDEW5',
								icon: MessageCircle,
								color: 'bg-indigo-500',
							},
						].map((item) => (
							<Link key={item.title} href={item.href} target="_blank">
								<motion.div
									whileHover={{ scale: 1.02, y: -5 }}
									whileTap={{ scale: 0.98 }}
									className="p-6 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl transition-all group mb-4"
								>
									<div className="flex items-center gap-4">
										<div className={`p-3 rounded-2xl ${item.color} text-white shadow-lg`}>
											<item.icon size={20} />
										</div>
										<div>
											<p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
												{item.title}
											</p>
											<p className="font-bold dark:text-white text-gray-900 group-hover:text-blue-500 transition-colors">
												{item.value}
											</p>
										</div>
									</div>
								</motion.div>
							</Link>
						))}
					</div>

					{/* 右側：Discord Widget (磨砂質感包裹) */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="rounded-[32px] border dark:border-white/10 border-gray-200 overflow-hidden dark:bg-black/20 bg-gray-50 flex items-center justify-center p-2 shadow-2xl"
					>
						<iframe
							src="https://discord.com/widget?id=1333687662636302357&theme=dark"
							width="100%"
							height="400"
							sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
							className="rounded-[24px]"
						/>
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}

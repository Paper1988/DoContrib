'use client'

import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
	return (
		<div className="relative min-h-screen w-full dark:bg-gray-950 bg-[#fdfbfa] overflow-x-hidden">
			{/* 背景裝飾：規範內的極淡網格與動態光暈 */}
			<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] pointer-events-none" />
			<div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
			<div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

			<main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
				{/* 標題區 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-20 text-center md:text-left"
				>
					<h2 className="font-bold uppercase tracking-[0.2em] text-blue-500 text-sm mb-4">
						Legal Documents
					</h2>
					<h1 className="text-5xl md:text-7xl font-black tracking-tight dark:text-white text-gray-900">
						隱私權政策
					</h1>
					<p className="mt-6 dark:text-gray-400 text-gray-600 font-medium text-lg">
						我們重視您的隱私，就像重視程式碼的簡潔一樣。
					</p>
				</motion.div>

				{/* 內容區塊 */}
				<section className="space-y-12">
					{[
						{
							title: '資料收集',
							content:
								'我們收集的資訊包括基本個人資料（姓名、電子郵件）、使用者行為數據、系統日誌以及裝置資訊。',
							list: ['基本個人資料', '使用者行為數據', '系統日誌資訊', '裝置資訊'],
						},
						{
							title: '資料使用',
							content: '我們使用這些資訊來改善服務、個人化體驗，並與您進行溝通與分析趨勢。',
							list: ['改善服務品質', '個人化使用者體驗', '需求溝通與回應', '數據分析與優化'],
						},
						{
							title: '資料保護',
							content: '我們採取最強悍的技術組織措施，防止您的資料遭到未經授權的存取。',
						},
						{
							title: '第三方服務',
							content: '我們可能包含第三方連結，他們有自己的隱私政策，建議您詳閱。',
						},
					].map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="group relative p-8 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
						>
							<div className="absolute top-8 left-0 w-1 h-8 bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />

							<h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900 tracking-tight">
								{item.title}
							</h2>
							<p className="dark:text-gray-400 text-gray-600 leading-relaxed mb-4 font-medium">
								{item.content}
							</p>

							{item.list && (
								<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{item.list.map((li) => (
										<li
											key={li}
											className="flex items-center gap-2 dark:text-gray-300 text-gray-700 text-sm"
										>
											<div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
											{li}
										</li>
									))}
								</ul>
							)}
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

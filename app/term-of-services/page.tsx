'use client'

import { motion } from 'framer-motion'
import { Scale, Terminal, ShieldAlert, FileText } from 'lucide-react'

export default function TOS() {
	return (
		<div className="relative min-h-screen w-full dark:bg-gray-950 bg-[#fdfbfa] overflow-x-hidden">
			{/* 極淡網格與動態光暈 */}
			<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-black/[0.02] pointer-events-none" />
			<div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

			<main className="relative z-10 max-w-4xl mx-auto px-6 py-32">
				{/* 標題區 */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-20"
				>
					<h2 className="font-bold uppercase tracking-[0.2em] text-blue-500 text-sm mb-4">
						Agreement
					</h2>
					<h1 className="text-5xl md:text-7xl font-black tracking-tight dark:text-white text-gray-900">
						服務條款
					</h1>
					<p className="mt-6 dark:text-gray-400 text-gray-600 font-medium text-lg leading-relaxed">
						歡迎來到 DoContrib。使用我們的服務，即代表您同意以下約定。
					</p>
				</motion.div>

				{/* 條款內容 */}
				<section className="space-y-8">
					{[
						{
							title: '接受條款',
							desc: '使用本服務即表示您同意遵守這些條款。如果您不同意這些條款，請勿使用本服務。',
							icon: Scale,
						},
						{
							title: '服務說明',
							desc: 'DoContrib 提供團隊貢獻追蹤和管理服務。我們保留隨時修改、暫停或終止服務的權利。',
							icon: Terminal,
						},
						{
							title: '用戶責任',
							desc: '身為團隊的一員，您有義務維護健康的協作環境：',
							list: [
								'遵守所有適用的法律和規定',
								'維護帳戶安全與私鑰',
								'提供準確且真實的資訊',
								'尊重其他用戶的權利',
							],
							icon: ShieldAlert,
						},
						{
							title: '智慧財產權與免責',
							desc: '本服務內容受法律保護。我們按「現狀」提供服務，不對特定用途之損失承諾賠償。',
							icon: FileText,
						},
					].map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="group relative p-8 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-500/30 transition-all duration-500"
						>
							<div className="flex items-start gap-6">
								<div className="hidden sm:flex p-4 rounded-2xl dark:bg-white/5 bg-gray-100 text-blue-500 group-hover:scale-110 transition-transform">
									<item.icon size={24} />
								</div>

								<div className="flex-1">
									<h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900 tracking-tight">
										{item.title}
									</h2>
									<p className="dark:text-gray-400 text-gray-600 leading-relaxed mb-4 font-medium">
										{item.desc}
									</p>

									{item.list && (
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
											{item.list.map((li) => (
												<div
													key={li}
													className="flex items-center gap-3 p-3 rounded-2xl dark:bg-white/5 bg-gray-50 border dark:border-white/5 border-gray-100"
												>
													<div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
													<span className="text-sm dark:text-gray-300 text-gray-700 font-semibold">
														{li}
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

				<footer className="mt-24 pt-12 border-t dark:border-white/10 border-gray-200 text-center">
					<p className="dark:text-gray-500 text-gray-400 text-sm font-medium">
						如果您對服務條款有任何疑問，請透過電子郵件與我們聯繫。
					</p>
					<p className="mt-2 text-xs text-gray-400">最後修訂日期：2026年3月12日</p>
				</footer>
			</main>
		</div>
	)
}

'use client'

import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
	const [loading, setLoading] = useState(false)
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/user'

	const handleGoogleSignUp = async () => {
		setLoading(true)
		try {
			await signIn('google', { callbackUrl })
		} catch (error) {
			console.error('Sign up error:', error)
			setLoading(false)
		}
	}

	return (
		<section className="relative flex min-h-screen items-center justify-center bg-[#fdfbfa] px-4 dark:bg-gray-950 overflow-hidden">
			{/* 背景裝飾：加強霓虹感 */}
			<div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />
			<div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none animate-pulse" />
			<div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[130px] rounded-full pointer-events-none" />

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ type: 'spring', damping: 20 }}
				className="relative z-10 w-full max-w-[400px]"
			>
				{/* 玻璃擬態容器：移除表單後，空間感更輕盈 */}
				<div className="p-10 rounded-[40px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] text-center">
					<div className="flex flex-col items-center mb-10">
						<Link href="/" className="group relative">
							{/* Logo 背後的微光 */}
							<div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
							<LogoIcon />
						</Link>
						<h1 className="mt-8 text-4xl font-black tracking-tight text-black dark:text-white">
							DoContrib
						</h1>
						<p className="mt-3 text-sm font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400">
							Join the Synergy
						</p>
					</div>

					<div className="space-y-6">
						{/* 唯一的超能 Google 登入按鈕 */}
						<Button
							onClick={handleGoogleSignUp}
							disabled={loading}
							className="group relative w-full h-16 overflow-hidden rounded-[24px] border-2 dark:border-white/10 border-gray-100 bg-white dark:bg-white/5 hover:border-blue-500/50 transition-all duration-500"
						>
							{/* 按鈕內部的動態光流 */}
							<div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

							<div className="relative flex items-center justify-center gap-4">
								{loading ? (
									<div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
								) : (
									<svg width="24" height="24" viewBox="0 0 256 262">
										<path
											fill="#4285f4"
											d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
										/>
										<path
											fill="#34a853"
											d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
										/>
										<path
											fill="#fbbc05"
											d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
										/>
										<path
											fill="#eb4335"
											d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
										/>
									</svg>
								)}
								<span className="text-lg font-black dark:text-white text-gray-900">
									{loading ? '連結中...' : '使用 Google 帳號開始'}
								</span>
							</div>
						</Button>

						<p className="text-[10px] leading-relaxed text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest px-6">
							點擊上方按鈕即表示您同意本站的 <br />
							<Link href="/terms" className="text-blue-500 hover:text-blue-400 transition-colors">
								服務條款
							</Link>{' '}
							與{' '}
							<Link href="/privacy" className="text-blue-500 hover:text-blue-400 transition-colors">
								隱私權政策
							</Link>
						</p>
					</div>
				</div>
			</motion.div>
		</section>
	)
}

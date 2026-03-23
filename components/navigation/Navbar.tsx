'use client'

import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navbar() {
	const router = useRouter()
	const session = useSession()

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			/* 修正：使用 z-[100] (自定義數值需加中括號) 確保層級 */
			className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 pointer-events-none"
		>
			<div className="max-w-7xl mx-auto rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/60 backdrop-blur-3xl px-6 py-2.5 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 pointer-events-auto relative">
				<div
					className="flex items-center gap-3 cursor-pointer group"
					onClick={() => router.push('/')}
				>
					<div className="relative">
						<Image
							src="/DoContrib.jpg"
							alt="Logo"
							width={32}
							height={32}
							className="rounded-full ring-2 ring-blue-500/20 transition-transform duration-500 group-hover:scale-110"
						/>
						<div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
					<p className="text-lg font-black tracking-tighter dark:text-white text-black">
						DoContrib
					</p>
				</div>

				<div className="flex items-center gap-6">
					<div className="hidden md:flex items-center gap-8">
						{['Features', 'About'].map((item) => (
							<a
								key={item}
								href={`#${item.toLowerCase()}`}
								className="relative text-[10px] font-bold tracking-[0.2em] uppercase dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-black transition-colors group"
							>
								{item}
								<span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-500 transition-all group-hover:w-full" />
							</a>
						))}
						<a
							key={'contact'}
							href={`/contact`}
							className="relative text-[10px] font-bold tracking-[0.2em] uppercase dark:text-gray-400 dark:hover:text-white text-gray-500 hover:text-black transition-colors group"
						>
							Contact
							<span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-500 transition-all group-hover:w-full" />
						</a>
					</div>

					<div className="flex items-center gap-3">
						<ThemeToggle />
						<Button
							onClick={() => (session.data ? router.push('/user') : signIn('google'))}
							className="relative overflow-hidden px-6 py-5 rounded-full font-black tracking-tight transition-all text-sm bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 group shadow-xl"
						>
							<span className="relative">開始使用</span>
						</Button>
					</div>
				</div>
			</div>
		</motion.nav>
	)
}

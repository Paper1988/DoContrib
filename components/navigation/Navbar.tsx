'use client'

import ThemeToggle from '@/components/navigation/ThemeToggle'
import { Button } from '@/components/ui/button'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface NavbarProps {
	isDark: boolean
	toggleTheme: () => void
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
	const router = useRouter()
	const session = useSession()

	const handleSignIn = async () => {
		if (session.data) {
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
		<nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-300 bg-white/80 dark:bg-gray-950/80 border-gray-200 dark:border-gray-800">
			<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3 font-bold text-lg tracking-tight">
					<Image
						src="/DoContrib.jpg"
						alt="Logo"
						width={32}
						height={32}
						className="rounded-full dark:bg-white bg-black"
					/>
					<p className="text-lg dark:text-white text-black">DoContrib</p>
				</div>
				<div className="flex items-center gap-4">
					<ThemeToggle />
					<Button
						onClick={handleSignIn}
						className="px-4 py-2 rounded-full font-semibold transition-all text-sm bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
					>
						開始使用
					</Button>
				</div>
			</div>
		</nav>
	)
}

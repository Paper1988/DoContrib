'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => setMounted(true), [])

	if (!mounted) return <div className="w-10 h-10" />

	const isDark =
		theme === 'dark' ||
		(theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 dark:bg-white/5 bg-gray-100 dark:hover:bg-white/10 hover:bg-gray-200 border dark:border-white/5 border-gray-200 shadow-sm"
			aria-label="Switch Theme"
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={isDark ? 'dark' : 'light'}
					initial={{ y: 10, opacity: 0, rotate: -45 }}
					animate={{ y: 0, opacity: 1, rotate: 0 }}
					exit={{ y: -10, opacity: 0, rotate: 45 }}
					transition={{ type: 'spring', damping: 20, stiffness: 300 }}
					className="dark:text-white text-gray-700"
				>
					{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
				</motion.div>
			</AnimatePresence>

			{/* 隱約的發光背景效果 */}
			<div className="absolute inset-0 rounded-xl bg-blue-500/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
		</motion.button>
	)
}

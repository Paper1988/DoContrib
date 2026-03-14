'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SunIcon, MoonIcon } from '@/icons' // 延用你的 icons

export function ThemeToggle() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')

	useEffect(() => {
		const savedTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark'
		if (savedTheme) setTheme(savedTheme)
	}, [])

	function changeTheme() {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		document.documentElement.setAttribute('data-theme', newTheme)
		setTheme(newTheme)
	}

	return (
		<motion.button
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
			onClick={changeTheme}
			className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 dark:bg-white/10 bg-black/5 dark:hover:bg-white/20 hover:bg-black/10 border border-transparent dark:hover:border-white/10"
			aria-label="Switch Theme"
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={theme}
					initial={{ y: 10, opacity: 0, rotate: -45 }}
					animate={{ y: 0, opacity: 1, rotate: 0 }}
					exit={{ y: -10, opacity: 0, rotate: 45 }}
					transition={{ type: 'spring', damping: 20, stiffness: 300 }}
					className="dark:text-white text-black"
				>
					{theme === 'dark' ? (
						<SunIcon style={{ width: '18px' }} />
					) : (
						<MoonIcon style={{ width: '18px' }} />
					)}
				</motion.div>
			</AnimatePresence>

			<div className="absolute inset-0 rounded-xl bg-blue-500/10 blur-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
		</motion.button>
	)
}

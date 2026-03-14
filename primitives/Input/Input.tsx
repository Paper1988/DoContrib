'use client'

import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
	({ className, ...props }, ref) => {
		return (
			<div className="relative w-full group">
				<input
					ref={ref}
					className={clsx(
						// 基礎：去背景、去預設邊框
						'w-full bg-transparent px-1 py-2 text-sm outline-none transition-all duration-300',
						// 文字顏色：與你的 PageWrapper 宇宙對齊
						'dark:text-white/90 text-gray-900 placeholder:dark:text-white/20 placeholder:text-gray-400',
						// 禁用狀態
						'disabled:opacity-30 disabled:cursor-not-allowed',
						className
					)}
					{...props}
				/>

				<div className="absolute bottom-0 left-0 h-px w-full dark:bg-white/10 bg-gray-900/10 transition-all duration-500" />

				<div className="absolute bottom-0 left-0 h-px w-0 group-focus-within:w-full dark:bg-blue-400 bg-blue-600 transition-all duration-500 ease-in-out shadow-[0_1px_8px_rgba(59,130,246,0.3)]" />
			</div>
		)
	}
)

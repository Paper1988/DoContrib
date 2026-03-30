'use client'

import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				className={clsx(
					'w-full bg-transparent px-1 py-2 text-sm outline-none transition-colors duration-200',
					'dark:text-white text-gray-900',
					'placeholder:dark:text-gray-600 placeholder:text-gray-400',
					'disabled:opacity-40 disabled:cursor-not-allowed',
					className
				)}
				{...props}
			/>
		)
	}
)

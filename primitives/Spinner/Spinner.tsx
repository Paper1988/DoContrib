'use client'

import clsx from 'clsx'
import { ComponentProps } from 'react'

export interface Props extends ComponentProps<'svg'> {
	size?: number
}

export function Spinner({ size = 16, className, ...props }: Props) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('animate-spin dark:text-white/40 text-gray-900/40', className)}
			{...props}
		>
			<path
				d="M14 8a6 6 0 1 1-6-6"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}

export function DocumentSpinner() {
	return (
		<div className="flex items-center justify-center w-full h-full min-h-[200px]">
			<div className="relative flex items-center justify-center">
				<div className="absolute inset-0 blur-2xl dark:bg-white/5 bg-gray-900/5 rounded-full" />
				<Spinner size={32} className="relative z-10 dark:text-white/60 text-gray-900/60" />
			</div>
		</div>
	)
}

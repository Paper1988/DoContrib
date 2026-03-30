'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { ComponentProps, ReactNode, forwardRef } from 'react'

interface Props {
	variant?: 'primary' | 'secondary' | 'subtle' | 'destructive'
	icon?: ReactNode
}

const getButtonClass = (
	variant: string,
	hasIcon: boolean,
	hasChildren: boolean,
	className?: string
) =>
	clsx(
		'inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200',
		'rounded-lg active:scale-[0.97]',
		'disabled:opacity-40 disabled:pointer-events-none',
		hasIcon && !hasChildren ? 'p-2' : 'px-4 py-2',
		{
			'dark:bg-white dark:text-black bg-gray-900 text-white hover:opacity-90 shadow-sm':
				variant === 'primary',
			'dark:bg-white/5 bg-gray-100 dark:text-gray-300 text-gray-700 border dark:border-white/8 border-gray-200 dark:hover:bg-white/10 hover:bg-gray-200':
				variant === 'secondary',
			'bg-transparent dark:text-gray-400 text-gray-500 dark:hover:bg-white/5 hover:bg-gray-100 dark:hover:text-white hover:text-gray-900':
				variant === 'subtle',
			'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20':
				variant === 'destructive',
		},
		className
	)

export const Button = forwardRef<HTMLButtonElement, ComponentProps<'button'> & Props>(
	({ variant = 'primary', icon, children, className, ...props }, ref) => (
		<button ref={ref} className={getButtonClass(variant, !!icon, !!children, className)} {...props}>
			{icon && <span className="flex items-center justify-center">{icon}</span>}
			{children && <span>{children}</span>}
		</button>
	)
)

export function LinkButton({
	variant = 'primary',
	icon,
	children,
	className,
	...props
}: ComponentProps<typeof Link> & Props) {
	return (
		<Link className={getButtonClass(variant, !!icon, !!children, className)} {...props}>
			{icon && <span className="flex items-center justify-center">{icon}</span>}
			{children && <span>{children}</span>}
		</Link>
	)
}

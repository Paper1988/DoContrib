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
		'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-out',
		'rounded-xl active:scale-[0.96] hover:scale-[1.02]',
		'disabled:opacity-30 disabled:pointer-events-none',

		hasIcon && !hasChildren ? 'p-2' : 'px-4 py-2 text-sm',

		{
			'dark:bg-white dark:text-black bg-gray-900 text-white shadow-lg hover:shadow-white/10':
				variant === 'primary',

			'dark:bg-white/5 bg-gray-900/5 dark:text-white/80 text-gray-800 border dark:border-white/10 border-gray-900/10 dark:hover:bg-white/10 hover:bg-gray-900/10':
				variant === 'secondary',

			'bg-transparent dark:text-gray-400 text-gray-500 dark:hover:bg-white/5 hover:bg-gray-900/5':
				variant === 'subtle',

			'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white':
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

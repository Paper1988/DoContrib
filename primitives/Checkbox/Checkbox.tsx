'use client'

import clsx from 'clsx'
import { ChangeEvent, ComponentProps, useCallback, useState } from 'react'
import { CheckIcon } from '@/icons'
import { motion, AnimatePresence } from 'framer-motion'

interface Props extends Omit<ComponentProps<'div'>, 'onChange'> {
	initialValue?: boolean
	onValueChange?: (value: boolean) => void
	checked?: boolean
	name?: string
	disabled?: boolean
}

export function Checkbox({
	initialValue = false,
	onValueChange,
	checked,
	name,
	disabled = false,
	id,
	className,
	...props
}: Props) {
	const [internalChecked, setInternalChecked] = useState(initialValue)
	const isChecked = checked !== undefined ? checked : internalChecked

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (disabled) return
			setInternalChecked(event.target.checked)
			onValueChange?.(event.target.checked)
		},
		[onValueChange, disabled]
	)

	return (
		<div
			className={clsx(
				'relative inline-flex items-center justify-center shrink-0 select-none',
				'w-[18px] h-[18px]',
				disabled && 'opacity-30 cursor-not-allowed',
				className
			)}
			{...props}
		>
			<input
				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
				type="checkbox"
				name={name}
				id={id}
				checked={isChecked}
				onChange={handleChange}
				disabled={disabled}
			/>

			<div
				className={clsx(
					'absolute inset-0 rounded-[5px] border transition-all duration-300 ease-out z-10',
					!isChecked
						? 'dark:bg-white/[0.03] bg-black/[0.03] dark:border-white/10 border-black/10'
						: 'dark:bg-white bg-gray-900 dark:border-white border-gray-900 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
				)}
			/>

			<AnimatePresence>
				{isChecked && (
					<motion.div
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 500, damping: 30 }}
						className="relative z-10"
					>
						<CheckIcon className={clsx('w-3 h-3 stroke-[3px]', 'dark:text-black text-white')} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

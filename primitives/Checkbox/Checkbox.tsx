'use client'

import clsx from 'clsx'
import { ChangeEvent, ComponentProps, useCallback, useEffect, useState } from 'react'
import { CheckIcon } from '@/icons'

interface Props extends ComponentProps<'div'> {
	initialValue: boolean
	onValueChange?: (value: boolean) => void
	checked: boolean
	name?: string
	disabled?: boolean
}

export function Checkbox({
	initialValue = false,
	onValueChange = () => {},
	checked = false,
	name,
	disabled = false,
	id,
	className,
	...props
}: Props) {
	const [internalChecked, setInternalChecked] = useState(initialValue)

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			if (disabled) return
			setInternalChecked(event.target.checked)
			onValueChange(event.target.checked)
		},
		[onValueChange, disabled]
	)

	useEffect(() => {
		setInternalChecked(checked)
	}, [checked])

	return (
		<div
			className={clsx(
				'relative inline-flex items-center justify-center w-5 h-5 group',
				disabled && 'opacity-30',
				className
			)}
			{...props}
		>
			<input
				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
				type="checkbox"
				name={name}
				id={id}
				checked={internalChecked}
				onChange={handleChange}
				disabled={disabled}
			/>

			<div
				className={clsx(
					'w-full h-full rounded-[6px] border flex items-center justify-center transition-all duration-500',
					!internalChecked &&
						'dark:bg-white/5 bg-gray-900/5 dark:border-white/10 border-gray-900/10 group-hover:dark:border-white/25 group-hover:border-gray-900/20',
					internalChecked &&
						'dark:bg-white bg-gray-900 dark:border-white border-gray-900 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
				)}
			>
				<CheckIcon
					className={clsx(
						'w-3.5 h-3.5 transition-all duration-300 transform',
						internalChecked
							? 'scale-100 opacity-100 dark:text-black text-white'
							: 'scale-50 opacity-0'
					)}
				/>
			</div>
		</div>
	)
}

'use client'

import * as RadixSelect from '@radix-ui/react-select'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { CheckIcon, SelectIcon } from '@/icons'

interface Item extends RadixSelect.SelectItemProps {
	value: string
	title?: string
	description?: string
}

interface Props extends Omit<RadixSelect.SelectProps, 'onValueChange'> {
	variant?: 'regular' | 'subtle'
	initialValue?: string
	value?: string
	items: Item[]
	onChange?: RadixSelect.SelectProps['onValueChange']
	placeholder?: RadixSelect.SelectValueProps['placeholder']
	className?: RadixSelect.SelectTriggerProps['className']
}

export function Select({
	variant = 'regular',
	initialValue,
	value,
	items,
	onChange,
	placeholder,
	className,
	...props
}: Props) {
	const [internalValue, setInternalValue] = useState(initialValue)

	const handleValueChange = useCallback(
		(newValue: string) => {
			if (newValue !== undefined) {
				setInternalValue(newValue)
				onChange?.(newValue)
			}
		},
		[onChange]
	)

	useEffect(() => {
		setInternalValue(value)
	}, [value])

	return (
		<RadixSelect.Root
			value={internalValue}
			onValueChange={handleValueChange}
			defaultValue={initialValue}
			{...props}
		>
			<RadixSelect.Trigger
				className={clsx(
					'inline-flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 outline-none',
					variant === 'regular'
						? 'dark:bg-white/5 bg-gray-100 border dark:border-white/8 border-gray-200 dark:hover:bg-white/10 hover:bg-gray-200 dark:text-gray-300 text-gray-700'
						: 'bg-transparent dark:text-gray-500 text-gray-400 dark:hover:text-white hover:text-gray-900',
					className
				)}
			>
				<RadixSelect.Value placeholder={placeholder} />
				<RadixSelect.Icon className="opacity-50">
					<SelectIcon className="w-3 h-3" />
				</RadixSelect.Icon>
			</RadixSelect.Trigger>

			<RadixSelect.Portal>
				<RadixSelect.Content className="z-[9999] overflow-hidden min-w-[160px] rounded-xl border dark:border-white/10 border-gray-200 shadow-xl dark:bg-[#1a1a1a] bg-white animate-in fade-in zoom-in-95 duration-150">
					<RadixSelect.Viewport className="p-1.5">
						{items.map(({ value, title, description, ...itemProps }) => (
							<RadixSelect.Item
								key={value}
								value={value}
								className="relative flex items-center px-8 py-2 rounded-lg text-sm outline-none cursor-pointer select-none transition-colors dark:text-gray-300 text-gray-700 data-[highlighted]:dark:bg-white/8 data-[highlighted]:bg-gray-50 data-[highlighted]:dark:text-white data-[highlighted]:text-gray-900"
								{...itemProps}
							>
								<span className="absolute left-2.5 flex items-center justify-center">
									<RadixSelect.ItemIndicator>
										<CheckIcon className="w-3.5 h-3.5" />
									</RadixSelect.ItemIndicator>
								</span>
								<div className="flex flex-col gap-0.5">
									<RadixSelect.ItemText>{title ?? value}</RadixSelect.ItemText>
									{description && (
										<span className="text-[10px] dark:text-gray-500 text-gray-400 leading-tight">
											{description}
										</span>
									)}
								</div>
							</RadixSelect.Item>
						))}
					</RadixSelect.Viewport>
				</RadixSelect.Content>
			</RadixSelect.Portal>
		</RadixSelect.Root>
	)
}

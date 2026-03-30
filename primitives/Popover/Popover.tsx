'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import { ReactNode } from 'react'

interface Props
	extends
		RadixPopover.PopoverProps,
		Pick<RadixPopover.PopoverContentProps, 'side' | 'sideOffset' | 'align' | 'alignOffset'> {
	content: ReactNode
}

export function Popover({
	content,
	children,
	side = 'bottom',
	sideOffset = 8,
	align = 'center',
	alignOffset,
	...props
}: Props) {
	return (
		<RadixPopover.Root {...props}>
			<RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
			<RadixPopover.Portal>
				<RadixPopover.Content
					collisionPadding={10}
					side={side}
					sideOffset={sideOffset}
					align={align}
					alignOffset={alignOffset}
					className="z-[9999] outline-none rounded-2xl border dark:border-white/10 border-gray-200 shadow-xl dark:bg-[#1a1a1a] bg-white dark:text-white text-gray-900 animate-in fade-in zoom-in-95 duration-150 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2"
				>
					<div className="relative overflow-hidden rounded-2xl">{content}</div>
					<RadixPopover.Arrow className="dark:fill-[#1a1a1a] fill-white" width={10} height={5} />
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	)
}

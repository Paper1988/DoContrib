'use client'

import * as RadixPopover from '@radix-ui/react-popover'
import { ReactNode } from 'react'

interface Props
	extends
		RadixPopover.PopoverProps,
		Pick<RadixPopover.PopoverContentProps, 'side' | 'sideOffset' | 'align' | 'alignOffset'> {
	content: ReactNode
	aboveOverlay?: boolean
}

export function Popover({
	content,
	children,
	side = 'bottom',
	sideOffset = 8,
	align = 'center',
	alignOffset,
	aboveOverlay,
	...props
}: Props) {
	return (
		<RadixPopover.Root {...props}>
			<RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>

			<RadixPopover.Portal>
				<RadixPopover.Content
					className={`
                        z-9999
                        outline-none
                        rounded-2xl border dark:border-white/10 border-gray-200
                        shadow-2xl

                        animate/fade-in duration-200 ease-in-out
                        data-[side=top]:slide-in-from-bottom-2
                        data-[side=bottom]:slide-in-from-top-2
                        data-[side=left]:slide-in-from-right-2
                        data-[side=right]:slide-in-from-left-2
                    `}
					collisionPadding={10}
					side={side}
					sideOffset={sideOffset}
					align={align}
					alignOffset={alignOffset}
				>
					{/* 這裡包一層可以確保 content 的樣式不會被干擾 */}
					<div className="relative overflow-hidden rounded-2xl">{content}</div>

					{/* 加上一個精緻的小箭頭，讓 UI 更有指向感 */}
					<RadixPopover.Arrow className="fill-gray-200 dark:fill-white/10" width={10} height={5} />
				</RadixPopover.Content>
			</RadixPopover.Portal>
		</RadixPopover.Root>
	)
}

'use client'

import * as RadixTooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { ReactNode, forwardRef } from 'react'

export type Props = RadixTooltip.TooltipProps &
	RadixTooltip.TooltipContentProps & {
		content: ReactNode
	}

export const Tooltip = forwardRef<HTMLDivElement, Props>(
	(
		{
			children,
			content,
			open,
			defaultOpen,
			onOpenChange,
			delayDuration = 300,
			disableHoverableContent = true,
			collisionPadding = 8,
			sideOffset = 6,
			side,
			align,
			className,
			...props
		},
		ref
	) => {
		return (
			<RadixTooltip.Provider>
				<RadixTooltip.Root
					defaultOpen={defaultOpen}
					delayDuration={delayDuration}
					disableHoverableContent={disableHoverableContent}
					onOpenChange={onOpenChange}
					open={open}
				>
					<RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
					<RadixTooltip.Portal>
						<RadixTooltip.Content
							ref={ref}
							side={side}
							align={align}
							collisionPadding={collisionPadding}
							sideOffset={sideOffset}
							className={clsx(
								'z-[9999] overflow-hidden rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-md',
								'animate-in fade-in zoom-in-95 duration-100',
								'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
								'dark:bg-[#1a1a1a] bg-white dark:text-gray-200 text-gray-700',
								'border dark:border-white/10 border-gray-200',
								className
							)}
							{...props}
						>
							{content}
							<RadixTooltip.Arrow className="dark:fill-[#1a1a1a] fill-white" />
						</RadixTooltip.Content>
					</RadixTooltip.Portal>
				</RadixTooltip.Root>
			</RadixTooltip.Provider>
		)
	}
)

Tooltip.displayName = 'Tooltip'

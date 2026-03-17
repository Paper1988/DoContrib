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
			delayDuration = 200,
			disableHoverableContent = true,
			collisionPadding = 10,
			sideOffset = 8,
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
								'z-9999! overflow-hidden rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-2xl backdrop-blur-md transition-all duration-300',
								'animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95',
								'bg-popover text-popover-foreground border border-border',
								className
							)}
							{...props}
						>
							{content}
							<RadixTooltip.Arrow className="fill-popover" />
						</RadixTooltip.Content>
					</RadixTooltip.Portal>
				</RadixTooltip.Root>
			</RadixTooltip.Provider>
		)
	}
)

Tooltip.displayName = 'Tooltip'

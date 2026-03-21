'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ChevronRight, FolderKanban, Home, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export interface BreadcrumbItem {
	label: string
	href?: string
	icon?: React.ReactNode
}

interface AppNavbarProps {
	breadcrumbs?: BreadcrumbItem[]
	actions?: React.ReactNode
}

export default function AppNavbar({ breadcrumbs, actions }: AppNavbarProps) {
	const router = useRouter()

	return (
		<header className="sticky top-0 z-50 h-14 border-b dark:border-white/5 border-gray-200 dark:bg-[#0a0a0a]/90 bg-white/90 backdrop-blur-xl flex items-center px-6 gap-4">
			{/* Logo */}
			<button onClick={() => router.push('/')} className="flex items-center gap-2 shrink-0">
				<div className="w-7 h-7 rounded-full overflow-hidden">
					<Image src="/DoContrib.jpg" alt="Logo" width={28} height={28} className="rounded-full" />
				</div>
				<span className="font-bold text-sm dark:text-white text-gray-900">DoContrib</span>
			</button>

			{/* Breadcrumbs */}
			{breadcrumbs && breadcrumbs.length > 0 && (
				<>
					<Separator orientation="vertical" className="h-5 dark:bg-white/10" />
					<nav className="flex items-center gap-0.5 flex-1 min-w-0 text-xs">
						{breadcrumbs.map((item, index) => {
							const isLast = index === breadcrumbs.length - 1
							return (
								<div key={index} className="flex items-center gap-0.5 min-w-0">
									{index > 0 && (
										<ChevronRight className="w-3 h-3 dark:text-gray-700 text-gray-300 shrink-0 mx-0.5" />
									)}
									{isLast ? (
										<span className="px-2 py-1 font-medium dark:text-gray-300 text-gray-600 truncate max-w-[140px]">
											{item.icon && <span className="mr-1.5 inline-flex">{item.icon}</span>}
											{item.label}
										</span>
									) : (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => item.href && router.push(item.href)}
											className="h-7 px-2 rounded-lg text-xs dark:text-gray-500 text-gray-400 hover:dark:text-white hover:text-gray-900 gap-1 shrink-0"
										>
											{item.icon}
											<span className="hidden sm:inline">{item.label}</span>
										</Button>
									)}
								</div>
							)
						})}
					</nav>
				</>
			)}

			{/* 沒有 breadcrumb 時的空白填充 */}
			{(!breadcrumbs || breadcrumbs.length === 0) && <div className="flex-1" />}

			{/* 右側 actions */}
			{actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
		</header>
	)
}

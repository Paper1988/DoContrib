'use client'

import { useOthers, useSelf } from '@liveblocks/react/suspense'
import { motion, AnimatePresence } from 'framer-motion'

export function Avatars() {
	const users = useOthers()
	const currentUser = useSelf()

	return (
		<div className="flex items-center -space-x-3 px-2">
			<AnimatePresence>
				{/* 其他在線使用者 */}
				{users.map(({ connectionId, info }) => (
					<motion.div
						key={connectionId}
						initial={{ opacity: 0, scale: 0.8, x: -10 }}
						animate={{ opacity: 1, scale: 1, x: 0 }}
						exit={{ opacity: 0, scale: 0.8, x: -10 }}
					>
						<Avatar picture={info.avatar!} name={info.name!} />
					</motion.div>
				))}

				{/* 當前使用者 */}
				{currentUser && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="relative z-10 ml-4 border-l dark:border-white/20 border-gray-200 pl-4"
					>
						<Avatar
							picture={currentUser.info.avatar!}
							name={`${currentUser.info.name!} (你)`}
							isSelf
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export function Avatar({
	picture,
	name,
	isSelf,
}: {
	picture: string
	name: string
	isSelf?: boolean
}) {
	return (
		<div className="group relative flex items-center justify-center">
			{/* 頭像主體 */}
			<div
				className={`
				relative w-10 h-10 rounded-full border-2
				transition-transform duration-300 group-hover:-translate-y-1 group-hover:z-20
				${isSelf ? 'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'dark:border-gray-800 border-white shadow-sm'}
				overflow-hidden bg-gray-200
			`}
			>
				<img alt={name} src={picture} className="w-full h-full object-cover" />
			</div>

			{/* 工具提示框 (Tooltip) - 模仿首頁毛玻璃感 */}
			<div
				className="
				absolute bottom-full mb-3 px-3 py-1.5 rounded-lg
				text-xs font-medium whitespace-nowrap
				opacity-0 scale-95 translate-y-2 pointer-events-none
				group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
				transition-all duration-200 z-50
				dark:bg-black/80 bg-white/90 backdrop-blur-md
				dark:text-white text-gray-900
				border dark:border-white/10 border-gray-200 shadow-xl
			"
			>
				{name}
				{/* 提示框箭頭 */}
				<div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent dark:border-t-black/80 border-t-white/90" />
			</div>
		</div>
	)
}

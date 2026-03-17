'use client'

import { supabase } from '@/lib/supabase/supabase'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Users, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Contribution {
	id: string
	title: string
	content: string
	user_id: string
	status: string
}

export default function ProjectBoard({ projectId }: { projectId: string }) {
	const [contributions, setContributions] = useState<Contribution[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// 1. 初始抓取數據
		const fetchInitialData = async () => {
			const { data } = await supabase
				.from('contributions')
				.select('*')
				.eq('project_id', projectId)
				.order('created_at', { ascending: false })

			if (data) setContributions(data)
			setLoading(false)
		}

		fetchInitialData()

		// 2. 啟動 Supabase Realtime 監聽 (這就是魔法所在！✨)
		const channel = supabase
			.channel(`realtime:project:${projectId}`)
			.on(
				'postgres_changes',
				{
					event: '*', // 監聽 INSERT, UPDATE, DELETE
					schema: 'public',
					table: 'contributions',
					filter: `project_id=eq.${projectId}`,
				},
				(payload) => {
					console.log('收到即時變動！', payload)

					if (payload.eventType === 'INSERT') {
						setContributions((prev) => [payload.new as Contribution, ...prev])
					} else if (payload.eventType === 'UPDATE') {
						setContributions((prev) =>
							prev.map((c) => (c.id === payload.new.id ? (payload.new as Contribution) : c))
						)
					} else if (payload.eventType === 'DELETE') {
						setContributions((prev) => prev.filter((c) => c.id === payload.old.id))
					}
				}
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [projectId])

	if (loading)
		return (
			<div className="p-20 text-center animate-pulse font-black text-gray-400">
				LOADING SYNERGY...
			</div>
		)

	return (
		<div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
			{/* 頂部控制列 */}
			<div className="flex justify-between items-end">
				<div>
					<h2 className="text-4xl font-black tracking-tight dark:text-white text-gray-950">
						Project Workspace
					</h2>
					<p className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-500 mt-2">
						Real-time contribution stream active
					</p>
				</div>

				<button className="group relative px-6 py-3 rounded-2xl bg-blue-500 text-white font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] overflow-hidden">
					<div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
					<Plus className="w-5 h-5" />
					<span>New Contribution</span>
				</button>
			</div>

			{/* 貢獻卡片流 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<AnimatePresence mode="popLayout">
					{contributions.map((item) => (
						<motion.div
							key={item.id}
							layout
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
							whileHover={{ y: -5 }}
							className="p-8 rounded-[32px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/60 backdrop-blur-3xl shadow-xl group relative overflow-hidden"
						>
							{/* 卡片發光特效 */}
							<div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 blur-[40px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

							<div className="relative space-y-4">
								<div className="flex justify-between items-start">
									<div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
										<Zap className="w-4 h-4 text-blue-500" />
									</div>
									<span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-blue-500/20 text-blue-500">
										{item.status}
									</span>
								</div>

								<h3 className="text-xl font-bold dark:text-white text-gray-900 group-hover:text-blue-500 transition-colors">
									{item.title}
								</h3>

								<p className="text-sm dark:text-gray-400 text-gray-600 line-clamp-3 leading-relaxed">
									{item.content || '這傢伙很懶，什麼都沒留下...'}
								</p>

								<div className="pt-4 border-t dark:border-white/5 border-gray-100 flex items-center gap-2">
									<div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-800" />
									<span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
										Contributor ID: {item.user_id.slice(0, 8)}
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

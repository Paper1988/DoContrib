'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Home, Loader2, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function JoinProjectPage() {
	const router = useRouter()
	const { inviteCode } = useParams()
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
	const [projectName, setProjectName] = useState('')

	useEffect(() => {
		const joinProject = async () => {
			if (!inviteCode) return
			try {
				const res: any = await api.post('/projects/join', { inviteCode })
				const { project } = res.data
				setProjectName(project.name)
				setStatus('success')
				setTimeout(() => router.push(`/projects/${project.id}`), 1500)
			} catch (err: any) {
				console.error(err)
				if (err.response?.status === 401) {
					router.push(`/signIn?callbackUrl=/projects/join/${inviteCode}`)
					return
				}
				setStatus('error')
			}
		}
		joinProject()
	}, [inviteCode, router])

	return (
		<div className="min-h-screen flex flex-col items-center justify-center dark:bg-[#0a0a0a] bg-[#fdfbfa] px-4">
			{/* Logo */}
			<div className="flex items-center gap-2 mb-8">
				<div className="w-7 h-7 rounded-full overflow-hidden">
					<Image src="/DoContrib.jpg" alt="Logo" width={28} height={28} className="rounded-full" />
				</div>
				<span className="font-bold text-sm dark:text-white text-gray-900">DoContrib</span>
			</div>

			<Card className="w-full max-w-sm dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl shadow-sm">
				<CardContent className="p-8 text-center">
					<AnimatePresence mode="wait">
						{status === 'loading' && (
							<motion.div
								key="loading"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								className="space-y-4"
							>
								<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mx-auto">
									<Loader2 className="w-5 h-5 animate-spin text-blue-500" />
								</div>
								<div>
									<h2 className="text-base font-bold dark:text-white text-gray-900 mb-1">
										正在加入專案
									</h2>
									<p className="text-xs dark:text-gray-500 text-gray-400">請稍候...</p>
								</div>
							</motion.div>
						)}

						{status === 'success' && (
							<motion.div
								key="success"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								className="space-y-4"
							>
								<div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
									<CheckCircle2 className="w-5 h-5 text-green-500" />
								</div>
								<div>
									<h2 className="text-base font-bold dark:text-white text-gray-900 mb-1">
										成功加入 {projectName}
									</h2>
									<p className="text-xs dark:text-gray-500 text-gray-400">正在跳轉至專案...</p>
								</div>
							</motion.div>
						)}

						{status === 'error' && (
							<motion.div
								key="error"
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								className="space-y-4"
							>
								<div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
									<XCircle className="w-5 h-5 text-red-500" />
								</div>
								<div>
									<h2 className="text-base font-bold dark:text-white text-gray-900 mb-1">
										邀請連結失效
									</h2>
									<p className="text-xs dark:text-gray-500 text-gray-400 mb-6">
										此連結可能已過期或不存在
									</p>
								</div>
								<Button
									size="sm"
									onClick={() => router.push('/')}
									className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 w-full"
								>
									<Home className="w-3.5 h-3.5" /> 返回首頁
								</Button>
							</motion.div>
						)}
					</AnimatePresence>
				</CardContent>
			</Card>
		</div>
	)
}

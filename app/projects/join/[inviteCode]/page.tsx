'use client'

import api from '@/lib/api'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
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
		<div className="min-h-screen flex items-center justify-center bg-[#fdfbfa] dark:bg-gray-950 relative overflow-hidden">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[120px] rounded-full animate-pulse" />

			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				className="relative z-10 p-10 rounded-[40px] border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 backdrop-blur-3xl shadow-2xl text-center max-w-sm w-full"
			>
				{status === 'loading' && (
					<div className="space-y-6">
						<Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500" />
						<h2 className="text-xl font-black tracking-tight dark:text-white">
							正在同步貢獻空間...
						</h2>
						<p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-500">
							Connecting to Synergy
						</p>
					</div>
				)}

				{status === 'success' && (
					<motion.div initial={{ y: 10 }} animate={{ y: 0 }} className="space-y-6">
						<CheckCircle2 className="w-12 h-12 mx-auto text-green-500 animate-bounce" />
						<h2 className="text-xl font-black tracking-tight dark:text-white">
							成功加入 {projectName}！
						</h2>
						<p className="text-[10px] font-bold tracking-[0.3em] uppercase text-green-500/80">
							Membership Synchronized
						</p>
					</motion.div>
				)}

				{status === 'error' && (
					<motion.div initial={{ y: 10 }} animate={{ y: 0 }} className="space-y-6">
						<XCircle className="w-12 h-12 mx-auto text-red-500" />
						<h2 className="text-xl font-black tracking-tight dark:text-white">連結失效了!</h2>
						<button
							onClick={() => router.push('/')}
							className="text-sm font-bold text-blue-500 hover:underline"
						>
							返回首頁
						</button>
					</motion.div>
				)}
			</motion.div>
		</div>
	)
}

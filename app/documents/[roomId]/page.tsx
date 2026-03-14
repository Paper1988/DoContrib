'use client'

import { TextEditor } from '@/components/TextEditor'
import Loading from '@/components/loading'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, ReactNode } from 'react'
import { Room } from './Room'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import clsx from 'clsx'

export default function DocumentPage({ params }: { params: Promise<{ roomId: string }> }) {
	const router = useRouter()
	const { data: session, status } = useSession()

	const [roomId, setRoomId] = useState<string>('')
	const [documentData, setDocumentData] = useState({ title: '', content: '', docId: '' })
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')

	useEffect(() => {
		params
			.then((resolvedParams) => setRoomId(resolvedParams.roomId))
			.catch((err) => console.error('❌ Params 解析失敗:', err))
	}, [params])

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/signIn')
		}
	}, [status, router])

	useEffect(() => {
		async function fetchDocument() {
			if (status === 'loading' || !roomId || !session?.user) return

			if (!documentData.docId) setLoading(true)
			setError('')

			try {
				const res = await api.get(`/documents/${roomId}`)
				const data = res.data.document
				setDocumentData({
					title: data.title || '未命名文件',
					content: data.content || '',
					docId: data.id,
				})
			} catch (error: any) {
				setError(error.response?.data?.error || '文件載入失敗')
			} finally {
				setLoading(false)
			}
		}

		fetchDocument()
	}, [roomId, session, status])

	const PageWrapper = ({ children }: { children: ReactNode }) => (
		<div className="relative min-h-screen w-full overflow-hidden dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500">
			<div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />
			{children}
		</div>
	)

	if (!roomId && status !== 'unauthenticated') {
		return (
			<PageWrapper>
				<div className="flex items-center justify-center min-h-screen">
					<Loading />
				</div>
			</PageWrapper>
		)
	}

	return (
		<PageWrapper>
			<Room params={params}>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{
						opacity: status === 'loading' || loading ? 0.4 : 1,
						filter: status === 'loading' || loading ? 'blur(1px)' : 'blur(0px)',
					}}
					transition={{ duration: 0.5 }}
					className={clsx(
						'min-h-screen transition-all duration-500',
						(status === 'loading' || loading) && 'pointer-events-none select-none'
					)}
				>
					<TextEditor />
				</motion.div>
			</Room>

			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
						animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
						className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/20"
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							className="max-w-md w-full p-8 rounded-32px border dark:bg-black/60 bg-white/80 dark:border-white/10 border-gray-200 shadow-[0_32px_64px_rgba(0,0,0,0.4)] text-center"
						>
							<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
								<AlertTriangle className="w-8 h-8 text-red-500" />
							</div>
							<h2 className="text-2xl font-bold mb-2 tracking-tight">載入發生錯誤</h2>
							<p className="dark:text-gray-400 text-gray-600 mb-8 px-4">{error}</p>
							<button
								onClick={() => router.push('/documents')}
								className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl font-bold transition-all active:scale-95 dark:bg-white dark:text-black bg-gray-900 text-white hover:opacity-90 shadow-xl"
							>
								<ArrowLeft className="w-4 h-4" /> 返回文件列表
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</PageWrapper>
	)
}

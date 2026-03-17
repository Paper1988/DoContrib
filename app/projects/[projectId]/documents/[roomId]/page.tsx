'use client'

import { Avatars } from '@/components/Avatars'
import { CustomTaskItem } from '@/components/CustomTaskItem'
import { ThemeToggle } from '@/components/ThemeToggle'
import { StaticToolbar } from '@/components/Toolbars'
import { EditableTitle } from '@/components/document/EditableTitle'
import Loading from '@/components/loading'
import api from '@/lib/api'
import { showCustomToast } from '@/lib/ui'
import { FloatingComposer, FloatingThreads, useLiveblocksExtension } from '@liveblocks/react-tiptap'
import { ClientSideSuspense, useThreads } from '@liveblocks/react/suspense'
import Highlight from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import Youtube from '@tiptap/extension-youtube'
import { Placeholder } from '@tiptap/extensions'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import debounce from 'lodash/debounce'
import { AlertTriangle, ArrowLeft, Monitor, Share2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useParams, useRouter } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Room } from './Room'

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false)
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024)
		}
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])
	return isMobile
}

function MobileBlocker() {
	const router = useRouter()
	const { projectId } = useParams()

	return (
		<div className="fixed inset-0 z-200 flex items-center justify-center p-6 bg-[#fdfbfa] dark:bg-gray-950">
			<div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />
			<motion.div
				initial={{ scale: 0.9, opacity: 0, y: 20 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				className="relative max-w-sm w-full p-10 rounded-[40px] border dark:bg-black/40 bg-white/60 backdrop-blur-3xl dark:border-white/10 border-gray-200 shadow-2xl text-center"
			>
				<motion.div
					animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
					transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
					className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8"
				>
					<Monitor className="w-10 h-10 text-blue-500" />
				</motion.div>
				<h2 className="text-2xl font-black mb-4 tracking-tight">請改用電腦編輯</h2>
				<p className="dark:text-gray-400 text-gray-600 mb-0 leading-relaxed text-sm">
					為了提供最穩定且完整的協作編輯體驗，DoContrib 目前僅支援桌面端瀏覽器。
				</p>

				<button
					onClick={() => router.push(`/projects/${projectId}/documents`)}
					className="mt-8 w-full h-14 rounded-2xl font-bold dark:bg-white dark:text-black bg-gray-900 text-white shadow-xl"
				>
					返回列表
				</button>
				<div className="pt-8 border-t dark:border-white/5 border-gray-100 italic text-[10px] text-gray-400 uppercase tracking-widest">
					desktop only experience
				</div>
			</motion.div>
		</div>
	)
}

interface Project {
	id: string
	name: string
	invite_code: string
}

export default function DocumentPage({ params }: { params: Promise<{ roomId: string }> }) {
	return (
		<ClientSideSuspense fallback={<LoadingPage />}>
			<DocumentPageContent params={params} />
		</ClientSideSuspense>
	)
}

function LoadingPage() {
	return <Loading />
}

function DocumentPageContent({ params }: { params: Promise<{ roomId: string }> }) {
	const router = useRouter()
	const { status } = useSession()
	const [roomId, setRoomId] = useState<string>('')
	const { projectId } = useParams()
	const isMobile = useIsMobile()

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

	const PageWrapper = ({ children }: { children: ReactNode }) => (
		<div className="relative min-h-screen w-full overflow-hidden dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500">
			<div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-grid-gray-900/[0.02]" />
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
			{children}
		</div>
	)

	if (isMobile) {
		return <MobileBlocker />
	}

	if (status === 'loading' || !roomId) {
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
				<DocumentView roomId={roomId} projectId={projectId as string} />
			</Room>
		</PageWrapper>
	)
}

function SaveIndicator({ status }: { status: '已同步' | '儲存中' | '錯誤' }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex items-center gap-3 px-5 py-2.5 rounded-2xl backdrop-blur-3xl border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white/80 shadow-2xl"
		>
			<div className="relative">
				{status === '儲存中' && (
					<motion.div
						animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
						transition={{ repeat: Infinity, duration: 2 }}
						className="absolute inset-0 bg-blue-500 blur-md rounded-full"
					/>
				)}
				<div
					className={clsx(
						'w-2 h-2 rounded-full transition-colors duration-500',
						status === '已同步'
							? 'bg-green-500 shadow-[0_0_10px_#22c55e]'
							: status === '儲存中'
								? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'
								: 'bg-red-500 shadow-[0_0_10px_#ef4444]'
					)}
				/>
			</div>
			<span className="text-[10px] font-black tracking-[0.2em] uppercase dark:text-gray-400 text-gray-500">
				{status === '已同步' ? '已同步' : status === '儲存中' ? '儲存中' : '錯誤'}
			</span>
		</motion.div>
	)
}

function DocumentView({ roomId, projectId }: { roomId: string; projectId: string }) {
	const router = useRouter()
	const { data: session } = useSession()
	const { resolvedTheme } = useTheme()
	const liveblocks = useLiveblocksExtension()
	const { threads } = useThreads()
	const [documentData, setDocumentData] = useState({ title: '', content: '' })
	const [projectData, setProjectData] = useState<Project | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>('')
	const [margin, setMargin] = useState<10 | 20 | 30>(20)

	const [saveStatus, setSaveStatus] = useState<'已同步' | '儲存中' | '錯誤'>('已同步')

	const debouncedSave = useCallback(
		debounce(async (content: any) => {
			setSaveStatus('儲存中')
			try {
				await api.patch(`/projects/documents/${roomId}`, {
					content: content,
					settings: { margin: margin },
				})
				setSaveStatus('已同步')
			} catch (err) {
				console.error('Autosave failed:', err)
				setSaveStatus('錯誤')
			}
		}, 1500),
		[roomId, margin]
	)

	const editor = useEditor({
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					'focus:outline-none min-h-[800px] prose prose-blue dark:prose-invert max-w-none transition-all',
			},
		},
		extensions: [
			liveblocks.configure({
				attachCursor: true,
			}),
			StarterKit.configure({ undoRedo: false, heading: { levels: [1, 2, 3] } }),
			Highlight,
			Image,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: { class: 'text-blue-500 underline cursor-pointer' },
			}),
			Placeholder.configure({
				placeholder: '從這裡開始輸入你的天才想法...',
				emptyEditorClass: 'tiptap-empty',
			}),
			CustomTaskItem,
			TaskList,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
				alignments: ['left', 'center', 'right'],
			}),
			Typography,
			Youtube,
		],
		onUpdate: ({ editor }) => {
			const json = editor.getJSON()
			debouncedSave(json)
		},
	})

	useEffect(() => {
		async function fetchData() {
			if (!roomId || !session?.user) return
			try {
				const [docRes, projRes]: any = await Promise.all([
					api.get(`/projects/documents/${roomId}`),
					api.get('/projects'),
				])

				const docData = docRes.data.document
				setDocumentData({
					title: docData.title || '未命名文件',
					content: docData.content || '',
				})

				// 從伺服器載入邊距設定
				if (docData.settings?.margin) {
					setMargin(docData.settings.margin)
				}

				const projectsList = projRes.data.projects
				const currentProj = projectsList.find((p: any) => p.id === projectId)
				setProjectData(currentProj || null)
			} catch (error: any) {
				setError(error.response?.data?.error || '資料載入失敗')
			} finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [roomId, projectId])

	const updateMargin = async (newMargin: 10 | 20 | 30) => {
		setMargin(newMargin)
		try {
			await api.patch(`/projects/documents/${roomId}`, {
				settings: { margin: newMargin },
			})
		} catch (error) {
			console.error('儲存邊距設定失敗:', error)
		}
	}

	return (
		<>
			<div className="fixed bottom-10 right-10 z-50">
				<SaveIndicator status={saveStatus} />
			</div>
			<motion.header
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-8 backdrop-blur-3xl border-b dark:border-white/5 border-gray-100 dark:bg-black/40 bg-[#fdfbfa]/80"
			>
				<div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0 overflow-hidden">
					<button
						onClick={() => router.back()}
						className="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-90 shrink-0"
					>
						<ArrowLeft className="w-5 h-5 text-gray-500" />
					</button>
					<div className="flex flex-col min-w-[80px] overflow-hidden">
						<EditableTitle initialTitle={documentData.title} roomId={roomId} />
					</div>
				</div>

				<div className="flex-initial flex justify-center items-center px-4 max-w-[65vw]">
					<div className="flex items-center gap-2 sm:gap-4 max-w-full">
						<StaticToolbar editor={editor} />

						<div className="h-4 w-px bg-gray-200 dark:bg-white/10" />
						<div className="flex items-center gap-1">
							{[10, 20, 30].map((m) => (
								<button
									key={m}
									onClick={() => updateMargin(m as any)}
									className={clsx(
										'px-3 py-1 rounded-lg text-[10px] font-black transition-all',
										margin === m
											? 'dark:text-white text-blue-500'
											: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
									)}
								>
									{m === 10 ? '窄' : m === 20 ? '中' : '寬'}
								</button>
							))}
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 sm:gap-4 flex-1 min-w-0">
					<div className="scale-75 sm:scale-90 origin-right flex items-center shrink-0">
						<Avatars />
					</div>
					<div className="hidden md:block h-6 w-px dark:bg-white/10 bg-gray-200" />
					<ThemeToggle />
					<motion.button
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.95 }}
						disabled={!projectData}
						onClick={() => {
							if (projectData?.invite_code) {
								navigator.clipboard.writeText(
									`${window.location.origin}/projects/join/${projectData.invite_code}`
								)
								showCustomToast({
									isDark: resolvedTheme === 'dark',
									title: '📄 連結已複製',
									message: `連結已存至剪貼簿`,
									duration: 2000,
									type: 'success',
								})
							}
						}}
						className={clsx(
							'group relative h-10 px-6 rounded-2xl overflow-hidden',
							'bg-blue-600 text-white transition-all duration-300',
							'shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]',
							'disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed'
						)}
					>
						{/* 有質感的發光背景 */}
						<div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

						<div className="flex items-center gap-2.5 relative">
							<Share2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
							<span className="text-xs font-black tracking-widest uppercase">
								Share
							</span>
						</div>

						{/* 底部高光線 */}
						<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
					</motion.button>
				</div>
			</motion.header>

			<main className="pt-32 pb-20 overflow-y-auto no-scrollbar h-screen flex flex-col items-center bg-[#fdfbfa] dark:bg-transparent">
				<motion.div
					initial={{ opacity: 0, y: 30, scale: 0.98 }}
					animate={{
						opacity: loading ? 0.4 : 1,
						y: loading ? 30 : 0,
						scale: loading ? 0.98 : 1,
						filter: loading ? 'blur(4px)' : 'blur(0px)',
						padding: `${margin}mm`,
					}}
					transition={{ type: 'spring', stiffness: 100, damping: 20 }}
					className={clsx(
						'relative z-10 w-[210mm] min-h-[297mm] rounded-sm transition-all duration-700',
						'bg-white dark:bg-[#0f0f0f] border dark:border-white/10 border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02),0_8px_40px_rgba(0,0,0,0.02)]',
						loading && 'pointer-events-none'
					)}
				>
					<EditorContent editor={editor} />
					<FloatingComposer
						editor={editor}
						className="z-50 shadow-2xl rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-gray-900/90 bg-white/90 backdrop-blur-xl"
						style={{ width: 350 }}
					/>
					<FloatingThreads threads={threads} editor={editor} />
				</motion.div>
				<div className="h-40 w-full" />
			</main>

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
							className="max-w-md w-full p-8 rounded-[32px] border dark:bg-black/60 bg-white/80 dark:border-white/10 border-gray-200 shadow-2xl text-center"
						>
							<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
								<AlertTriangle className="w-8 h-8 text-red-500" />
							</div>
							<h2 className="text-2xl font-bold mb-2">載入發生錯誤</h2>
							<p className="dark:text-gray-400 text-gray-600 mb-8">{error}</p>
							<button
								onClick={() => router.push(`/projects/${projectId}/documents`)}
								className="w-full h-14 rounded-2xl font-bold dark:bg-white dark:text-black bg-gray-900 text-white shadow-xl"
							>
								返回列表
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

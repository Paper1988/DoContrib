'use client'

import { Avatars } from '@/components/Avatars'
import { CustomTaskItem } from '@/components/CustomTaskItem'
import ThemeToggle from '@/components/ThemeToggle'
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
import { AlertTriangle, ArrowLeft, Monitor, Share2, Layout, Type, AlignLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useParams, useRouter } from 'next/navigation'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { Room } from './Room'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'

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
	const [fontSize, setFontSize] = useState(18) // 預設 18px
	const [lineHeight, setLineHeight] = useState(1.6) // 預設 1.6
	const [isFullWidth, setIsFullWidth] = useState(false) // 全寬模式

	const editorStyle = {
		'--editor-font-size': `${fontSize}px`,
		'--editor-line-height': lineHeight,
		'--editor-max-width': isFullWidth ? '100%' : '850px', // Notion 的黃金閱讀寬度是 850px
	} as React.CSSProperties

	const [saveStatus, setSaveStatus] = useState<'已同步' | '儲存中' | '錯誤'>('已同步')

	const debouncedSave = useCallback(
		debounce(async (content: any, settings: any) => {
			setSaveStatus('儲存中')
			try {
				await api.patch(`/projects/documents/${roomId}`, {
					content,
					settings,
				})
				setSaveStatus('已同步')
			} catch (err) {
				setSaveStatus('錯誤')
			}
		}, 1500),
		[roomId]
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
			setSaveStatus('儲存中')
		},
	})

	useEffect(() => {
		if (!editor || loading) return

		const content = editor.getJSON()
		debouncedSave(content, { fontSize, lineHeight, isFullWidth })
	}, [editor, fontSize, lineHeight, isFullWidth, debouncedSave, loading])

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

				if (docData.settings) {
					const { fontSize: fs, lineHeight: lh, isFullWidth: fw } = docData.settings
					if (fs) setFontSize(fs)
					if (lh) setLineHeight(lh)
					if (fw !== undefined) setIsFullWidth(fw)
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
	}, [roomId, projectId, session?.user])

	return (
		<>
			<div className="fixed bottom-10 right-10 z-50">
				<SaveIndicator status={saveStatus} />
			</div>
			<motion.header
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center justify-between px-4 sm:px-8 backdrop-blur-3xl border-b dark:border-white/5 border-gray-100 dark:bg-black/40 bg-[#fdfbfa]/80"
			>
				{/* 左側：返回 + 標題 */}
				<div className="flex items-center gap-2 sm:gap-4 flex-none min-w-0 max-w-[30%] xl:max-w-[20%]">
					<button
						onClick={() => router.back()}
						className="p-2.5 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all active:scale-90 shrink-0"
					>
						<ArrowLeft className="w-5 h-5 text-gray-500" />
					</button>
					<div className="min-w-0 overflow-hidden">
						<EditableTitle initialTitle={documentData.title} roomId={roomId} />
					</div>
				</div>

				{/* 中間：工具列，flex-1 讓它佔用剩餘空間 */}
				<div className="flex-1 flex justify-center items-center px-2 sm:px-4 min-w-0 overflow-hidden">
					<StaticToolbar editor={editor} />
				</div>

				{/* 右側：Avatars + Theme + Share */}
				<div className="flex items-center justify-end gap-1.5 sm:gap-3 flex-none">
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
							'group relative h-9 sm:h-10 px-4 sm:px-6 rounded-2xl overflow-hidden shrink-0',
							'bg-blue-600 text-white transition-all duration-300',
							'shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)]',
							'disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed'
						)}
					>
						<div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
						<div className="flex items-center gap-2 relative">
							<Share2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
							{/* 小螢幕隱藏文字，只顯示圖示 */}
							<span className="hidden sm:inline text-xs font-black tracking-widest uppercase">
								分享
							</span>
						</div>
						<div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
					</motion.button>
				</div>
			</motion.header>

			<ContextMenu>
				<ContextMenuTrigger asChild>
					<main
						style={editorStyle}
						className="pt-32 pb-20 overflow-y-auto no-scrollbar h-screen flex flex-col items-center bg-transparent"
					>
						<div className="w-auto h-5 shrink-0" />
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{
								opacity: loading ? 0.4 : 1,
								y: loading ? 20 : 0,
								filter: loading ? 'blur(8px)' : 'blur(0px)',
							}}
							className={clsx(
								'relative z-10 transition-all duration-500 ease-in-out py-16 md:py-24',
								'bg-transparent'
							)}
							style={{
								width: 'var(--editor-max-width)',
								fontSize: 'var(--editor-font-size)',
								lineHeight: 'var(--editor-line-height)',
								paddingLeft: isFullWidth ? '2rem' : '0',
								paddingRight: isFullWidth ? '2rem' : '0',
							}}
						>
							<EditorContent editor={editor} className="tiptap-notion-flow" />

							<FloatingComposer editor={editor} />
							<FloatingThreads threads={threads} editor={editor} />

							<div className="h-[40vh]" />
						</motion.div>
					</main>
				</ContextMenuTrigger>

				<ContextMenuContent className="z-[60] w-64 rounded-[28px] border dark:bg-black/80 bg-white/90 backdrop-blur-3xl p-3 shadow-2xl space-y-2 border-white/10">
					<div className="px-2 py-2">
						<div
							className="flex items-center justify-between group cursor-pointer"
							onClick={() => {
								const newValue = !isFullWidth
								setIsFullWidth(newValue)
							}}
						>
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
									<Layout size={16} />
								</div>
								<span className="text-sm font-bold dark:text-gray-200 text-gray-800">全寬模式</span>
							</div>
							<div
								className={`w-10 h-5 rounded-full transition-all duration-300 relative ${isFullWidth ? 'bg-blue-500' : 'bg-gray-300 dark:bg-white/10'}`}
							>
								<motion.div
									animate={{ x: isFullWidth ? 22 : 2 }}
									className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
								/>
							</div>
						</div>
					</div>

					<ContextMenuSeparator className="dark:bg-white/5 bg-gray-100" />

					<div className="px-3 py-3 space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-[10px] font-black tracking-widest uppercase opacity-50 flex items-center gap-2">
								<Type size={12} /> Font Size
							</span>
							<span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-lg">
								{fontSize}px
							</span>
						</div>
						<input
							type="range"
							min="12"
							max="32"
							step="1"
							value={fontSize}
							onChange={(e) => setFontSize(Number(e.target.value))}
							className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
						/>
					</div>

					<div className="px-3 py-3 space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-[10px] font-black tracking-widest uppercase opacity-50 flex items-center gap-2">
								<AlignLeft size={12} /> Line Height
							</span>
							<span className="text-xs font-mono font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-lg">
								{lineHeight}
							</span>
						</div>
						<input
							type="range"
							min="1"
							max="2.5"
							step="0.1"
							value={lineHeight}
							onChange={(e) => setLineHeight(Number(e.target.value))}
							className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
						/>
					</div>
				</ContextMenuContent>
			</ContextMenu>

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

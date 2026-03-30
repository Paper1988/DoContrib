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
import {
	AlertTriangle,
	ArrowLeft,
	Monitor,
	Share2,
	Layout,
	Type,
	AlignLeft,
	Trash2,
} from 'lucide-react'
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

// MobileBlocker — 統一新風格
function MobileBlocker() {
	const router = useRouter()
	const { projectId } = useParams()

	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 dark:bg-[#0a0a0a] bg-[#fdfbfa]">
			<div className="w-full max-w-sm">
				<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mx-auto mb-6">
					<Monitor className="w-5 h-5 dark:text-gray-400 text-gray-500" />
				</div>
				<h2 className="text-lg font-bold dark:text-white text-gray-900 text-center mb-2">
					請改用電腦編輯
				</h2>
				<p className="text-sm dark:text-gray-500 text-gray-400 text-center mb-8 leading-relaxed">
					為了提供最穩定的協作體驗，DoContrib 編輯器目前僅支援桌面端瀏覽器。
				</p>
				<button
					onClick={() => router.push(`/projects/${projectId}/documents`)}
					className="w-full h-10 rounded-xl text-sm font-semibold dark:bg-white dark:text-black bg-gray-900 text-white transition-all hover:opacity-90"
				>
					返回列表
				</button>
			</div>
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
		<div className="min-h-screen w-full dark:bg-[#0a0a0a] bg-[#fdfbfa] transition-colors duration-300">
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
		<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 shadow-sm">
			<div
				className={clsx(
					'w-1.5 h-1.5 rounded-full transition-colors duration-500',
					status === '已同步'
						? 'bg-green-500'
						: status === '儲存中'
							? 'bg-blue-500 animate-pulse'
							: 'bg-red-500'
				)}
			/>
			<span className="text-[11px] font-medium dark:text-gray-400 text-gray-500">{status}</span>
		</div>
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
		'--editor-max-width': isFullWidth ? '100%' : '850px',
		transition: 'max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
				class: clsx(
					'focus:outline-none min-h-[800px] prose prose-blue dark:prose-invert max-w-none transition-all',
					editorStyle
				),
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
				className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b dark:border-white/5 border-gray-200 dark:bg-[#0a0a0a]/95 bg-[#fdfbfa]/95 backdrop-blur-xl"
			>
				<div className="flex items-center gap-2 flex-none min-w-0 max-w-[30%] xl:max-w-[25%]">
					<button
						onClick={() => router.back()}
						className="p-2 rounded-lg hover:dark:bg-white/5 hover:bg-gray-100 transition-all active:scale-90 shrink-0"
					>
						<ArrowLeft className="w-4 h-4 dark:text-gray-400 text-gray-500" />
					</button>
					<div className="min-w-0 overflow-hidden">
						<EditableTitle initialTitle={documentData.title} roomId={roomId} />
					</div>
				</div>

				<div className="flex-1 flex justify-center items-center px-2 sm:px-4 min-w-0 overflow-hidden">
					<StaticToolbar editor={editor} />
				</div>

				<div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-none">
					<div className="scale-75 sm:scale-90 origin-right flex items-center shrink-0">
						<Avatars />
					</div>
					<div className="hidden md:block h-5 w-px dark:bg-white/10 bg-gray-200" />
					<ThemeToggle />
					<button
						disabled={!projectData}
						onClick={() => {
							if (projectData?.invite_code) {
								navigator.clipboard.writeText(
									`${window.location.origin}/projects/join/${projectData.invite_code}`
								)
								showCustomToast({
									isDark: resolvedTheme === 'dark',
									title: '🔗 連結已複製',
									message: '連結已存至剪貼簿',
									duration: 2000,
									type: 'success',
								})
							}
						}}
						className={clsx(
							'h-8 px-4 rounded-lg text-xs font-semibold gap-1.5 shrink-0 flex items-center',
							'bg-blue-600 hover:bg-blue-700 text-white transition-colors',
							'disabled:opacity-40 disabled:cursor-not-allowed'
						)}
					>
						<Share2 className="w-3.5 h-3.5" />
						<span className="hidden sm:inline">分享</span>
					</button>
				</div>
			</motion.header>
			<ContextMenu>
				<ContextMenuTrigger asChild>
					<main
						style={editorStyle}
						className="pt-16 h-screen overflow-y-auto no-scrollbar dark:bg-[#0a0a0a] bg-[#fdfbfa]"
					>
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{
								opacity: loading ? 0.4 : 1,
								y: loading ? 8 : 0,
								filter: loading ? 'blur(4px)' : 'blur(0px)',
							}}
							transition={{ duration: 0.3 }}
							className="max-w-3xl mx-auto px-6 sm:px-12 py-16 min-h-full"
							style={{
								fontSize: 'var(--editor-font-size)',
								lineHeight: 'var(--editor-line-height)',
								maxWidth: isFullWidth ? '100%' : undefined,
								paddingLeft: isFullWidth ? '3rem' : undefined,
								paddingRight: isFullWidth ? '3rem' : undefined,
							}}
						>
							<EditorContent editor={editor} className="notion-prose tiptap-notion-flow" />
							<FloatingComposer editor={editor} />
							<FloatingThreads threads={threads} editor={editor} />
							<div className="h-[40vh]" />
						</motion.div>
					</main>
				</ContextMenuTrigger>

				<ContextMenuContent className="z-[80] w-60 rounded-2xl border dark:bg-[#1a1a1a] dark:border-white/10 bg-white border-gray-200 p-2 shadow-xl space-y-1">
					<button
						onClick={() => setIsFullWidth(!isFullWidth)}
						className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl dark:hover:bg-white/5 hover:bg-gray-50 transition-colors"
					>
						<div className="flex items-center gap-2.5 text-sm dark:text-gray-300 text-gray-700">
							<Layout className="w-4 h-4 dark:text-gray-500 text-gray-400" />
							全寬模式
						</div>
						<div
							className={clsx(
								'w-8 h-4 rounded-full transition-colors duration-200 relative shrink-0',
								isFullWidth ? 'bg-blue-500' : 'dark:bg-white/10 bg-gray-200'
							)}
						>
							<div
								className={clsx(
									'absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200',
									isFullWidth ? 'left-4' : 'left-0.5'
								)}
							/>
						</div>
					</button>

					<ContextMenuSeparator className="dark:bg-white/5 bg-gray-100 my-1" />

					<div className="px-3 py-2 space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-xs dark:text-gray-500 text-gray-400">
								<Type className="w-3.5 h-3.5" />
								字體大小
							</div>
							<span className="text-xs font-mono dark:text-blue-400 text-blue-500 dark:bg-blue-500/10 bg-blue-50 px-1.5 py-0.5 rounded-md">
								{fontSize}px
							</span>
						</div>
						<input
							type="range"
							min="13"
							max="24"
							step="1"
							value={fontSize}
							onChange={(e) => setFontSize(Number(e.target.value))}
							className="w-full h-1 rounded-full appearance-none cursor-pointer accent-blue-500 dark:bg-white/10 bg-gray-200"
						/>
					</div>

					<div className="px-3 py-2 space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-xs dark:text-gray-500 text-gray-400">
								<AlignLeft className="w-3.5 h-3.5" />
								行距
							</div>
							<span className="text-xs font-mono dark:text-violet-400 text-violet-500 dark:bg-violet-500/10 bg-violet-50 px-1.5 py-0.5 rounded-md">
								{lineHeight}
							</span>
						</div>
						<input
							type="range"
							min="1.2"
							max="2.5"
							step="0.05"
							value={lineHeight}
							onChange={(e) => setLineHeight(Number(e.target.value))}
							className="w-full h-1 rounded-full appearance-none cursor-pointer accent-violet-500 dark:bg-white/10 bg-gray-200"
						/>
					</div>

					<ContextMenuSeparator className="dark:bg-white/5 bg-gray-100 my-1" />

					<ContextMenuItem className="rounded-xl gap-2 text-sm px-3 py-2.5 text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
						<Trash2 className="w-3.5 h-3.5" /> 刪除此文件
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 10 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							className="w-full max-w-sm p-8 rounded-2xl border dark:bg-[#111] bg-white dark:border-white/8 border-gray-200 shadow-xl text-center"
						>
							<div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
								<AlertTriangle className="w-5 h-5 text-red-500" />
							</div>
							<h2 className="text-base font-bold dark:text-white text-gray-900 mb-2">
								載入發生錯誤
							</h2>
							<p className="text-sm dark:text-gray-400 text-gray-500 mb-6">{error}</p>
							<button
								onClick={() => router.push(`/projects/${projectId}/documents`)}
								className="w-full h-9 rounded-xl text-xs font-semibold dark:bg-white dark:text-black bg-gray-900 text-white transition-all hover:opacity-90"
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

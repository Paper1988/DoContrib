'use client'

import Loading from '@/app/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import api from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Award,
	BarChart3,
	Calendar,
	Check,
	Edit3,
	Home,
	Mail,
	PenTool,
	Target,
	User,
	X,
	Sparkles,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkEmoji from 'remark-emoji'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'

export default function ProfilePage() {
	const { userId } = useParams()
	const { data: session } = useSession()
	const [profile, setProfile] = useState<any | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [bioText, setBioText] = useState('')

	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await api.get(`/profile/${userId}`)
				setProfile(res.data)
				setBioText(res.data.bio || '')
			} catch (error) {
				console.error('❌ 獲取用戶資料失敗:', error)
			}
		}
		fetchProfile()
	}, [userId])

	const isCurrentUser = session?.user?.id === userId

	if (!profile) return <Loading />

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen relative dark:bg-gray-950 bg-[#fdfbfa] transition-colors duration-500 overflow-hidden"
		>
			{/* 背景裝飾：網格與光暈 (符合你的規範) */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute inset-0 dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />
				<div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
			</div>

			<main className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
				{/* 頂部導航與標題 */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
					<motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
							<Sparkles className="w-3 h-3" /> User Identity
						</div>
						<h1 className="text-4xl md:text-6xl font-black tracking-tight dark:text-white text-gray-900">
							{isCurrentUser ? '我的空間' : '探索成員'}
						</h1>
					</motion.div>

					<div className="flex items-center gap-3">
						<Link href="/">
							<Button variant="ghost" className="rounded-2xl hover:bg-white/10 gap-2 font-bold">
								<Home className="w-4 h-4" /> 回首頁
							</Button>
						</Link>
						{isCurrentUser && (
							<Link href={`/user/${userId}/dashboard`}>
								<Button className="rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black font-bold shadow-xl hover:scale-105 transition-transform">
									<BarChart3 className="w-4 h-4 mr-2" /> 儀表板
								</Button>
							</Link>
						)}
					</div>
				</div>

				<div className="space-y-8">
					{/* 使用者核心資訊卡片 (磨砂玻璃質感) */}
					<motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
						<Card className="overflow-hidden rounded-[32px] border backdrop-blur-3xl dark:bg-black/40 bg-white/80 dark:border-white/10 border-gray-200 p-8 sm:p-12 shadow-2xl">
							<div className="flex flex-col md:flex-row items-center gap-10">
								<div className="relative group">
									{/* 頭像發光感 */}
									<div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
									<div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] overflow-hidden ring-4 ring-white/10 shadow-2xl">
										{profile.image ? (
											<Image
												src={profile.image}
												alt="Avatar"
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-110"
											/>
										) : (
											<div className="w-full h-full bg-gray-200 dark:bg-white/5 flex items-center justify-center">
												<User className="w-16 h-16 text-gray-400" />
											</div>
										)}
									</div>
									{isCurrentUser && (
										<Badge className="absolute -bottom-2 -right-2 bg-blue-500 text-white px-4 py-1 rounded-full border-4 dark:border-gray-950 border-white font-black tracking-widest text-[10px]">
											OWNER
										</Badge>
									)}
								</div>

								<div className="flex-1 text-center md:text-left">
									<h2 className="text-3xl md:text-5xl font-black dark:text-white text-gray-900 mb-4">
										{profile.name}
									</h2>
									<div className="space-y-2 flex flex-col items-center md:items-start">
										<div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium">
											<Mail className="w-4 h-4 text-blue-500" /> {profile.email}
										</div>
										{profile.createdAt && (
											<div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium">
												<Calendar className="w-4 h-4 text-purple-500" /> 加入於{' '}
												{new Date(profile.createdAt).toLocaleDateString()}
											</div>
										)}
									</div>
								</div>
							</div>
						</Card>
					</motion.div>

					{/* 個人簡介編輯區 */}
					<motion.div
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="rounded-[32px] border backdrop-blur-3xl dark:bg-black/20 bg-white/60 dark:border-white/10 border-gray-200 p-8">
							<div className="flex items-center justify-between mb-8">
								<h3 className="text-xl font-bold flex items-center gap-3 dark:text-white">
									<PenTool className="w-5 h-5 text-blue-400" /> 個人簡介
								</h3>
								{isCurrentUser && (
									<div className="flex gap-2">
										<AnimatePresence mode="wait">
											{isEditing ? (
												<motion.div
													key="editing"
													initial={{ opacity: 0, scale: 0.9 }}
													animate={{ opacity: 1, scale: 1 }}
													exit={{ opacity: 0, scale: 0.9 }}
													className="flex gap-2"
												>
													<Button
														variant="ghost"
														onClick={() => setIsEditing(false)}
														className="rounded-xl"
													>
														取消
													</Button>
													<Button
														onClick={async () => {
															setIsSaving(true)
															await api.post(`/profile/${userId}`, { bio: bioText })
															setProfile({ ...profile, bio: bioText })
															setIsEditing(false)
															setIsSaving(false)
														}}
														className="rounded-xl bg-blue-500 hover:bg-blue-600 text-white gap-2"
													>
														{isSaving ? (
															'儲存中...'
														) : (
															<>
																<Check className="w-4 h-4" /> 儲存
															</>
														)}
													</Button>
												</motion.div>
											) : (
												<motion.div
													key="static"
													initial={{ opacity: 0, scale: 0.9 }}
													animate={{ opacity: 1, scale: 1 }}
												>
													<Button
														variant="outline"
														onClick={() => setIsEditing(true)}
														className="rounded-xl border-white/10 hover:bg-white/5"
													>
														<Edit3 className="w-4 h-4 mr-2" /> 編輯簡介
													</Button>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								)}
							</div>

							{isEditing ? (
								<textarea
									value={bioText}
									onChange={(e) => setBioText(e.target.value)}
									className="w-full min-h-[250px] p-6 rounded-2xl bg-white/5 border-b-2 border-transparent focus:border-blue-500 focus:outline-none transition-all duration-500 font-mono text-sm leading-relaxed"
									placeholder="支援 Markdown 語法，寫下你的故事..."
								/>
							) : (
								<div className="min-h-[200px] prose dark:prose-invert max-w-none">
									{profile.bio ? (
										<ReactMarkdown
											remarkPlugins={[remarkGfm, remarkCjkFriendly, remarkEmoji, remarkGemoji]}
										>
											{profile.bio}
										</ReactMarkdown>
									) : (
										<div className="flex flex-col items-center justify-center py-10 text-gray-500">
											<Sparkles className="w-8 h-8 mb-4 opacity-20" />
											<p>這位用戶很神秘，還沒留下任何資訊。</p>
										</div>
									)}
								</div>
							)}
						</Card>
					</motion.div>
				</div>
			</main>
		</motion.div>
	)
}

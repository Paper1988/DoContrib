'use client'

import Loading from '@/app/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import api from '@/lib/api'
import { AnimatePresence, motion } from 'framer-motion'
import {
	BarChart3,
	Calendar,
	Check,
	Edit3,
	Home,
	Mail,
	PenTool,
	Sparkles,
	User,
	Shield,
	Activity,
	Settings,
	FolderKanban,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkCjkFriendly from 'remark-cjk-friendly'
import remarkEmoji from 'remark-emoji'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import AppNavbar from '@/components/navigation/AppNavbar'

export default function ProfilePage() {
	const { userId } = useParams()
	const { data: session } = useSession()
	const [profile, setProfile] = useState<any | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [bioText, setBioText] = useState('')
	const [fetchError, setFetchError] = useState<string | null>(null)
	const [stats, setStats] = useState<any | null>(null)
	const router = useRouter()

	useEffect(() => {
		async function fetchProfile() {
			try {
				const [profileRes, statsRes] = await Promise.all([
					api.get(`/profile/${userId}`),
					api.get(`/profile/${userId}/stats`),
				])
				setProfile(profileRes.data)
				setStats(statsRes.data)
				setBioText(profileRes.data.bio || '')
			} catch (error: any) {
				setFetchError(error?.response?.data?.error || error?.message || '載入失敗，請重新整理')
			}
		}
		fetchProfile()
	}, [userId])

	const isCurrentUser = session?.user?.id === userId

	if (fetchError)
		return (
			<div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-gray-950 bg-gray-50">
				<div className="p-8 rounded-2xl border dark:border-white/10 border-gray-200 dark:bg-black/40 bg-white text-center max-w-sm">
					<p className="text-red-500 font-semibold mb-2">{fetchError}</p>
					<p className="text-gray-400 text-xs font-mono">userId: {userId?.toString()}</p>
				</div>
			</div>
		)

	if (!profile) return <Loading />

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen dark:bg-[#0a0a0a] bg-gray-50 transition-colors duration-300"
		>
			<AppNavbar
				breadcrumbs={[
					{ label: '首頁', href: '/', icon: <Home className="w-3 h-3" /> },
					{
						label: '個人檔案',
						icon: <FolderKanban className="w-3 h-3 text-blue-500" />,
					},
				]}
				actions={[
					isCurrentUser && (
						<Button
							size="sm"
							className="h-8 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
							onClick={(e) => {
								router.push(`/user/${userId}/dashboard`)
							}}
							key={'dashboard'}
						>
							<BarChart3 className="w-3.5 h-3.5" /> 儀表板
						</Button>
					),
				]}
			/>

			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
				<div className="flex flex-col lg:flex-row gap-6">
					<aside className="lg:w-72 shrink-0 space-y-4">
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl overflow-hidden">
							<div className="h-20 dark:bg-white/5 bg-gray-100" />
							<CardContent className="px-5 pb-5 -mt-10">
								<div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 dark:ring-[#111] ring-white shadow-lg mb-3">
									{profile.image ? (
										<Image src={profile.image} alt="Avatar" fill className="object-cover" />
									) : (
										<div className="w-full h-full dark:bg-white/5 bg-gray-100 flex items-center justify-center">
											<User className="w-8 h-8 text-gray-400" />
										</div>
									)}
								</div>

								<div className="flex items-start justify-between gap-2">
									<div className="min-w-0">
										<h2 className="font-bold text-base dark:text-white text-gray-900 truncate">
											{profile.name}
										</h2>
										{isCurrentUser && (
											<Badge className="mt-1 text-[10px] px-2 py-0.5 bg-blue-500/15 text-blue-500 border-blue-500/20 border rounded-full font-semibold tracking-wide">
												Me
											</Badge>
										)}
									</div>
								</div>

								<Separator className="my-4 dark:bg-white/5 bg-gray-100" />

								<div className="space-y-2.5">
									<div className="flex items-center gap-2.5 text-sm dark:text-gray-400 text-gray-600">
										<Mail className="w-3.5 h-3.5 shrink-0 dark:text-gray-500 text-gray-400" />
										<span className="truncate text-xs">{profile.email}</span>
									</div>
									{profile.createdAt && (
										<div className="flex items-center gap-2.5 text-sm dark:text-gray-400 text-gray-600">
											<Calendar className="w-3.5 h-3.5 shrink-0 dark:text-gray-500 text-gray-400" />
											<span className="text-xs">
												加入於{' '}
												{new Date(profile.createdAt).toLocaleDateString('zh-TW', {
													year: 'numeric',
													month: 'long',
												})}
											</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* 快速統計卡 */}
						<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
							<CardHeader className="px-5 pt-5 pb-3">
								<CardTitle className="text-xs font-semibold dark:text-gray-400 text-gray-500 uppercase tracking-wider">
									概覽
								</CardTitle>
							</CardHeader>
							<CardContent className="px-5 pb-5 space-y-3">
								{[
									{ icon: Activity, label: '活躍專案', value: profile.projectCount ?? '—' },
									{ icon: Shield, label: '貢獻次數', value: profile.contributionCount ?? '—' },
									{ icon: BarChart3, label: '本月活躍', value: profile.monthlyActive ?? '—' },
								].map(({ icon: Icon, label, value }) => (
									<div key={label} className="flex items-center justify-between">
										<div className="flex items-center gap-2 text-sm dark:text-gray-400 text-gray-600">
											<Icon className="w-3.5 h-3.5 dark:text-gray-500 text-gray-400" />
											<span className="text-xs">{label}</span>
										</div>
										<span className="text-sm font-semibold dark:text-white text-gray-900">
											{value}
										</span>
									</div>
								))}
							</CardContent>
						</Card>
					</aside>

					{/* ── 右側主內容 ── */}
					<main className="flex-1 min-w-0">
						{/* 頁面標題列 */}
						<div className="flex items-center justify-between mb-6">
							<div>
								<h1 className="text-xl font-bold dark:text-white text-gray-900">
									{isCurrentUser ? '我的個人頁面' : profile.name}
								</h1>
								<p className="text-sm dark:text-gray-500 text-gray-500 mt-0.5">
									{isCurrentUser ? '管理你的個人資料與簡介' : '成員資料'}
								</p>
							</div>
						</div>

						<Tabs defaultValue="bio" className="w-full">
							<TabsList className="h-9 dark:bg-white/5 bg-gray-100 rounded-xl p-1 mb-6">
								<TabsTrigger
									value="bio"
									className="rounded-lg text-xs font-medium h-7 px-4 data-[state=active]:dark:bg-[#1a1a1a] data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									<PenTool className="w-3.5 h-3.5 mr-1.5" /> 個人簡介
								</TabsTrigger>
								<TabsTrigger
									value="activity"
									className="rounded-lg text-xs font-medium h-7 px-4 data-[state=active]:dark:bg-[#1a1a1a] data-[state=active]:bg-white data-[state=active]:shadow-sm"
								>
									<Activity className="w-3.5 h-3.5 mr-1.5" /> 近期活動
								</TabsTrigger>
								{isCurrentUser && (
									<TabsTrigger
										value="settings"
										className="rounded-lg text-xs font-medium h-7 px-4 data-[state=active]:dark:bg-[#1a1a1a] data-[state=active]:bg-white data-[state=active]:shadow-sm"
									>
										<Settings className="w-3.5 h-3.5 mr-1.5" /> 設定
									</TabsTrigger>
								)}
							</TabsList>

							{/* Bio Tab */}
							<TabsContent value="bio">
								<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
									<CardHeader className="px-6 pt-6 pb-0 flex flex-row items-center justify-between">
										<CardTitle className="text-sm font-semibold dark:text-white text-gray-900">
											個人簡介
										</CardTitle>
										{isCurrentUser && (
											<AnimatePresence mode="wait">
												{isEditing ? (
													<motion.div
														key="editing"
														initial={{ opacity: 0, scale: 0.95 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.95 }}
														className="flex items-center gap-2"
													>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => setIsEditing(false)}
															className="h-8 px-3 rounded-lg text-xs"
														>
															取消
														</Button>
														<Button
															size="sm"
															onClick={async () => {
																setIsSaving(true)
																await api.post(`/profile/${userId}`, { bio: bioText })
																setProfile({ ...profile, bio: bioText })
																setIsEditing(false)
																setIsSaving(false)
															}}
															className="h-8 px-3 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
														>
															{isSaving ? (
																'儲存中...'
															) : (
																<>
																	<Check className="w-3.5 h-3.5" /> 儲存
																</>
															)}
														</Button>
													</motion.div>
												) : (
													<motion.div
														key="static"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
													>
														<Button
															variant="outline"
															size="sm"
															onClick={() => setIsEditing(true)}
															className="h-8 px-3 rounded-lg text-xs dark:border-white/10 dark:hover:bg-white/5 gap-1.5"
														>
															<Edit3 className="w-3.5 h-3.5" /> 編輯
														</Button>
													</motion.div>
												)}
											</AnimatePresence>
										)}
									</CardHeader>
									<CardContent className="px-6 py-5">
										{isEditing ? (
											<textarea
												value={bioText}
												onChange={(e) => setBioText(e.target.value)}
												className="w-full min-h-[260px] p-4 rounded-xl dark:bg-white/5 bg-gray-50 border dark:border-white/8 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm leading-relaxed resize-none dark:text-white text-gray-900 dark:placeholder:text-gray-600 placeholder:text-gray-400"
												placeholder="支援 Markdown 語法，寫下你的故事..."
											/>
										) : (
											<div className="min-h-[200px]">
												{profile.bio ? (
													<div className="prose prose-sm dark:prose-invert max-w-none dark:prose-p:text-gray-300 prose-p:text-gray-600 prose-headings:font-semibold">
														<ReactMarkdown
															remarkPlugins={[
																remarkGfm,
																remarkCjkFriendly,
																remarkEmoji,
																remarkGemoji,
															]}
														>
															{profile.bio}
														</ReactMarkdown>
													</div>
												) : (
													<div className="flex flex-col items-center justify-center py-16 text-gray-400">
														<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mb-3">
															<Sparkles className="w-5 h-5 opacity-40" />
														</div>
														<p className="text-sm">這位用戶還沒留下任何簡介。</p>
														{isCurrentUser && (
															<Button
																variant="ghost"
																size="sm"
																onClick={() => setIsEditing(true)}
																className="mt-3 h-8 px-4 rounded-lg text-xs text-blue-500 hover:text-blue-400"
															>
																+ 新增簡介
															</Button>
														)}
													</div>
												)}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Activity Tab */}
							<TabsContent value="activity">
								<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
									<CardContent className="px-6 py-16 flex flex-col items-center text-gray-400">
										<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mb-3">
											<Activity className="w-5 h-5 opacity-40" />
										</div>
										<p className="text-sm">活動紀錄即將推出</p>
									</CardContent>
								</Card>
							</TabsContent>

							{/* Settings Tab */}
							{isCurrentUser && (
								<TabsContent value="settings">
									<Card className="dark:bg-[#111] bg-white border dark:border-white/8 border-gray-200 rounded-2xl">
										<CardContent className="px-6 py-16 flex flex-col items-center text-gray-400">
											<div className="w-12 h-12 rounded-2xl dark:bg-white/5 bg-gray-100 flex items-center justify-center mb-3">
												<Settings className="w-5 h-5 opacity-40" />
											</div>
											<p className="text-sm">帳號設定即將推出</p>
										</CardContent>
									</Card>
								</TabsContent>
							)}
						</Tabs>
					</main>
				</div>
			</div>
		</motion.div>
	)
}

'use client'

import Loading from '@/app/loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import api from '@/lib/api'
import { CssBaseline } from '@mui/material'
import { easeOut, motion } from 'framer-motion'
import {
    Award,
    BarChart3,
    Calendar,
    Check,
    Edit3,
    Github,
    Home,
    Linkedin,
    Mail,
    PenTool,
    Target,
    Twitter,
    User,
    Users,
    X,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkCjkFriendly from "remark-cjk-friendly"
import remarkEmoji from 'remark-emoji'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'

interface Profile {
    id: string
    name?: string
    email?: string
    image?: string
    bio?: string
    createdAt?: string
    stats?: {
        projects: number
        groups: number
        completedTasks: number
    }
}

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: easeOut },
}

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export default function ProfilePage() {
    const { userId } = useParams()
    const { data: session } = useSession()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDark, setIsDark] = useState(false)
    const [bioText, setBioText] = useState('')

    useEffect(() => {
        requestAnimationFrame(() => {
            const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
            setIsDark(darkMode)
        })
    }, [])

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await api.get(`/profile/${userId}`)
                const data = res.data
                setProfile(data)
                setBioText(data.bio || '')
            } catch (error) {
                console.error('❌ 獲取用戶資料失敗:', error)
            }
        }

        fetchProfile()
    }, [userId])

    const isCurrentUser = session?.user?.id === userId

    const handleEdit = () => {
        setIsEditing(true)
        setBioText(profile?.bio || '')
    }

    const handleCancel = () => {
        setIsEditing(false)
        setBioText(profile?.bio || '')
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await api.post(`/profile/${userId}`, {
                bio: bioText
            })
            console.log('✅ 保存成功:', response.data)
            setProfile((prev) => (prev ? { ...prev, bio: bioText } : prev))
            setIsEditing(false)
        } catch (error: any) {
            console.error('❌ 保存失敗:', error)
            console.error('錯誤詳情:', error.response?.data)
            alert(`保存失敗: ${error.response?.data?.error || error.message}`)
        } finally {
            setIsSaving(false)
        }
    }

    if (!profile) return <Loading />

    const stats = [
        {
            icon: Target,
            label: '貢獻項目',
            value: profile.stats?.projects || 0,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: Users,
            label: '參與群組',
            value: profile.stats?.groups || 0,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
        },
        {
            icon: Award,
            label: '完成任務',
            value: profile.stats?.completedTasks || 0,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}
        >
            <CssBaseline enableColorScheme />

            <section className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.div {...fadeInUp} className="text-center mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3 flex-wrap justify-center">
                                <Button variant="outline" asChild className={isDark ? 'border-white/10 hover:bg-white/10 text-white' : ''}>
                                    <Link href="/" className="flex items-center gap-2">
                                        <Home className="w-4 h-4" />
                                        回到主頁
                                    </Link>
                                </Button>
                                {isCurrentUser && (
                                    <Button asChild className={isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}>
                                        <Link
                                            href={`/user/${userId}/dashboard`}
                                            className="flex items-center gap-2"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            我的儀表板
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {isCurrentUser ? '我的個人資料' : '用戶資料'}
                        </h1>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            {isCurrentUser ? '管理你的個人資訊和設定' : '查看用戶的詳細資訊'}
                        </p>
                    </motion.div>

                    <div className="space-y-6 sm:space-y-8">
                        <motion.div variants={staggerContainer} initial="initial" animate="animate">
                            <motion.div variants={fadeInUp}>
                                <Card className={`p-6 sm:p-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                                    <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                                        <div className="relative group">
                                            <div className="relative">
                                                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 transition-all duration-300 ${isDark ? 'ring-white/10 group-hover:ring-white/20' : 'ring-gray-200 group-hover:ring-gray-300'}`}>
                                                    {profile.image ? (
                                                        <Image
                                                            src={profile.image}
                                                            alt={profile.name || 'Profile'}
                                                            width={128}
                                                            height={128}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                            <User className={`w-10 h-10 sm:w-12 sm:h-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                                        </div>
                                                    )}
                                                </div>
                                                {isCurrentUser && (
                                                    <Badge className={`absolute -bottom-2 -right-2 bg-green-500 hover:bg-green-600 text-white border-2 ${isDark ? 'border-gray-950' : 'border-white'}`}>
                                                        <User className="w-3 h-3 mr-1" />我
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center md:text-left space-y-3 sm:space-y-4">
                                            <div>
                                                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                    {profile.name || '未命名用戶'}
                                                </h2>
                                                <div className={`flex items-center justify-center md:justify-start mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <Mail className="w-4 h-4 mr-2" />
                                                    <span className="text-sm sm:text-base">{profile.email || '未提供郵箱'}</span>
                                                </div>
                                                {profile.createdAt && (
                                                    <div className={`flex items-center justify-center md:justify-start text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        <span>
                                                            加入於 {new Date(profile.createdAt).toLocaleDateString('zh-TW')}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 sm:mt-8"
                    >
                        {stats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <Card className={`p-5 sm:p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className={cn('text-xl sm:text-2xl font-bold mb-1', stat.color)}>
                                                    {stat.value.toLocaleString()}
                                                </div>
                                                <div className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {stat.label}
                                                </div>
                                            </div>
                                            <div className={cn('p-2 sm:p-3 rounded-lg group-hover:scale-110 transition-transform duration-200', stat.bgColor)}>
                                                <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', stat.color)} />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div> */}

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="mt-6 sm:mt-8"
                    >
                        <Card className={`p-6 sm:p-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-lg sm:text-xl font-semibold flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <PenTool className={`w-5 h-5 mr-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    個人簡介
                                </h3>
                                {isCurrentUser && (
                                    <div className="flex items-center gap-2">
                                        {isEditing ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                    className={isDark ? 'border-white/10 hover:bg-white/10 text-white' : ''}
                                                >
                                                    <X className="w-4 h-4 mr-1" />
                                                    取消
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleSave}
                                                    disabled={isSaving}
                                                    className={isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}
                                                >
                                                    {isSaving ? (
                                                        <div className="w-4 h-4 mr-1 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4 mr-1" />
                                                    )}
                                                    {isSaving ? '保存中...' : '保存'}
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleEdit}
                                                className={isDark ? 'border-white/10 hover:bg-white/10 text-white' : ''}
                                            >
                                                <Edit3 className="w-4 h-4 mr-1" />
                                                編輯
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isCurrentUser && isEditing ? (
                                <div className="space-y-4">
                                    <textarea
                                        value={bioText}
                                        onChange={(e) => setBioText(e.target.value)}
                                        placeholder="支援 Markdown 語法，例如：&#10;# 標題&#10;**粗體** *斜體*&#10;- 列表項目&#10;[連結](https://example.com)"
                                        className={`w-full min-h-[200px] p-4 rounded-lg border resize-y focus:outline-none focus:ring-2 font-mono text-sm ${isDark ? 'bg-white/5 border-white/10 text-gray-200 focus:ring-blue-400 placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500 placeholder:text-gray-400'}`}
                                    />
                                    <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        支援 Markdown 語法：標題、粗體、斜體、列表、連結、程式碼等。
                                    </div>
                                </div>
                            ) : (
                                <div className={`border rounded-lg p-6 min-h-[200px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                                    {profile.bio ? (
                                        <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_p]:text-gray-300 [&_li]:text-gray-300 [&_strong]:text-white [&_em]:text-white [&_a]:text-blue-400 [&_code]:text-blue-400 [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10' : '[&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_p]:text-gray-700 [&_li]:text-gray-700 [&_strong]:text-gray-900 [&_em]:text-gray-900 [&_a]:text-blue-600 [&_code]:text-blue-600 [&_pre]:bg-gray-100 [&_pre]:border [&_pre]:border-gray-200'}`}>
                                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkCjkFriendly, remarkEmoji, remarkGemoji]} children={profile.bio} />
                                        </div>
                                    ) : (
                                        <div className={`text-center py-8 sm:py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                                                <PenTool className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                            </div>
                                            <p className="text-base sm:text-lg font-medium mb-2">還沒有個人簡介</p>
                                            <p className="text-xs sm:text-sm">
                                                {isCurrentUser ? '點擊編輯按鈕開始填寫個人簡介吧！' : '這位用戶還沒有填寫個人簡介。'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>
                    </motion.div>

                    {/* <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className="mt-6 sm:mt-8"
                    >
                        <Card className={`p-6 sm:p-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                            <h3 className={`text-lg sm:text-xl font-semibold mb-6 flex items-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <Award className={`w-5 h-5 mr-2 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                最近活動
                            </h3>
                            <div className={`text-center py-8 sm:py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                                    <Award className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                </div>
                                <p className="text-base sm:text-lg font-medium mb-2">暫無活動記錄</p>
                                <p className="text-xs sm:text-sm">
                                    {isCurrentUser ? '開始參與項目後，你的活動記錄會顯示在這裡。' : '這位用戶還沒有活動記錄。'}
                                </p>
                            </div>
                        </Card>
                    </motion.div> */}
                </div>
            </section>

        </motion.div>
    )
}

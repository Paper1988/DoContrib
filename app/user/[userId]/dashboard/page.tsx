'use client'

import Navbar from '@/components/navigation/Navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import { BarChart3, FileText, Home, LogOut, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (status === 'unauthenticated') {
        router.push('/signIn')
        return null
    }

    if (!mounted || status === 'loading') return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="cursor-default min-h-screen transition-colors duration-300 dark:bg-gray-950 dark:text-white bg-[#fdfbfa] text-gray-900"
        >

            <div className="relative min-h-screen flex flex-col items-center justify-start pt-24 px-4 overflow-hidden">
                {/* Background decorative pattern */}
                <div className="absolute inset-0 pointer-events-none dark:bg-grid-white/[0.02] bg-grid-gray-900/[0.02]" />

                <div className="relative z-10 w-full max-w-4xl mx-auto space-y-8 py-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-center sm:text-left"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r dark:from-white dark:to-gray-400 from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            儀表板
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            歡迎回來，{session?.user?.name || '用戶'}！管理您的貢獻與專案。
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Info Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-2"
                        >
                            <Card className="p-6 sm:p-8 rounded-2xl border transition-colors dark:bg-white/5 dark:border-white/10 bg-white/80 border-gray-200">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Avatar
                                        sx={{ width: 80, height: 80 }}
                                        src={session?.user?.image ?? ''}
                                        className="ring-4 ring-gray-100 dark:ring-white/10"
                                    />
                                    <div className="text-center sm:text-left space-y-1">
                                        <h2 className="text-xl font-bold">{session?.user?.name}</h2>
                                        <p className="text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
                                        <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                                活躍貢獻者
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Quick Actions Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="p-6 h-full rounded-2xl border transition-colors dark:bg-white/5 dark:border-white/10 bg-white/80 border-gray-200 flex flex-col justify-center">
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">快捷操作</h3>
                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl" onClick={() => router.push('/documents')}>
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        文件管理
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 rounded-xl" onClick={() => router.push('/')}>
                                        <Home className="w-4 h-4 text-purple-500" />
                                        首頁
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:border-red-500/20"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        登出
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </div>

                    {/* Placeholder for Stats or Recent Activity */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="p-6 sm:p-8 rounded-2xl border border-dashed transition-colors dark:bg-white/5  bg-white/5 border-gray-300 dark:border-white/10 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <BarChart3 className="w-6 h-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium">即將推出：詳細活動統計</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-2">
                                我們正在開發更強大的數據追蹤與分析功能，讓您的貢獻一目了然。
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

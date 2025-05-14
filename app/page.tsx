'use client'
import NavBar from '@/components/NavBar'
import AppTheme from '@/theme/AppTheme'
import { Alert, CssBaseline } from '@mui/material'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

import { GlowPoints } from '@/components/glowPoints'
import Loading from '@/components/loading'

export default function Home() {
    const { status } = useSession()

    if (status === 'loading') return <Loading />

    return (
        <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="cursor-default"
        >
            <AppTheme>
                <CssBaseline enableColorScheme />

                <Alert
                    severity="warning"
                    className="fixed bottom-0 left-0 right-0 z-20 bg-black/40 p-4"
                >
                    <p className="text-center">
                        This is a demo site for DoContrib. It&apos;s a work in progress and not yet
                        ready for production use. Please don&apos;t use real data.
                    </p>
                </Alert>

                <NavBar />
                <div className="flex flex-col items-center justify-center h-screen relative overflow-hidden">
                    <GlowPoints />
                    <div className="bg-black/40 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center gap-8 z-10">
                        <h1 className="font-bold font-geist-sans text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 top-4 left-4 hover:scale-105 text-4xl md:text-6xl lg:text-8xl">
                            DoContrib
                        </h1>
                        <div className="text-white text-lg animate-bounce absolute bottom-4">
                            <span className="animate-bounce fa fa-arrow-down">▼</span>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-main-bg" style={{ height: '20vh' }} />

                <div className="text-white bg-black/40 min-h-screen py-20 px-6">
                    <div className="max-w-3xl mx-auto space-y-10">
                        <h1 className="text-5xl font-bold text-center">
                            歡迎使用 <span className="text-cyan-400">DoContrib</span>
                        </h1>

                        <br />

                        <section className="space-y-4">
                            <h2 className="text-3xl font-semibold">DoContrib 是什麼？</h2>
                            <p className="leading-relaxed text-lg text-gray-300">
                                DoContrib
                                是一個為現代團隊量身打造的協作平台，專注於「貢獻追蹤」、「角色分工」以及「成果視覺化」。它不只是專案管理工具，更像是你團隊中的數據分析師與紀錄者，幫你追蹤每位成員的貢獻，避免被動摸魚，也避免積極的人吃悶虧。
                            </p>
                            <p className="leading-relaxed text-lg text-gray-300">
                                無論你是學生、創業團隊還是開源開發社群，DoContrib
                                都能透過任務追蹤、即時統計圖表與貢獻紀錄，幫助大家清楚知道「誰做了什麼」，讓協作更公平、進度更清晰、成果更可控。
                            </p>
                            <p className="leading-relaxed text-lg text-gray-300">
                                我們的目標很簡單：讓合作不再靠感覺，而是用數據說話。
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-3xl font-semibold">我們的使命</h2>
                            <p className="leading-relaxed text-lg text-gray-300">
                                在團隊合作中，「資訊不對等」與「責任模糊」一直是效率殺手。DoContrib
                                的使命，就是打造一個透明、易用且高互信的空間，讓每份努力都有跡可循，讓每個貢獻都被看見。
                            </p>
                            <p className="leading-relaxed text-lg text-gray-300">
                                你專注於完成工作，我們幫你記錄一切；你想了解貢獻比例，我們用圖表替你說明真相。沒有過多干擾，沒有繁複流程，只有實用、實在、實話。
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-3xl font-semibold">我們的價值觀</h2>
                            <ul className="list-disc pl-6 text-lg text-gray-300 space-y-2">
                                <li>
                                    <strong>使用者至上：</strong>
                                    我們從不假設用戶應該怎麼做，而是傾聽真實需求來設計功能。
                                </li>
                                <li>
                                    <strong>開源透明：</strong>
                                    源碼公開，信任建立於社群與代碼之中，人人都能參與改進。
                                </li>
                                <li>
                                    <strong>數據為本：</strong>
                                    我們相信好的協作必須建立在明確的貢獻紀錄與視覺化資料上。
                                </li>
                                <li>
                                    <strong>簡潔不簡單：</strong>
                                    介面極簡但功能不打折，該有的都有，不該出現的也不會出現。
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </AppTheme>
        </motion.div>
    )
}

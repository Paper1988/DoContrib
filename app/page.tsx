'use client'
import NavBar from '@/components/NavBar'
import AppTheme from '@/theme/AppTheme'
import { Alert, CssBaseline } from '@mui/material'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'

import { GlowPoints } from '@/components/glowPoints'
import Loading from '@/components/loading'

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-6 md:p-8 shadow-lg space-y-4"
    >
        <h2 className="text-3xl font-semibold text-cyan-300 drop-shadow-[0_0_6px_#0ff]">{title}</h2>
        {children}
    </motion.section>
)

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

                <div className="text-white bg-gradient-to-br from-black via-[#0a0a0a] to-[#050505] min-h-screen py-20 px-6">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-6xl font-bold text-center drop-shadow-[0_0_10px_#0ff]"
                        >
                            歡迎使用 <span className="text-cyan-400">DoContrib</span>
                        </motion.h1>

                        <div className="space-y-10">
                            <Card title="DoContrib 是什麼？">
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    DoContrib
                                    是一個為現代團隊量身打造的協作平台，專注於「貢獻追蹤」、「角色分工」以及「成果視覺化」。
                                    它不只是專案管理工具，更像是你團隊中的數據分析師與紀錄者，幫你追蹤每位成員的貢獻，避免被動摸魚，也避免積極的人吃悶虧。
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    無論你是學生小隊、創業團隊還是開源社群，DoContrib
                                    都能透過任務追蹤、即時圖表與貢獻紀錄，幫助大家清楚知道「誰做了什麼」，
                                    讓協作更公平、進度更清晰、成果更可控。
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    我們的目標很簡單：讓合作不再靠感覺，而是用數據說話。
                                </p>
                            </Card>

                            <Card title="我們的使命">
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    在團隊合作中，「資訊不對等」與「責任模糊」一直是效率殺手。DoContrib
                                    的使命，就是打造一個透明、易用且高互信的空間，
                                    讓每份努力都有跡可循，讓每個貢獻都被看見。
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    你專注於完成工作，我們幫你記錄一切；你想了解貢獻比例，我們用圖表替你說明真相。
                                    沒有過多干擾，沒有繁複流程，只有實用、實在、實話。
                                </p>
                            </Card>

                            <Card title="我們的價值觀">
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
                            </Card>

                            <Card title="為什麼選擇 DoContrib？">
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    市面上有不少專案管理工具，但大多不是為「貢獻透明」設計的。DoContrib
                                    專注於解決團隊合作裡最難說清楚的事──到底誰做了什麼。
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    我們不只做任務看板，也追蹤每個人實際貢獻；不只是管理工具，更是協作的中立紀錄者。就像
                                    GitHub 之於程式碼，我們希望成為「團隊協作的歷史見證者」。
                                </p>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    如果你曾經有過「我到底在幹嘛？」、「他是不是都沒做事？」這些煩惱，那我們應該很適合你。
                                </p>
                            </Card>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="text-center pt-12"
                            >
                                <h2 className="text-4xl font-bold text-white drop-shadow-[0_0_6px_#0ff] mb-6">
                                    準備好提升你們的團隊效率了嗎？
                                </h2>
                                <p className="text-lg text-gray-300 mb-8">
                                    不只是追蹤，更是讓貢獻被看見的工具。現在就試試看吧 👇
                                </p>
                                <a
                                    href="/dashboard"
                                    className="inline-block px-8 py-3 text-lg font-semibold text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition shadow-md hover:shadow-cyan-500/50"
                                >
                                    前往協作空間
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </AppTheme>
        </motion.div>
    )
}

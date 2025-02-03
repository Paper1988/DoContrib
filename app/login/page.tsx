"use client";

import { Session } from 'next-auth'; // 確保引入 Session 類型
import { signIn, useSession } from "next-auth/react";

interface CustomSession extends Session {
    sub?: string; // 添加 sub 屬性
}

export default function LoginPage() {
    const { data: session, status } = useSession()

    if (status === 'loading') return <div>Loading...</div>

    if (!session) {
        return (
            <div>
                <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h1 className="text-2xl font-bold mb-4 text-black">登入</h1>
                        <button
                            onClick={() => signIn("google")}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            使用 Google 登入
                        </button>
                    </div>
                </main>
            </div>
        )
    } else {
        return <div>User Sub: {(session as CustomSession).sub}</div>;
    }
}

"use client";

import { Session } from 'next-auth'; // 確保引入 Session 類型
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CustomSession extends Session {
    sub?: string; // 添加 sub 屬性
}

export default function LoginPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (error === "AccessDenied") {
            setErrorMessage("你沒有權限登入，請聯絡管理員。");
        } else if (error) {
            setErrorMessage("登入時發生錯誤，請稍後再試。");
        }
    }, [error]);

    const { data: session, status } = useSession()

    useEffect(() => {
        if (error === "AccessDenied") {
            setErrorMessage("你沒有權限登入，請聯絡管理員。");
        } else if (error) {
            setErrorMessage("登入時發生錯誤，請稍後再試。");
        }
    }, [error]);


    if (status === 'loading') return <div>Loading...</div>
    if (!session) return (
        <div>
            You are not logged in.
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4 text-black">登入</h1>
                {errorMessage && (
                    <p className="text-red-500 mb-4">{errorMessage}</p>
                )}
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

    if (session) {
        return <div>User Sub: {(session as CustomSession).sub}</div>;
    }
}

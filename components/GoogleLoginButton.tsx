"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-center p-4 m-4 dark:bg-gray-800">
            {session ? (
                <div className="items-center text-center">
                    <p>歡迎, {session.user?.name}！</p>
                    <button onClick={() => signOut()}>登出</button>
                </div>
            ) : (
                <button onClick={() => signIn("google")}>使用 Google 登入</button>
            )}
        </div>
    );
}
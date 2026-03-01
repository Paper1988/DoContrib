'use client';

import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface CustomToastProps {
    t: string | number; // Sonner 傳入的 ID
    title: string;
    message?: string;
    duration: number;
    type: ToastType;
    isDark?: boolean;
}

const configs = {
    success: { icon: <CheckCircle2 className="text-green-500" />, color: "border-green-500/50", bar: "bg-green-500" },
    error: { icon: <AlertCircle className="text-red-500" />, color: "border-red-500/50", bar: "bg-red-500" },
    info: { icon: <Info className="text-blue-500" />, color: "border-blue-500/50", bar: "bg-blue-500" },
    warning: { icon: <AlertTriangle className="text-yellow-500" />, color: "border-yellow-500/50", bar: "bg-yellow-500" },
};

const CustomToast = ({ t, title, message, duration, type, isDark = false }: CustomToastProps) => {
    const config = configs[type];
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div
            className={`group relative flex w-[350px] flex-col overflow-hidden rounded-xl border p-4 shadow-2xl backdrop-blur-xl transition-all ${
                isDark ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'
            } ${config.color}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="flex gap-3">
                <div className="mt-0.5">{config.icon}</div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold">{title}</h3>
                    {message && <p className="mt-1 text-xs opacity-70">{message}</p>}
                </div>
                <button
                    onClick={() => toast.dismiss(t)}
                    className={`rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                        isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200/50'
                    }`}
                >
                    <X size={14} />
                </button>
            </div>

            {/* 進度條動畫 - 使用 CSS animation 控制暫停與繼續 */}
            <div className={`absolute bottom-0 left-0 h-1 w-full ${isDark ? 'bg-white/10' : 'bg-gray-100/50'}`}>
                <div
                    className={`h-full ${config.bar}`}
                    style={{
                        width: '100%',
                        transformOrigin: 'left',
                        animation: `shrink ${duration}ms linear forwards`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                />
            </div>

            {/* 定義 CSS 動畫關鍵影格 */}
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};


export { CustomToast, type ToastType };

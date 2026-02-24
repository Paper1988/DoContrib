import { AppUser } from '@/types/user'
import React from 'react'

interface UserAvatarProps {
    user: AppUser
    size?: 'sm' | 'md' | 'lg'
    showTooltip?: boolean
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
    user,
    size = 'md',
    showTooltip = true
}) => {
    const sizes = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base'
    }

    // 從名字獲取縮寫(首字母)
    const getInitials = (name: string) => {
        if (!name) return '?'
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // 根據 user ID 生成一致的顏色
    const getColorFromId = (id: string) => {
        const colors = [
            '#3b82f6', // blue
            '#ec4899', // pink
            '#10b981', // green
            '#f59e0b', // amber
            '#8b5cf6', // purple
            '#ef4444', // red
            '#06b6d4', // cyan
            '#84cc16'  // lime
        ]
        const index = id
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
        return colors[index]
    }

    const name = user.name || user.email?.split('@')[0] || 'Anonymous'
    const initials = getInitials(name)
    const bgColor = getColorFromId(user.id)

    return (
        <div
            className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white shadow-sm cursor-pointer transition-transform hover:scale-110`}
            style={{ backgroundColor: bgColor }}
            title={showTooltip ? name : undefined}
        >
            {initials}
        </div>
    )
}

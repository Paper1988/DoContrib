import { AppUser } from '@/types/user'
import { Users } from 'lucide-react'
import React, { useState } from 'react'
import { UserAvatar } from './UserAvatar'

interface UserPresence {
    user_id: string
    user: AppUser
    online_at: string
}

interface OnlineUsersListProps {
    users: UserPresence[]
    currentUserId: string
}

export const OnlineUsersList: React.FC<OnlineUsersListProps> = ({
    users,
    currentUserId
}) => {
    const [showList, setShowList] = useState(false)

    return (
        <div className="relative">
            {/* 觸發按鈕 */}
            <button
                onClick={() => setShowList(!showList)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="顯示線上用戶"
            >
                {/* 顯示前 3 位用戶的頭像 */}
                <div className="flex -space-x-2">
                    {users.slice(0, 3).map((userPresence) => (
                        <UserAvatar
                            key={userPresence.user_id}
                            user={userPresence.user}
                            size="sm"
                            showTooltip={false}
                        />
                    ))}
                </div>
                {/* 如果超過 3 位用戶，顯示 +N */}
                {users.length > 3 && (
                    <span className="text-xs text-gray-600">+{users.length - 3}</span>
                )}
                <Users size={16} className="text-gray-500" />
            </button>

            {/* 下拉式用戶列表 */}
            {showList && (
                <>
                    {/* 背景遮罩（點擊關閉） */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowList(false)}
                    />
                    {/* 用戶列表面板 */}
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
                        <div className="text-xs font-semibold text-gray-500 mb-2">
                            線上用戶 ({users.length})
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {users.map((userPresence) => {
                                const user = userPresence.user
                                const isCurrentUser = user.id === currentUserId
                                const userName = user.name || user.email?.split('@')[0] || '匿名用戶'

                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded transition-colors"
                                    >
                                        <UserAvatar user={user} size="sm" showTooltip={false} />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">
                                                {userName}
                                                {isCurrentUser && (
                                                    <span className="text-xs text-gray-500 ml-1">(你)</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {user.email}
                                            </div>
                                        </div>
                                        {/* 線上狀態指示器 */}
                                        <div
                                            className="w-2 h-2 bg-green-500 rounded-full"
                                            title="線上"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

'use client';

import { Avatar } from '@mui/material';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { userId } = useParams();
    const { data: session } = useSession();
    const [profile, setProfile] = useState<{ name: string; email: string; image: string; bio: string } | null>(null);

    // TipTap 編輯器初始化
    const editor = useEditor({
        extensions: [StarterKit],
        content: profile?.bio || '',
        onUpdate: ({ editor }) => {
            setProfile((prev) => prev ? { ...prev, bio: editor.getHTML() } : prev);
        }
    });

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch(`/api/profile/${userId}`);
            const data = await res.json();
            setProfile(data);
            editor?.commands.setContent(data.bio || '');
        }

        fetchProfile();
    }, [userId, editor]);

    // 🚀 讓用戶只能編輯自己的 profile
    const isCurrentUser = session?.user?.id === userId;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold">{profile?.name}</h1>
                <Avatar src={profile?.image} alt="Profile" className="w-24 h-24 rounded-full my-4" />
                <p className="text-gray-400">{profile?.email}</p>

                {isCurrentUser ? (
                    <>
                        <EditorContent editor={editor} className="bg-gray-700 text-white p-3 rounded-md mt-4" />
                        <button 
                            onClick={async () => {
                                await fetch(`/api/profile/${userId}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ bio: editor?.getHTML() })
                                });
                                alert('Bio 已更新！');
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
                        >
                            保存 Bio
                        </button>
                    </>
                ) : (
                    <div className="mt-4" dangerouslySetInnerHTML={{ __html: profile?.bio || '這個人還沒有填寫 Bio。' }} />
                )}

                {/* 好友邀請按鈕 */}
                {!isCurrentUser && (
                    <button 
                        onClick={() => alert('發送好友邀請！')} 
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mt-4"
                    >
                        發送好友邀請
                    </button>
                )}
            </div>
        </div>
    );
}

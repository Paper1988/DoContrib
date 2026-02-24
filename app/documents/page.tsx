'use client'

import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { Dialog, Switch, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

type Document = {
    id: string
    title: string
    updated_at: string
}

export default function DocumentsPage() {
    const [isDark, setIsDark] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)

    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newDocTitle, setNewDocTitle] = useState('')
    const [selectedGroupId, setSelectedGroupId] = useState('')
    const [creating, setCreating] = useState(false)
    const router = useRouter()
    const [isPublic, setIsPublic] = useState(false)

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            await api
                .get('/documents')
                .then((res) => setDocuments(res.data.documents))
                .catch((error) =>
                    setError(error?.message || error?.response?.data?.message || '載入文件失敗')
                )
        } catch (err: unknown) {
            setError((err as Error)?.message || '載入文件時發生錯誤')
        } finally {
            setLoading(false)
        }
    }

    const createDocument = async () => {
        if (!newDocTitle.trim()) {
            setError('請輸入文件標題')
            return
        }

        try {
            setCreating(true)
            setError(null)
            await api
                .post('/documents', {
                    title: newDocTitle.trim(),
                    group_id: selectedGroupId || null,
                    is_public: isPublic,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => {
                    setIsCreateModalOpen(false)
                    router.push(`/documents/${res.data.document.id}`)
                })
                .catch((error) =>
                    setError(error?.message || error?.response?.data?.message || '創建文件失敗')
                )
        } catch (err: unknown) {
            setError((err as Error)?.message || '創建文件時發生錯誤')
        } finally {
            setCreating(false)
        }
    }

    useEffect(() => {
        fetchDocuments()
        requestAnimationFrame(() => {
			setIsLoaded(true)
			const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
			setIsDark(darkMode)
		})
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        )
    }

    const toggleTheme = () => {
		setIsDark(!isDark)
	}

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
            <div className="container mx-auto max-w-6xl px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">我的文件</h1>
                    <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>管理你的協作文件</p>

                    {documents.length > 0 && (
                        <Button
                            onClick={() => {
                                setNewDocTitle('')
                                setSelectedGroupId('')
                                setIsCreateModalOpen(true)
                            }}
                            className={isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
                        >
                            + 創建新文件
                        </Button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className={`mb-6 p-4 rounded ${isDark ? 'border border-red-500/50 bg-red-900/20 text-red-300' : 'border border-red-300 bg-red-50 text-red-700'}`}>
                        {error}
                    </div>
                )}

                {/* Documents List */}
                {documents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-xl font-semibold mb-2">還沒有文件</h3>
                            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>開始創建你的第一個協作文件</p>
                            <Button
                                onClick={() => {
                                    setNewDocTitle('')
                                    setSelectedGroupId('')
                                    setIsCreateModalOpen(true)
                                }}
                                className={isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}
                            >
                                + 創建新文件
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {documents.map((doc) => (
                            <Card
                                key={doc.id}
                                className={`p-4 cursor-pointer border transition-colors ${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                onClick={() => router.push(`/documents/${doc.id}`)}
                            >
                                <h3 className="font-semibold mb-2 line-clamp-2">
                                    {doc.title || '未命名文件'}
                                </h3>
                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {new Date(doc.updated_at).toLocaleDateString('zh-TW', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Transition show={isCreateModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsCreateModalOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`w-full max-w-md border p-6 rounded-lg ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
                                    <Dialog.Title as="h3" className="text-xl font-bold mb-4">
                                        創建新文件
                                    </Dialog.Title>

                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">文件標題</Label>
                                            <Input
                                                id="title"
                                                placeholder="輸入文件標題..."
                                                value={newDocTitle}
                                                onChange={(e) => setNewDocTitle(e.target.value)}
                                                className={`mt-1 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="public">是否公開?</Label>
                                            <Switch
                                                checked={isPublic}
                                                onChange={setIsPublic}
                                                className={`${
                                                    isPublic ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-gray-200'
                                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                            >
                                                <span
                                                    className={`${
                                                        isPublic ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                                />
                                            </Switch>
                                        </div>

                                        <div className="flex gap-3 mt-6">
                                            <Button
                                                variant="outline"
                                                className={`flex-1 ${isDark ? 'border-gray-700 hover:bg-gray-800' : ''}`}
                                                onClick={() => setIsCreateModalOpen(false)}
                                            >
                                                取消
                                            </Button>
                                            <Button
                                                className={`flex-1 ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                                                onClick={createDocument}
                                                disabled={creating || !newDocTitle.trim()}
                                            >
                                                {creating ? '創建中...' : '創建'}
                                            </Button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}

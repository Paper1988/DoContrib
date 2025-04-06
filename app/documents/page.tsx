'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Document = {
    id: string
    title: string
    updated_at: string
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchDocuments = async () => {
        setLoading(true)
        const res = await fetch('/api/documents')
        const data = await res.json()
        if (res.ok) setDocuments(data.documents)
        setLoading(false)
    }

    const createDocument = async () => {
        const res = await fetch('/api/documents', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await res.json()
        if (res.ok) {
            router.push(`/editor/${data.document.id}`)
        }
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">📝 我的文件</h1>

            <button
                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded mb-4"
                onClick={createDocument}
            >
                ➕ 新增文件
            </button>

            {loading ? (
                <p>載入中...</p>
            ) : (
                <ul className="space-y-2">
                    {documents.map((doc) => (
                        <li
                            key={doc.id}
                            className="bg-neutral-800 p-4 rounded cursor-pointer hover:bg-neutral-700"
                            onClick={() => router.push(`/editor/${doc.id}`)}
                        >
                            <h2 className="text-lg font-semibold">{doc.title}</h2>
                            <p className="text-sm text-gray-400">
                                最後更新：{new Date(doc.updated_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

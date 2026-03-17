'use client'

import Loading from '@/components/loading'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProjectIdPage() {
	const router = useRouter()
	const { projectId } = useParams()

	useEffect(() => {
		if (projectId) {
			router.replace(`/projects/${projectId}/documents`)
		}
	}, [projectId, router])

	return <Loading />
}

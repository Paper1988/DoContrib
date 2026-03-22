'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function Loading() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center dark:bg-[#0a0a0a] bg-[#fdfbfa] gap-6">
			<div className="flex items-center gap-2">
				<div className="w-7 h-7 rounded-full overflow-hidden">
					<Image src="/DoContrib.jpg" alt="Logo" width={28} height={28} className="rounded-full" />
				</div>
				<span className="font-bold text-sm dark:text-white text-gray-900">DoContrib</span>
			</div>
			<Loader2 className="w-5 h-5 animate-spin dark:text-gray-600 text-gray-400" />
		</div>
	)
}

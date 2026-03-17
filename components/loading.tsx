'use client'

export default function Loading() {
	return (
		<div className="relative min-h-screen w-full overflow-hidden dark:bg-gray-950 bg-[#fdfbfa]">
			<div className="flex items-center justify-center min-h-screen">
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2"></div>
				</div>
			</div>
		</div>
	)
}

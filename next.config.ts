import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
			{
				protocol: 'http',
				hostname: '**',
			},
		],
	},
	experimental: {
		optimizePackageImports: ['@chakra-ui/react'],
	},
}

export default nextConfig

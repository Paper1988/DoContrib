import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import '@/style/globals.css'
import '@liveblocks/react-tiptap/styles.css'
import '@liveblocks/react-ui/styles.css'
import '@radix-ui/themes/styles.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Providers from './providers'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const title = { default: 'DoContrib', template: '%s - Document & Contribution' }
const description = '追蹤並管理團隊成員貢獻進度的專業平台，幫助您高效監控專案發展。'
const url = 'https://docontrib.vercel.app'

export const metadata: Metadata = {
    metadataBase: new URL(url),
    title,
    description,
    openGraph: {
        title,
        description,
        type: 'website',
        locale: 'zh-TW',
        url,
        siteName: 'DoContrib',
        images: [
            {
                url: 'http://docontrib.vercel.app/DoContrib.jpg',
                alt: 'DoContrib',
            },
        ],
    },
    authors: [{ name: 'Paper1988' }, { name: 'Njdgee' }],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="zh-TW" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Providers>{children}</Providers>
                </ThemeProvider>
                <Toaster richColors position="top-center" closeButton />
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    )
}

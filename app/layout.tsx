import "@/style/globals.css";
import { StyledEngineProvider } from "@mui/material";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "DoContrib",
	description: "追蹤並管理團隊成員貢獻進度的專業平台，幫助您更有效地監控專案發展。",
	openGraph: {
		title: "DoContrib",
		description: "追蹤並管理團隊成員貢獻進度的專業平台，幫助您更有效地監控專案發展。",
		type: "website",
		locale: "zh_TW",
		url: "https://docontrib.vercel.app/",
		siteName: "DoContrib",
	}
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh-TW" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<StyledEngineProvider>
					<Providers>{children}</Providers>
				</StyledEngineProvider>
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	);
}

'use client';
import { useEffect, useState } from 'react';

interface GlowPoint {
	size: number;
	color: string;
	top: number;
	left: number;
	blur: string;
	opacity: number;
	animation: string;
	scale: number;
}

export default function Home() {
	const [glowPoints, setGlowPoints] = useState<GlowPoint[]>([]);

	useEffect(() => {
		const points: GlowPoint[] = [
			{ size: 14, color: 'rgb(34, 211, 238)', opacity: 40, blur: 'blur-2xl', animation: 'animate-float-slower', scale: 1.4 },
			{ size: 24, color: 'rgb(20, 184, 166)', opacity: 45, blur: 'blur-2xl', animation: 'animate-float', scale: 1.3 },
			{ size: 32, color: 'rgb(99, 102, 241)', opacity: 35, blur: 'blur-3xl', animation: 'animate-float-slow', scale: 1.5 },
			{ size: 40, color: 'rgb(139, 92, 246)', opacity: 35, blur: 'blur-3xl', animation: 'animate-float-slower', scale: 1.6 },
		].map(point => ({
			...point,
			top: Math.random() * 80 + 10,
			left: Math.random() * 80 + 10,
		}));

		setGlowPoints(points);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center h-screen relative overflow-auto cursor-default">
			<div className="absolute inset-0">
				{glowPoints.map((point, index) => (
					<div
						key={index}
						className={`glow-point absolute rounded-full ${point.blur} ${point.animation}`}
						style={{
							top: `${point.top}%`,
							left: `${point.left}%`,
							width: `${point.size}px`,
							height: `${point.size}px`,
							background: `radial-gradient(circle at center, ${point.color} ${point.opacity}%, transparent 70%)`,
							transform: `scale(${point.scale})`,
							boxShadow: `0 0 ${point.size * 2}px ${point.size}px ${point.color}`
						}}
					/>
				))}
			</div>

			<div className="bg-black/40 backdrop-blur-sm w-full h-full flex flex-col items-center justify-center gap-8 relative z-10">
				<h1 className="text-8xl font-bold font-geist-sans text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 sticky top-4 left-4 hover:scale-105 peer-[.scrolled]:opacity-0">DoContrib</h1>
				<div className="text-white text-lg animate-bounce absolute bottom-4">
					<i className="animate-bounce fa fa-arrow-down">▼</i>
				</div>
			</div>

			{/* <div className="container mx-auto px-4 py-20">
				<h1 className="text-4xl font-bold mb-8 align-middle text-white">歡迎使用 DoContrib</h1>

				<section className="space-y-6 text-white">
					<div>
						<h2 className="text-2xl font-semibold mb-4">DoContrib 是什麼？</h2>
						<p>
							DoContrib 是一個開源的團隊貢獻追蹤和管理平台。我們的目標是幫助團隊更有效地追蹤和管理貢獻，提高團隊協作效率。
						</p>
						<p>我們提供了多種功能，包括貢獻進度追蹤、任務分配、團隊成員管理等，讓您能夠輕鬆地管理團隊，提高工作效率。</p>
						<p>此外，DoContrib 還提供了詳細的數據分析和報表，讓您能夠更好地了解團隊的工作狀況，做出更明智的決策。</p>
					</div>

					<div>
						<h2 className="text-2xl font-semibold mb-4">我們的使命</h2>
						<p>
							我們的使命是讓每個團隊都能更好地追蹤和管理貢獻，提高工作效率，實現更好的團隊合作。
						</p>
					</div>

					<div>
						<h2 className="text-2xl font-semibold mb-4">我們的價值觀</h2>
						<ul className="list-disc list-inside space-y-2">
							<li>用戶至上：我們將用戶需求放在首位</li>
							<li>開源透明：我們致力於開源和透明</li>
							<li>持續創新：我們不斷創新，追求卓越</li>
							<li>團隊合作：我們相信團隊合作的力量</li>
						</ul>
					</div>

					<div>
						<h2 className="text-2xl font-semibold mb-4">聯繫我們</h2>
						<p>
							如果您有任何問題或建議，請隨時與我們聯繫：
						</p>
						<ul className="list-disc list-inside space-y-2 mt-2">
							<li>電子郵件：
								<a href="mailto:docontrib@gmail.com" className="text-blue-400 hover:underline">docontrib@gmail.com</a>
							</li>
							<li>社群：
								<a href="https://discord.gg/EqA35cDEW5" className="text-blue-400 hover:underline">Discord 伺服器</a>
							</li>
						</ul>
					</div>
				</section>
			</div> */}
		</div>
	);
}

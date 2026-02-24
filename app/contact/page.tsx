import Link from 'next/link'

export default function Contact() {
    return (
        <div className="container mx-auto justify-center flex flex-col items-center gap-4 p-4 h-screen">
            <h1 className="text-2xl font-semibold mb-4">聯繫我們</h1>
            <p>如果您有任何問題或建議，請隨時與我們聯繫：</p>
            <ul className="list-disc list-inside space-y-2 mt-2 items-center space-x-1">
                <li>
                    電子郵件：
                    <Link
                        href="mailto:docontrib@gmail.com"
                        className="text-blue-400 hover:underline"
                    >
                        docontrib@gmail.com
                    </Link>
                </li>
                <li>
                    社群：
                    <Link
                        href="https://discord.gg/EqA35cDEW5"
                        className="text-blue-400 hover:underline"
                    >
                        Discord 伺服器
                    </Link>
                    <iframe
                        src="https://discord.com/widget?id=1333687662636302357&theme=dark"
                        width="280"
                        height="400"
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        className='top-2'
                    ></iframe>
                </li>
            </ul>
        </div>
    )
}

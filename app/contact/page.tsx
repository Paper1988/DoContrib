export default function Contact() {
    return (
        <div className="container mx-auto justify-center flex flex-col items-center gap-4 p-4 h-screen">
            <h1 className="text-2xl font-semibold mb-4">聯繫我們</h1>
            <p>如果您有任何問題或建議，請隨時與我們聯繫：</p>
            <ul className="list-disc list-inside space-y-2 mt-2 items-left">
                <li>
                    電子郵件：
                    <a href="mailto:docontrib@gmail.com" className="text-blue-400 hover:underline">
                        docontrib@gmail.com
                    </a>
                </li>
                <li>
                    社群：
                    <a
                        href="https://discord.gg/EqA35cDEW5"
                        className="text-blue-400 hover:underline"
                    >
                        Discord 伺服器
                    </a>
                </li>
                <li>
                    <iframe
                        src="https://discord.com/widget?id=1333687662636302357&theme=dark"
                        width="350"
                        height="500"
                        allowTransparency={true}
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                    ></iframe>
                </li>
            </ul>
        </div>
    )
}

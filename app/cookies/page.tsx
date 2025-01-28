export default function CookiesPolicy() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="bg-black w-full h-full flex flex-col items-center justify-center gap-8">
                <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-sm transform transition-transform duration-300 -translate-y-full peer-[.scrolled]:translate-y-0 z-50">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">DoContrib</h2>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-20">
                    <h1 className="text-4xl font-bold mb-8 text-white">Cookie 政策</h1>
                    
                    <section className="space-y-6 text-white">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">什麼是 Cookie？</h2>
                            <p>
                                Cookie 是網站儲存在您裝置上的小型文字檔案。這些檔案能協助網站記住您的偏好設定，提供更好的使用體驗。
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">我們如何使用 Cookie？</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li>必要性 Cookie：確保網站正常運作的基本功能</li>
                                <li>分析性 Cookie：幫助我們了解使用者如何使用網站</li>
                                <li>功能性 Cookie：記住您的偏好設定</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">如何管理 Cookie？</h2>
                            <p>
                                您可以透過瀏覽器設定來管理或刪除 Cookie。請注意，停用某些 Cookie 可能會影響網站的功能。
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4">更新政策</h2>
                            <p>
                                我們保留隨時更新本 Cookie 政策的權利。重大變更時，我們會在網站上發布通知。
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

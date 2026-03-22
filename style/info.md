DoContrib UI Guidelines 核心規範整理

一、 設計哲學
定位：高資訊密度、乾淨、克制、工業感。
目標：SaaS 產品工具介面（參考 Linear, Vercel）。
核心：避免過度裝飾，強調整潔的層次與邊框邏輯。

二、 色彩與材質系統

背景層次：
頁面底層：dark:bg-[#0a0a0a] / bg-[#fdfbfa]
卡片/容器層：dark:bg-[#111] / bg-white
次層元素/輸入框：dark:bg-white/5 / bg-gray-50

邊框與分隔線：
主要邊框：dark:border-white/8 / border-gray-200
Hover 邊框：dark:border-white/15 / border-gray-300
分隔線：dark:bg-white/5 / bg-gray-100

文字層次：
主要文字：dark:text-white / text-gray-900
次要文字：dark:text-gray-400 / text-gray-500
禁用/三級文字：dark:text-gray-500 / text-gray-400

狀態與品牌：
主要藍色：bg-blue-600 (Hover: bg-blue-700)
成功/警告/錯誤：text-green-500 / text-orange-500 / text-red-500

三、 排版與字級規範
標題：
頁面標題：text-xl font-bold (上限 text-2xl)
區塊標題：text-sm font-semibold

內文：
標準內文：text-sm
次要說明：text-xs

標籤 (Badge)：
text-[10px] font-semibold uppercase tracking-wider

禁止使用：
禁止 font-black 與超大字級。
禁止 tracking-[0.2em] 等過度誇張字距。

四、 元件規範
Navbar (AppNavbar)：
高度 h-14，sticky top-0，backdrop-blur-xl。
邊框 border-b (dark:border-white/5)。
Breadcrumb：非末項為可點擊 Button，末項為純文字。

Card：
圓角 rounded-2xl，內距 p-5。
動效：hover:shadow-md，禁止大幅位移或縮放。

Button：
主要：h-8, px-4, rounded-lg, text-xs, font-semibold。

Input：
圓角 rounded-xl, 高度 h-10, text-sm。
禁止底部單線設計，改用全框填充背景。

Context Menu：
寬度 w-52, 圓角 rounded-xl, 強磨砂感。
破壞性操作（刪除）置於末位並使用紅色。

五、 佈局結構
容器：max-w-6xl mx-auto px-4 sm:px-6 py-8。
雙欄佈局：lg:w-72 (Sidebar) + flex-1 (Main)。
網格：
專案列表：grid-cols-1 sm:grid-cols-2 lg:grid-cols-3, gap-4。
統計數據：grid-cols-2 sm:grid-cols-3, gap-4。

六、 動畫與交互
進入動畫：initial={{ opacity: 0, y: 12 }}, animate={{ opacity: 1, y: 0 }}。
列表動畫：搭配 index * 0.04 的交錯延遲。
禁止：whileHover {{ y: -8 }}, scale-105 等劇烈動效。

七、 絕對禁用清單 (Anti-Patterns)
禁用背景光暈 (blur-[120px]) 與網格背景 (bg-grid)。
禁用超大圓角 (rounded-[40px])。
禁用漸層色條作為 Hover 指示。
禁用 Headless UI 與 MUI。
禁用 async function 與 'use client' 在同一檔案共存。
禁用在 Client Component 使用 await params。

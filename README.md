# DoContrib

> 讓團隊貢獻更透明、協作更高效的開源平台

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-Realtime-orange)](https://liveblocks.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 簡介

DoContrib（Documentation & Contribution）是一個全端開源協作平台，讓團隊能夠即時共同編輯文件，並透明化每位成員的貢獻度。無論是字數統計、編輯次數或工作時長，每一筆付出都被記錄與視覺化。

**核心理念：讓 Carry 全場的隊友被看見。**

---

## 功能特色

- **即時協作編輯** — 基於 Liveblocks CRDT 技術，毫秒級文字同步，支援多人游標顯示
- **貢獻度追蹤** — 自動統計每位成員的新增字數、刪除字數、編輯次數與工作時長
- **專案工作區** — 邀請碼機制、成員角色管理（Owner / Editor / Viewer）
- **Rich Text 編輯器** — 基於 Tiptap 3，支援標題、清單、程式碼區塊、圖片嵌入、YouTube 嵌入
- **磨砂玻璃 UI** — 極簡 glassmorphism 設計語言，支援深色 / 淺色模式
- **Google OAuth 登入** — 透過 NextAuth.js 整合 Google 帳號

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 語言 | TypeScript 5 |
| 樣式 | Tailwind CSS 4 + shadcn/ui |
| 動畫 | Framer Motion |
| 資料庫 | Supabase (PostgreSQL) |
| 認證 | NextAuth.js + Supabase Adapter |
| 即時協作 | Liveblocks |
| 編輯器 | Tiptap 3 |
| HTTP 客戶端 | Axios |
| 部署 | Vercel |

---

## 快速開始

### 前置需求

- Node.js 20+
- Yarn 4

### 安裝

```bash
git clone https://github.com/Paper1988/DoContrib.git
cd DoContrib
yarn install
```

### 環境變數設定

複製範例檔並填入對應的金鑰：

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET=
```

### 啟動開發伺服器

```bash
yarn dev
```

打開 [http://localhost:3000](http://localhost:3000) 即可看到結果。

---

## 專案結構

```
DoContrib/
├── app/                    # Next.js App Router 頁面與 API
│   ├── api/                # API Routes
│   │   ├── auth/           # NextAuth.js 認證端點
│   │   ├── contributions/  # 貢獻度追蹤 API
│   │   ├── liveblocks-auth/# Liveblocks 授權端點
│   │   ├── profile/        # 使用者個人資料 API
│   │   └── projects/       # 專案與文件 API
│   ├── projects/           # 專案相關頁面
│   └── user/               # 使用者個人頁面與儀表板
├── components/             # 共用 React 元件
│   ├── navigation/         # Navbar 元件
│   ├── project/            # 專案相關元件
│   └── ui/                 # shadcn/ui 元件
├── hooks/                  # 自訂 React Hooks
├── lib/                    # 工具函式與設定
│   ├── auth.ts             # NextAuth 設定
│   ├── supabase/           # Supabase 客戶端
│   └── api.ts              # Axios 實例
├── primitives/             # 底層 UI 基礎元件
└── style/                  # 全域樣式
```

---

## 貢獻指南

請參閱 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解完整開發規範。

簡要流程：

1. Fork 此 repo 並在本地執行 `yarn install`
2. 從 `develop` 建立功能分支：`feat/your-feature`
3. 提交訊息須遵循 [Conventional Commits](https://www.conventionalcommits.org) 規範
4. 提交 Pull Request 並說明改動內容

> 本專案已啟用 Husky + commitlint，不符合規範的提交訊息會被自動攔截。

---

## 授權

本專案基於 [MIT License](./LICENSE) 開源授權。

---

## 貢獻者

- [Paper1988](https://github.com/Paper1988)
- [Njdgee](https://github.com/Njdgee)

---

*Made with ❤️ in Taiwan*

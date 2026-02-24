# To-do List

## Stage I： Core Feature

### 1. Implementing Liveblocks Authencating Backend Entry Point (Next.js App Router Route Handler / Server Action)

- [x] 建立 `/app/api/liveblocks/auth/route.ts`。
- [x] 在 Route Handler 中，獲取當前用戶的 **NextAuth Session**。
- [ ] 使用 Liveblocks SDK 的 `authorize` 方法，並傳遞 NextAuth Session 中的用戶 ID、姓名、頭像等資訊。
- [ ] 返回 Liveblocks 簽名後的 token 給前端。
- [ ] **重要：** 確保只有**已登入**的用戶才能成功取得 Liveblocks token。

### 2. Integrating Tiptap Editor and Liveblocks Collaboration Feature

- [x] 在文件編輯頁面元件中 (例如 `app/documents/[id]/page.tsx` 或其子元件)。
- [x] **安裝** `@liveblocks/tiptap` 套件。
- [ ] **初始化 Liveblocks 客戶端**並**進入房間** (使用路由中的 `documentId` 作為 `roomId`)。
- [ ] **初始化 Tiptap Editor**。
- [ ] 將 `LiveblocksExtension`、`Collaboration`、`CollaborationCursor` 擴展加入 Tiptap 的 `extensions` 中，並傳入 Liveblocks 的 `room` 實例。
- [ ] **從 Supabase 加載文件內容**：當頁面載入時，從 Supabase 讀取該文件的 `content` (Tiptap JSON 格式)，並設定到 Tiptap 編輯器中。
- [ ] **將編輯器內容儲存回 Supabase**：
- [ ] 監聽 Tiptap 的 `update` 事件。
- [ ] 當內容有變動時，將 Tiptap 編輯器的 JSON 內容保存回 Supabase 的 `documents` 表中。
- [ ] 考慮**去抖 (debounce)** 或**節流 (throttle)** 儲存操作，避免每次敲擊鍵盤都觸發儲存，造成效能問題。

### 3. Beautifying Editor UI (MUI + Tailwind CSS)

- [ ] 設計並實作 Tiptap 編輯器的**工具列** (例如粗體、斜體、標題等按鈕)。
- [ ] 為 Tiptap 編輯器內容區域 (通常是 `.ProseMirror` 類別) 撰寫 **CSS 樣式**，使其符合 DoContrib 的設計風格：
  - [ ] 設定 `min-height`、`padding`。
  - [ ] 美化文字、標題、列表、引用的樣式。
  - [ ] 確保協作光標 (`.collaboration-cursor__caret`) 和選區 (`.collaboration-cursor__selection`) 的樣式清晰可見。

---

## Stage II： User and Group Managament

### 1. Design Supabase Database Schema

- [x] `users` 表：確認有無 `id` (來自 NextAuth/Google)、`name`、`email`、`avatar_url` 等。
- [ ] `groups` 表：`id` (UUID), `name` (群組名稱), `owner_id` (UUID，外鍵到 `users.id`), `created_at`。
- [ ] `group_members` 表：`group_id` (UUID，外鍵到 `groups.id`), `user_id` (UUID，外鍵到 `users.id`), `role` (例如 `'admin'`, `'member'`), `joined_at`。**設定聯合主鍵 `(group_id, user_id)`。**
- [ ] 更新 `documents` 表：新增 `group_id` (UUID，外鍵到 `groups.id`，可為 null)，表示文件可屬於群組或個人。

### 2. Group Creating and Managing

- [ ] 建立群組創建頁面/模組，讓用戶可以設定群組名稱。
- [ ] 在 Next.js App Router 中實作對應的 Server Action / Route Handler 來處理群組創建，將資料存入 Supabase 的 `groups` 表，並將創建者加入 `group_members` 表。
- [ ] 實作群組列表頁面，顯示用戶所屬的群組。

### 3. Invite Friends to Group Function

- [ ] 在群組管理介面中，提供邀請入口 (例如輸入 Email 或用戶名)。
- [ ] 後端邏輯：根據輸入的 Email/用戶名查詢 `users` 表。
- [ ] 如果用戶存在：
- [ ] 發送**邀請通知** (站內通知或 Email)。
- [ ] 將被邀請者加入 `group_members` 表 (可考慮 `status` 欄位，例如 `'pending'` 和 `'accepted'`)。
- [ ] 如果用戶不存在：提示用戶不存在。
- [ ] **考慮實作邀請連結功能**：生成一個帶有群組 ID 的邀請連結，使用者點擊即可加入。

### 4. Integrating Documentation and Group Permissions

- [ ] 在文件編輯頁面載入文件前，在後端 (Next.js Server Components 或 Route Handler) **驗證用戶是否有權限**編輯該文件（例如，是文件的 `owner`，或是該文件所屬 `group` 的 `member`）。

---

## Stage III： Improvements and Optimizations (Future, Optional)

### 1. Display Liveblocks Presence Online Members

- [ ] 利用 Liveblocks 房間的 `getPresence()` Observable，在編輯器介面旁顯示當前正在編輯同一文件的用戶頭像和名稱。

### 2. The Logic behind Contributing Progression Tracking

- [ ] **數據收集**：當 Tiptap 編輯器內容變化時，獲取 Tiptap 編輯器產生的**操作 (transactions)**。
- [ ] **數據儲存**：將這些操作數據（連同 Liveblocks 的 `userId` 或 Supabase 的用戶 ID）儲存到 Supabase 的一個新表（例如 `document_contributions`）。
- [ ] **分析展示**：設計後端邏輯（Supabase Postgres Function 或獨立後端服務）來分析這些儲存的操作數據，計算每個用戶在特定文件上的**貢獻量** (例如字數增減、編輯次數等)。
- [ ] 在前端設計介面來**展示這些貢獻報告**。

### 3. Error Handling and User Feedbacks

- [ ] 為所有 API 呼叫和資料庫操作添加**錯誤處理**。
- [ ] 給予用戶清晰的**載入、成功、失敗狀態回饋** (例如 MUI 的 `Snackbar` 或 `AlertDialog`)。

### 4. Deployment and Monitor

- [x] 確認 **Vercel 部署**流程順暢，並設定好環境變數 (例如 Liveblocks API Key, Supabase URL/Anon Key)。
- [x] 利用 Vercel 或 Liveblocks 的儀表板監控應用程式的運行狀態。

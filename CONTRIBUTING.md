# Contributing to DoContrib

感謝您對 DoContrib (Documentation & Contribution) 的關注。為了維護專案代碼品質並確保開發流程的一致性，所有貢獻者均須遵守以下規範。

## 1. 開發流程 (Development Workflow)

本專案採用標準的分支管理策略：

1. **Fork 與本地建置**：將本倉庫 Fork 至您的帳戶，並於本地執行 `yarn install`。
2. **建立功能分支**：請從 `develop` 分支建立新分支，命名規範為 `feat/feature-name` 或 `fix/bug-name`。
3. **實作改動**：開發時請遵循專案既有的代碼風格（Minimalist Design Principles）。
4. **提交與推送**：完成開發後，請確保通過本地的 Git Hooks 檢查，再推送到您的遠端倉庫。

## 2. 提交訊息規範 (Commit Message Standards)

DoContrib 強制執行 **Conventional Commits** 規範。所有提交訊息必須符合以下格式：

`<type>: <description>`

### 允許的類型 (Types)：
- **feat**: 新增功能。
- **fix**: 修復錯誤。
- **docs**: 僅限文件、說明檔的異動。
- **style**: 不影響程式邏輯的格式更動（如空白、分號、縮排等）。
- **refactor**: 代碼重構，既非修復錯誤也非新增功能。
- **chore**: 建置流程或輔助工具的變動（如更新依賴庫）。

> [!CAUTION]
> 本專案已啟用 Husky 進行自動化檢查。若提交訊息未符合上述規範，系統將自動攔截並拒絕提交。

## 3. 合併請求說明 (Pull Request Requirements)

在提交 Pull Request (PR) 之前，請確認：
- 程式碼已針對最新版本的 `develop` 分支進行重基（Rebase）。
- PR 描述中應清楚說明改動內容及其必要性。
- 若改動涉及介面或文件，請確保 **Document & Contrib** 的一致性。

## 4. 代碼審核 (Code Review)

所有 PR 均須經由維護者審核後方可合併。審核標準包括代碼的簡潔度、效能表現以及是否符合專案的設計規範。

---
*Last updated: 2026-03-21*
